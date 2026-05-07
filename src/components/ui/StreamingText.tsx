"use client";

import ReactMarkdown from "react-markdown";

interface Props {
  content: string;
  isStreaming?: boolean;
}

export default function StreamingText({ content, isStreaming }: Props) {
  return (
    <div className="prose prose-sm max-w-none text-gray-800">
      <ReactMarkdown>{content}</ReactMarkdown>
      {isStreaming && (
        <span className="inline-block w-0.5 h-4 bg-teal-600 ml-0.5 animate-pulse" />
      )}
    </div>
  );
}
