"use client";
import React from "react";
import ChatComponent from "./components/ChatComponent";
import { ChatProvider } from "./providers/ChatProvider";

export default function Home() {
  return (
    <ChatProvider>
      <main className="tw-flex tw-flex-col tw-h-screen">
        <h1 className="tw-text-2xl tw-font-bold tw-p-4">Chat App</h1>
        <ChatComponent />
      </main>
    </ChatProvider>
  );
}
