"use client";
import React from "react";
import { ChatProvider } from "./ChatProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ApiKeyProvider } from "./ApiKeyProvider";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApiKeyProvider>
      <ChatProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ChatProvider>
    </ApiKeyProvider>
  );
}
