import { Suspense } from "react";
import TransferWorkspace from "@/components/TransferWorkspace";

export const metadata = {
  title: "Transfer Workspace | NexaFlow",
  description: "Transfer your AI conversations while preserving system prompts, memory layers, and user preferences.",
};

function TransferLoader() {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-[#050505]">
      <div className="w-6 h-6 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
    </div>
  );
}

export default function TransferPage() {
  return (
    <Suspense fallback={<TransferLoader />}>
      <TransferWorkspace />
    </Suspense>
  );
}
