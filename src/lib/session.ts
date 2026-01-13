import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getCurrentCorretor() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return null;

  return {
    userId: session.user.id,
    email: session.user.email,
  };
}