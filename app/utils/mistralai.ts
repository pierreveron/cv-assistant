import { Mistral } from "@mistralai/mistralai";
import { SDKError } from "@mistralai/mistralai/models/errors";

export type Model =
  | "mistral-large-latest"
  | "mistral-small-latest"
  | "codestral-latest"
  | "pixtral-12b-2409"
  | "open-mistral-nemo";

export class InvalidApiKeyError extends Error {
  constructor(message: string = "Invalid API key") {
    super(message);
    this.name = "InvalidApiKeyError";
  }
}

export async function completeResponse(
  messages: {
    role: "system" | "user" | "assistant" | "tool";
    content: string;
  }[],
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
      messages,
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
  messages: {
    role: "system" | "user" | "assistant" | "tool";
    content: string;
  }[],
  params: {
    apiKey: string;
    model?: Model;
    abortSignal?: AbortSignal;
  }
): AsyncGenerator<string, void, unknown> {
  const mistral = new Mistral({
    apiKey: params.apiKey,
  });

  try {
    const stream = await mistral.chat.stream(
      {
        model: params?.model ?? "mistral-small-latest",
        messages,
      },
      {
        fetchOptions: {
          signal: params?.abortSignal,
        },
      }
    );

    for await (const event of stream) {
      if (event.data.choices[0]?.delta?.content) {
        yield event.data.choices[0].delta.content;
      }
    }
  } catch (err) {
    switch (true) {
      case err instanceof SDKError: {
        console.error(err.message);
        if (err.statusCode === 401) {
          throw new InvalidApiKeyError();
        }
        throw err;
      }
      default: {
        throw err;
      }
    }
  }
}
