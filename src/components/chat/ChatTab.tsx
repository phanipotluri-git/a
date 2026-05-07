"use client";

import { useChat } from "@/hooks/useChat";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import ErrorBanner from "@/components/ui/ErrorBanner";

export default function ChatTab() {
  const { messages, isStreaming, error, send } = useChat();

  return (
    <div className="flex h-full flex-col">
      {error && (
        <div className="px-4 pt-3">
          <ErrorBanner error={error} />
        </div>
      )}
      <MessageList messages={messages} isStreaming={isStreaming} />
      <ChatInput onSend={send} disabled={isStreaming} />
    </div>
  );
}
