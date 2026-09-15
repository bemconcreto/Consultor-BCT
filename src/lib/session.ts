import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { cookies } from "next/headers";

export async function getCurrentCorretor() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    return {
      userId: session.user.id,
      email: session.user.email,
    };
  }

  // Fallback: login por carteira (SIWE) não usa NextAuth — grava o próprio
  // cookie "consultor_session" (mesmo parsing usado em src/app/api/session/route.ts).
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("consultor_session");
    if (!token) return null;

    const walletSession = JSON.parse(token.value) as {
      userId?: number;
      wallet?: string;
      corretorId?: string;
    };

    if (!walletSession?.userId) return null;

    return {
      userId: walletSession.userId,
      email: null,
    };
  } catch {
    return null;
  }
}