"use client";

import { useState } from "react";
import MessageInput from "./MessageInput";

interface Message {
  text: string;
  sender: "user" | "bot";
}

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: string) => {
    setMessages([...messages, { text: message, sender: "user" }]);
  };

  return (
    <div className="tw-flex tw-flex-col tw-h-full">
      <div className="tw-flex-1 tw-overflow-y-auto tw-p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className="tw-mb-2 tw-p-2 tw-bg-gray-400 tw-rounded-xl tw-break-words"
          >
            {message.sender === "user" ? "You: " : "Bot: "}
            {message.text}
          </div>
        ))}
      </div>
      <MessageInput addMessage={addMessage} />
    </div>
  );
}
