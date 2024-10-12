"use client";
import React from "react";
import ChatComponent from "./components/ChatComponent";
import { useChat } from "./providers/ChatProvider";

export default function Home() {
  const { resetChat } = useChat();

  return (
    <main className="tw-flex tw-flex-col tw-h-screen">
      <div className="tw-flex tw-justify-between tw-items-center tw-p-4">
        <h1 className="tw-text-2xl tw-font-bold">Chat App</h1>
        <button
          onClick={resetChat}
          className="tw-p-2 tw-rounded-full hover:tw-bg-gray-50 tw-transition-colors tw-group"
          title="Reset Chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-refresh group-hover:tw-text-gray-900 tw-transition-colors"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
            <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
          </svg>
        </button>
      </div>
      <ChatComponent />
    </main>
  );
}
