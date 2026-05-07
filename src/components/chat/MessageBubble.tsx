import type { Message } from "@/lib/types";
import StreamingText from "@/components/ui/StreamingText";
import LoadingDots from "@/components/ui/LoadingDots";

interface Props {
  message: Message;
  isLastAssistant?: boolean;
  isStreaming?: boolean;
}

export default function MessageBubble({ message, isLastAssistant, isStreaming }: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-teal-600 px-4 py-2.5 text-sm text-white shadow-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm">
        🦐
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 shadow-sm">
        {isLastAssistant && isStreaming && message.content === "" ? (
          <LoadingDots />
        ) : (
          <StreamingText
            content={message.content}
            isStreaming={isLastAssistant && isStreaming}
          />
        )}
      </div>
    </div>
  );
}
