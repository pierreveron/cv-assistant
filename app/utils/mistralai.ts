import { Mistral } from "@mistralai/mistralai";
import { Message } from "./types";

const mistral = new Mistral({
  apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY ?? "",
});

export async function run(
  messages: Message[],
  params?: {
    model?: string;
    abortSignal?: AbortSignal;
  }
): Promise<string | null> {
  const result = await mistral.chat.complete(
    {
      model: params?.model ?? "mistral-small-latest",
      messages: messages.map((message) => ({
        content: message.text,
        role: message.sender === "user" ? "user" : "assistant",
      })),
    },
    {
      fetchOptions: {
        signal: params?.abortSignal,
      },
    }
  );

  return result.choices?.[0].message.content || null;
}
