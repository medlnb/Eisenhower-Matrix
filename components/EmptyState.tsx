"use client";
import empty from "@public/undraw_empty.svg";

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-4 items-center py-4">
      <img src={empty.src} alt="empty" className="w-1/2" />
      <p className="text-gray-700 font-semibold">{label}</p>
    </div>
  );
}

export default EmptyState;
