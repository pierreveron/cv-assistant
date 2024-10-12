import { Mistral } from "@mistralai/mistralai";
import { Message } from "./types";

const mistral = new Mistral({
  apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY ?? "",
});

export async function completeResponse(
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

export async function* streamResponse(
  messages: Message[],
  params?: {
    model?: string;
    abortSignal?: AbortSignal;
  }
): AsyncGenerator<string, void, unknown> {
  const stream = await mistral.chat.stream(
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

  for await (const event of stream) {
    // Handle the event
    console.log(event);

    if (event.data.choices[0]?.delta?.content) {
      yield event.data.choices[0].delta.content;
    }
  }
}
