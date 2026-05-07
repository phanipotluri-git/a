"use client";

type Status = "checking" | "online" | "offline";

interface Props {
  status: Status;
  onRecheck: () => void;
}

const config: Record<Status, { dot: string; label: string }> = {
  checking: { dot: "bg-gray-400", label: "Checking..." },
  online:   { dot: "bg-green-500", label: "AI Online" },
  offline:  { dot: "bg-red-500",   label: "AI Offline" },
};

export default function StatusIndicator({ status, onRecheck }: Props) {
  const { dot, label } = config[status];
  return (
    <button
      onClick={onRecheck}
      title="Click to recheck AI status"
      className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50"
    >
      <span className={`h-2 w-2 rounded-full ${dot} ${status === "checking" ? "animate-pulse" : ""}`} />
      {label}
    </button>
  );
}
