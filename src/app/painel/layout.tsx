import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentCorretor } from "@/lib/session";
import PainelShell from "@/components/PainelShell";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentCorretor();
  if (!session) redirect("/");

  const corretor = await prisma.corretor.findUnique({
    where: { userId: session.userId },
    select: { nome: true },
  });

  if (!corretor) redirect("/");

  return (
    <PainelShell corretor={{ nome: corretor.nome, email: session.email ?? null }}>
      {children}
    </PainelShell>
  );
}
