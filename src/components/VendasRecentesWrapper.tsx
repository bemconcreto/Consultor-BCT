"use client";

import dynamic from "next/dynamic";

const VendasRecentes = dynamic(() => import("./VendasRecentes"), {
  ssr: false,
});

export default function VendasRecentesWrapper({ corretorId }: { corretorId: number }) {
  return <VendasRecentes corretorId={corretorId} />;
}