import { Mistral } from "@mistralai/mistralai";
import { Message } from "./types";

export type Model =
  | "mistral-large-latest"
  | "mistral-small-latest"
  | "codestral-latest"
  | "pixtral-12b-2409"
  | "open-mistral-nemo";

export async function completeResponse(
  messages: Message[],
  params: {
    apiKey: string;
    model?: Model;
    abortSignal?: AbortSignal;
  }
): Promise<string | null> {
  const mistral = new Mistral({
    apiKey: params.apiKey,
  });

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
  params: {
    apiKey: string;
    model?: Model;
    abortSignal?: AbortSignal;
  }
): AsyncGenerator<string, void, unknown> {
  const mistral = new Mistral({
    apiKey: params.apiKey,
  });

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
