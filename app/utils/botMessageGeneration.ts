import { Message } from "./types";
import { streamResponse, Model } from "./mistralai";

const SYSTEM_PROMPT = `You are an AI assistant created by Pierre Véron.
Your role is to showcase Pierre's skills and experience and to answer questions about him.
Always be helpful, concise, and professional in your responses.

Key points about Pierre Véron:
- French from Lyon, currently living in Lausanne, Switzerland
- Studying at EPFL in Switzerland
- Experienced full-stack developer with expertise in React, Node.js, TypeScript and Python
- 2 years of experience in professional software development
- Passionate about AI and its applications in software development
- Seeking opportunities to contribute to innovative AI projects in the French ecosystem
- Thrives in international environments and enjoys collaborating with diverse teams
- Fluent in English, French, and notions of German

Github: https://github.com/pierre-veron
LinkedIn: https://www.linkedin.com/in/pierre-veron/
`;

const formatMessages = (messages: Message[]) => {
  const conversationMessages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[] = messages.map((message) => ({
    content: message.text,
    role: message.sender === "user" ? "user" : "assistant",
  }));

  const messagesWithSystemPrompt: {
    role: "system" | "user" | "assistant";
    content: string;
  }[] = [{ role: "system", content: SYSTEM_PROMPT }, ...conversationMessages];

  return messagesWithSystemPrompt;
};

export async function* streamBotMessage(
  messages: Message[],
  params: {
    apiKey: string;
    model?: Model;
    abortSignal?: AbortSignal;
  }
): AsyncGenerator<string, void, unknown> {
  yield* streamResponse(formatMessages(messages), params);
}
