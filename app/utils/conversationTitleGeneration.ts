import { Message } from "./types";
import { completeResponse, Model } from "./mistralai";

const TITLE_SYSTEM_PROMPT = `You are a helpful AI assistant.
Your task is to generate a short, concise title (maximum 5 words) that summarizes the main topic or theme of the given conversation.
Focus on the key points discussed and provide a clear, informative title.
Don't include "Title: " in your response. Don't add quotation marks.
Generate only a title.`;

const formatTitlePrompt = (
  messages: Message[]
): { role: "system" | "user"; content: string }[] => {
  const conversationSummary = messages
    .map((m) => `${m.sender}: ${m.text}`)
    .join("\n");
  const titlePrompt = `Please provide a short title (maximum 5 words) for the following conversation:\n\n${conversationSummary}`;

  return [
    { role: "system", content: TITLE_SYSTEM_PROMPT },
    { role: "user", content: titlePrompt },
  ];
};

export async function generateConversationTitle(
  messages: Message[],
  params: {
    apiKey: string;
    model?: Model;
    abortSignal?: AbortSignal;
  }
): Promise<string | null> {
  const title = await completeResponse(formatTitlePrompt(messages), params);
  return title ? title.trim() : null;
}
