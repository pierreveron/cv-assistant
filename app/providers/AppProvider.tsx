"use client";
import React from "react";
import { ChatProvider } from "./ChatProvider";
import { ThemeProvider } from "./ThemeProvider";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </ChatProvider>
  );
}
