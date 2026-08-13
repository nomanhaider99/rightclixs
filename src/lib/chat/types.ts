/** Shared chat types used by both the support widget and the /api/chat route. */

export type ChatRole = "user" | "assistant";

/** A single turn as sent over the wire to /api/chat. */
export type ChatTurn = {
  role: ChatRole;
  content: string;
};

/** A suggested follow-up link rendered as a chip under an assistant reply. */
export type ChatAction = {
  label: string;
  href: string;
};

/** A message as held in widget state. */
export type ChatMessage = ChatTurn & {
  id: string;
  /** Chips rendered beneath the bubble (e.g. "View pricing"). */
  actions?: ChatAction[];
  /** True when the reply came from the offline responder, not Gemini. */
  offline?: boolean;
  /** True while tokens are still streaming into this message. */
  streaming?: boolean;
  /** True when the turn failed — rendered as an inline error bubble. */
  error?: boolean;
};

/** Number of prior turns forwarded to the model. Keeps the prompt bounded so a
 *  long session can't grow the request (or the bill) without limit. */
export const MAX_HISTORY_TURNS = 12;

/** Hard cap on a single user message, enforced on both client and server. */
export const MAX_MESSAGE_CHARS = 1000;
