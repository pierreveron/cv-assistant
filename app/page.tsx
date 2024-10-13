"use client";
import React from "react";
import ChatComponent from "./components/ChatComponent";
import ModelSelector from "./components/ModelSelector";
import { useChat } from "./providers/ChatProvider";
import { useTheme } from "./providers/ThemeProvider";
import classNames from "classnames";

export default function Home() {
  const { resetChat } = useChat();
  const { toggleTheme, isDarkMode } = useTheme();

  return (
    <main className="tw-flex tw-flex-col tw-h-screen">
      <div className="tw-flex tw-justify-between tw-items-center tw-p-4">
        <button
          onClick={toggleTheme}
          className={classNames(
            "tw-p-2 tw-rounded-full tw-transition-colors",
            "tw-text-gray-900 hover:tw-bg-gray-200",
            "dark:tw-text-white dark:hover:tw-bg-gray-800"
          )}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
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
              className="icon icon-tabler icons-tabler-outline icon-tabler-sun"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
              <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
            </svg>
          ) : (
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
              className="icon icon-tabler icons-tabler-outline icon-tabler-moon"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
            </svg>
          )}
        </button>

        <ModelSelector />

        <button
          onClick={resetChat}
          className={classNames(
            "tw-p-2 tw-rounded-full tw-transition-colors",
            "tw-text-gray-900 hover:tw-bg-gray-200",
            "dark:tw-text-white dark:hover:tw-bg-gray-800"
          )}
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
            className="icon icon-tabler icons-tabler-outline icon-tabler-refresh"
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
