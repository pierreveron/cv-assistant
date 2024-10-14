import { Mistral } from "@mistralai/mistralai";
import { SDKError } from "@mistralai/mistralai/models/errors";
import { Message } from "./types";

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
      messages: formatMessages(messages),
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

  try {
    const stream = await mistral.chat.stream(
      {
        model: params?.model ?? "mistral-small-latest",
        messages: formatMessages(messages),
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
