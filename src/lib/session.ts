import { cookies } from "next/headers";

export async function getCurrentCorretor() {
  // cookies() agora retorna uma Promise — precisa de await
  const cookieStore = await cookies();

  // get() agora é síncrono quando cookieStore já foi resolvido
  const tokenCookie = cookieStore.get("consultor_session");

  if (!tokenCookie) return null;

  try {
    const session = JSON.parse(tokenCookie.value);
    return session;
  } catch (err) {
    console.error("Erro ao parsear cookie:", err);
    return null;
  }
}