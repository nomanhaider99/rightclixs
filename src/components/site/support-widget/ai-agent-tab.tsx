"use client";

import Link from "next/link";
import { ArrowUpRight, Headset, RefreshCw, Send, Sparkles, WifiOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { suggestActions } from "@/lib/chat/actions";
import { MAX_HISTORY_TURNS, MAX_MESSAGE_CHARS, type ChatMessage } from "@/lib/chat/types";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Opening prompts shown in the empty state — the questions visitors actually ask. */
const STARTERS = [
  "What does a 5-page website cost?",
  "Which package suits a new business?",
  "How long does an SEO campaign take?",
  "Can you redesign my existing site?",
];

let idCounter = 0;
const nextId = () => `m${++idCounter}`;

/**
 * The AI Agent channel.
 *
 * Streams from POST /api/chat and renders tokens as they land. The route always
 * returns prose — falling back to a grounded offline answer when Gemini is
 * unavailable — so this component only handles a genuine transport failure.
 */
export function AiAgentTab({
  active,
  onRequestHuman,
}: {
  active: boolean;
  onRequestHuman: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const reduced = usePrefersReducedMotion();

  // Focus the composer when this tab becomes visible, but never on a touch
  // device where it would throw up the keyboard over the conversation.
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(pointer: fine)").matches) {
      inputRef.current?.focus();
    }
  }, [active]);

  // Cancel any in-flight stream if the widget unmounts mid-reply.
  useEffect(() => () => abortRef.current?.abort(), []);

  // Keep the newest content in view as tokens stream in.
  useIsomorphicLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, busy, reduced]);

  async function send(text: string) {
    const content = text.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!content || busy) return;

    const userMsg: ChatMessage = { id: nextId(), role: "user", content };
    const replyId = nextId();

    // Snapshot the history for the request before the optimistic update, so we
    // send exactly the turns that existed plus this one.
    const history = [...messages, userMsg]
      .filter((m) => !m.error)
      .slice(-MAX_HISTORY_TURNS)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: replyId, role: "assistant", content: "", streaming: true },
    ]);
    setDraft("");
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      const offline = res.headers.get("x-chat-source") !== "gemini";

      if (!res.body) throw new Error("no response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === replyId ? { ...m, content: acc } : m)),
        );
      }
      acc += decoder.decode();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === replyId
            ? {
                ...m,
                content: acc,
                streaming: false,
                offline,
                actions: suggestActions(content, acc),
              }
            : m,
        ),
      );
    } catch (err) {
      // An abort is a deliberate teardown, not a failure worth reporting.
      if ((err as Error)?.name === "AbortError") return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === replyId
            ? {
                ...m,
                streaming: false,
                error: true,
                content:
                  "I couldn't reach the assistant just then. Check your connection and try again — or switch to the Real Assistant tab and a strategist will help.",
              }
            : m,
        ),
      );
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      {/* ------------------------------ transcript ------------------------------ */}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation with the AI agent"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5"
      >
        {isEmpty ? (
          <EmptyState onPick={send} />
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((m) => (
              <Bubble key={m.id} message={m} reduced={reduced} />
            ))}
            {busy && messages[messages.length - 1]?.content === "" && <TypingBubble />}
          </div>
        )}
      </div>

      {/* ------------------------------- composer ------------------------------- */}
      <div className="shrink-0 border-t border-border bg-background px-3 pt-3 pb-3">
        {!isEmpty && (
          <div className="mb-2 flex items-center justify-between px-1">
            <button
              type="button"
              onClick={onRequestHuman}
              className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-indigo transition-opacity hover:opacity-75"
            >
              <Headset className="size-3.5" />
              Talk to a human
            </button>
            <button
              type="button"
              onClick={() => {
                abortRef.current?.abort();
                setMessages([]);
              }}
              className="flex cursor-pointer items-center gap-1.5 text-xs text-heading/45 transition-colors hover:text-heading"
            >
              <RefreshCw className="size-3.5" />
              New chat
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(draft);
          }}
          className={cn(
            "flex items-end gap-2 rounded-3xl border border-border bg-neutral-soft py-1.5 pr-1.5 pl-4",
            "transition-colors focus-within:border-indigo/45 focus-within:bg-background",
          )}
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={draft}
            maxLength={MAX_MESSAGE_CHARS}
            onChange={(e) => {
              setDraft(e.target.value);
              // Auto-grow to fit, capped so the transcript keeps most of the panel.
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
            }}
            onKeyDown={(e) => {
              // Enter sends; Shift+Enter breaks the line.
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(draft);
              }
            }}
            placeholder="Ask about services, pricing, timelines…"
            aria-label="Message the AI agent"
            className="max-h-24 min-h-[36px] flex-1 resize-none self-center bg-transparent py-2 text-sm leading-relaxed text-heading placeholder:text-heading/40 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!draft.trim() || busy}
            aria-label="Send message"
            className={cn(
              "grid size-9 shrink-0 cursor-pointer place-items-center rounded-full transition-all duration-200",
              "bg-indigo text-white shadow-[0_8px_20px_-8px_rgba(98,96,255,0.9)]",
              "hover:bg-indigo/90 focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:bg-heading/15 disabled:text-heading/40 disabled:shadow-none",
            )}
          >
            <Send className="size-4" />
          </button>
        </form>

        <p className="mt-2 px-1 text-center text-[11px] leading-relaxed text-heading/40">
          AI can make mistakes — confirm pricing and scope with a strategist.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Pieces
 * ------------------------------------------------------------------ */

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center px-1 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-lavender text-indigo">
        <Sparkles className="size-7" />
      </span>
      <h3 className="mt-4 text-lg font-medium text-heading">
        Ask our <span className="serif-accent text-indigo">AI agent</span>
      </h3>
      <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-heading/55">
        Instant answers on services, packages and timelines — drawn from our live
        pricing, not a script.
      </p>

      <div className="mt-6 flex w-full flex-col gap-2">
        {STARTERS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onPick(q)}
            className={cn(
              "group flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-left",
              "text-[13px] leading-snug text-heading/80 transition-all duration-200",
              "hover:-translate-y-0.5 hover:border-indigo/40 hover:bg-lavender/45 hover:text-heading",
              "focus-visible:ring-2 focus-visible:ring-indigo focus-visible:outline-none motion-reduce:hover:translate-y-0",
            )}
          >
            {q}
            <ArrowUpRight className="size-4 shrink-0 text-heading/25 transition-colors group-hover:text-indigo" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Bubble({ message, reduced }: { message: ChatMessage; reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isUser = message.role === "user";

  // Entry animation runs once per bubble, on mount only — re-running it as
  // tokens stream in would restart the fade on every chunk.
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(el, { opacity: 0, y: 10, duration: 0.3, ease: "power2.out" });
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={cn("flex gap-2.5", isUser ? "justify-end" : "justify-start")}>
      {/* Top-aligned, not bottom: a reply with action chips below it would
          otherwise leave the avatar floating beside the chips, not the text. */}
      {!isUser && (
        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-lavender text-indigo">
          <Sparkles className="size-3.5" />
        </span>
      )}

      <div className={cn("flex max-w-[82%] flex-col gap-2", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed",
            isUser
              ? "rounded-br-md bg-indigo text-white"
              : "rounded-bl-md bg-neutral-soft text-heading",
            message.error && "border border-destructive/25 bg-destructive/5 text-heading",
          )}
        >
          <RichText text={message.content} />
          {message.streaming && message.content !== "" && <Caret />}
        </div>

        {message.offline && !message.error && (
          <span className="flex items-start gap-1.5 px-1 text-[11px] leading-relaxed text-heading/40">
            <WifiOff className="mt-0.5 size-3 shrink-0" />
            Answered from our site data — the live assistant is unavailable.
          </span>
        )}

        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.actions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border border-indigo/25 bg-lavender/50 px-3 py-1.5",
                  "text-[12px] font-medium text-indigo transition-colors hover:bg-lavender",
                )}
              >
                {a.label}
                <ArrowUpRight className="size-3" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Renders the agent's plain-text replies. The system prompt forbids markdown,
 * so this only needs to honour paragraph breaks and "- " bullets — a full
 * markdown parser would be weight for no benefit.
 */
