"use client";
import React from "react";
import { ChatProvider } from "./ChatProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ConversationProvider } from "./ConversationProvider";
import { ApiKeyProvider } from "./ApiKeyProvider";
import { SidebarProvider } from "./SidebarProvider";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApiKeyProvider>
      <ConversationProvider>
        <ChatProvider>
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </ChatProvider>
      </ConversationProvider>
    </ApiKeyProvider>
  );
}
