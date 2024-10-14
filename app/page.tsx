"use client";
import React from "react";
import ChatComponent from "./components/ChatComponent";
import ModelSelector from "./components/ModelSelector";
import { useTheme } from "./providers/ThemeProvider";
import { useSidebar } from "./providers/SidebarProvider";
import classNames from "classnames";
import Link from "next/link";

export default function Home() {
  const { toggleTheme, isDarkMode } = useTheme();
  const { setSidebarOpen } = useSidebar();

  return (
    <>
      <div className="tw-flex tw-justify-between tw-items-center tw-p-4">
        <div className="tw-flex tw-items-center">
          <button
            className={classNames(
              "tw-p-2 tw-rounded-full",
              "tw-text-gray-900 hover:tw-bg-gray-200",
              "dark:tw-text-white dark:hover:tw-bg-gray-800"
            )}
            onClick={() => setSidebarOpen((v) => !v)}
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
              className="icon icon-tabler icons-tabler-outline icon-tabler-layout-sidebar"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
              <path d="M9 4l0 16" />
            </svg>
          </button>

          <Link
            href="/"
            className={classNames(
              "tw-p-2 tw-rounded-full",
              "tw-text-gray-900 hover:tw-bg-gray-200",
              "dark:tw-text-white dark:hover:tw-bg-gray-800"
            )}
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
              className="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M9 12h6" />
              <path d="M12 9v6" />
            </svg>
          </Link>
        </div>

        <ModelSelector />

        <button
          onClick={toggleTheme}
          className={classNames(
            "tw-p-2 tw-rounded-full",
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
      </div>

      <div className="tw-flex-grow tw-overflow-hidden">
        <ChatComponent />
      </div>
    </>
  );
}
