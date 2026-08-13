import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";
import type { NextRequest } from "next/server";

import { SYSTEM_INSTRUCTION } from "@/lib/chat/knowledge";
import { offlineReply } from "@/lib/chat/offline-engine";
import { MAX_HISTORY_TURNS, MAX_MESSAGE_CHARS, type ChatTurn } from "@/lib/chat/types";

/**
 * POST /api/chat — streams a grounded reply for the support widget's AI Agent.
 *
 * Responds with `text/plain` chunks so the client can render tokens as they
 * land. `x-chat-source` on the response says which engine answered:
 *   gemini  — a live model response
 *   offline — the retrieval fallback in lib/chat/offline-engine.ts
 *
 * The fallback matters: this widget sits on every page of a lead-generating
 * site, so a missing key, a quota error or a Google outage must degrade to a
 * useful answer rather than a dead chat box.
 */

// Streaming + per-request env reads; never prerender or cache this.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

function apiKey(): string | undefined {
  return process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
}

/* ------------------------------------------------------------------ *
 * Rate limiting
 *
 * In-memory and therefore per-instance: it throttles a single abusive
 * client hitting one server, which is what a public chat box mostly
 * needs. It is NOT a global limit — on multi-instance hosting each
 * instance keeps its own counters. Move to Redis/Upstash before this
 * is load-bearing against a determined attacker.
 * ------------------------------------------------------------------ */
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 15;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic sweep so idle keys don't accumulate for the process lifetime.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/** Emit a whole string as a single-chunk stream (used by every fallback path). */
function textStream(body: string, source: "offline" | "error", status = 200) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-chat-source": source,
    },
  });
}

/** Narrow untrusted JSON into a bounded, well-formed turn list plus the message
 *  we must answer. Returns null when the payload can't be used. */
function parseTurns(raw: unknown): { turns: ChatTurn[]; lastUserMessage: string } | null {
  if (!raw || typeof raw !== "object" || !Array.isArray((raw as { messages?: unknown }).messages)) {
    return null;
  }
  const turns = (raw as { messages: unknown[] }).messages
    .filter(
      (m): m is ChatTurn =>
        !!m &&
        typeof m === "object" &&
        ((m as ChatTurn).role === "user" || (m as ChatTurn).role === "assistant") &&
        typeof (m as ChatTurn).content === "string" &&
        (m as ChatTurn).content.trim().length > 0,
    )
    .slice(-MAX_HISTORY_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));

  // The model needs a user turn to answer; a history ending in an assistant
  // turn means the client sent us something malformed.
  const last = turns.at(-1);
  if (!last || last.role !== "user") return null;
  return { turns, lastUserMessage: last.content };
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return textStream("That message didn't come through. Try sending it again.", "error", 400);
  }

  const parsed = parseTurns(body);
  if (!parsed) {
    return textStream("That message didn't come through. Try sending it again.", "error", 400);
  }
  const { turns, lastUserMessage } = parsed;

  if (rateLimited(clientIp(req))) {
    return textStream(
      `You're sending messages faster than I can answer. Give it a minute — or skip the queue on the "Real Assistant" tab.`,
      "error",
      429,
    );
  }

  const key = apiKey();
  if (!key) {
    // Unconfigured deployment. Answer from site data rather than failing.
    return textStream(offlineReply(lastUserMessage), "offline");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const result = await ai.models.generateContentStream({
      model: MODEL,
      contents: turns.map((t) => ({
        // Gemini names the assistant role "model".
        role: t.role === "assistant" ? "model" : "user",
        parts: [{ text: t.content }],
      })),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6,
        maxOutputTokens: 700,
        // A sales assistant that lectures a visitor on safety is worse than one
        // that answers; keep only the categories that matter for brand safety.
        safetySettings: [
          HarmCategory.HARM_CATEGORY_HARASSMENT,
          HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        ].map((category) => ({
          category,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        })),
      },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let sent = 0;
        try {
          for await (const chunk of result) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
              sent += text.length;
            }
          }
          // An empty stream means a safety block or an empty candidate — the
          // visitor still deserves an answer.
          if (sent === 0) {
            controller.enqueue(encoder.encode(offlineReply(lastUserMessage)));
          }
        } catch (err) {
          console.error("[api/chat] stream error:", err);
          // Mid-stream failure: if nothing has rendered yet we can still
          // substitute the fallback. If tokens are already on screen, close
          // with a short note rather than contradicting what's displayed.
          controller.enqueue(
            encoder.encode(
              sent === 0
                ? offlineReply(lastUserMessage)
                : `\n\n(Sorry — that reply got cut off. Ask again, or try the "Real Assistant" tab.)`,
            ),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        "x-chat-source": "gemini",
        // Stop proxies buffering the stream into one lump.
        "x-accel-buffering": "no",
      },
    });
  } catch (err) {
    // Bad key, quota exhausted, network failure — all land here before a single
    // token streams, so the fallback answer is clean.
    console.error("[api/chat] gemini request failed:", err);
    return textStream(offlineReply(lastUserMessage), "offline");
  }
}
