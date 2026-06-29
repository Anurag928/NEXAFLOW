"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HistoryDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  useEffect(() => {
    if (params?.id) {
      router.replace(`/history?id=${params.id}`);
    } else {
      router.replace("/history");
    }
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="w-6 h-6 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
    </div>
  );
}
