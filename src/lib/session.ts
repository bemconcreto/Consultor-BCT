import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Retorna o corretor logado a partir da sessão do NextAuth
 * ou null se não houver sessão válida
 */
export async function getCurrentCorretor() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  return {
    userId: session.user.id,
    email: session.user.email ?? null,
    name: session.user.name ?? null,
  };
}