function RichText({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split("\n").filter((l) => l.trim() !== "");

  return (
    <>
      {lines.map((line, i) => {
        const bullet = /^[-•*]\s+/.test(line);
        return bullet ? (
          <span key={i} className="flex gap-2 pt-1 first:pt-0">
            <span aria-hidden className="select-none opacity-45">
              •
            </span>
            <span>{line.replace(/^[-•*]\s+/, "")}</span>
          </span>
        ) : (
          <p key={i} className={cn(i > 0 && "mt-2")}>
            {line}
          </p>
        );
      })}
    </>
  );
}

/** Blinking cursor shown at the tail of a streaming reply. */
function Caret() {
  return (
    <span
      aria-hidden
      className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse rounded-full bg-indigo/70"
    />
  );
}

/** Three-dot placeholder shown before the first token arrives. */
function TypingBubble() {
  return (
    <div className="flex items-end gap-2.5">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-lavender text-indigo">
        <Sparkles className="size-3.5" />
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-neutral-soft px-4 py-3.5">
        <span className="sr-only">The agent is typing</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden
            className="size-1.5 animate-bounce rounded-full bg-indigo/55"
            style={{ animationDelay: `${i * 130}ms`, animationDuration: "1s" }}
          />
        ))}
      </div>
    </div>
  );
}
