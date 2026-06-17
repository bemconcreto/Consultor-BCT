import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentCorretor } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditProfileForm from "@/components/EditProfileForm";

export default async function PerfilPage() {
  const session = await getCurrentCorretor();
  if (!session) redirect("/");

  const corretor = await prisma.corretor.findUnique({
    where: { userId: session.userId },
  });
  if (!corretor) redirect("/");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-[#101820] tracking-tight">Meu Perfil</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Mantenha seus dados atualizados, incluindo a chave PIX para receber comissões.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Consultor</CardTitle>
        </CardHeader>
        <CardContent>
          <EditProfileForm initialCorretor={corretor} />
        </CardContent>
      </Card>
    </div>
  );
}
