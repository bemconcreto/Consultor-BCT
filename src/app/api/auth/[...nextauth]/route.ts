import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/", // sua tela de login
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;

      try {
        const email = user.email!.toLowerCase();

        let dbUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email,
              name: user.name || null,
            },
          });
        }

        let corretor = await prisma.corretor.findUnique({
          where: { userId: dbUser.id },
        });

        if (!corretor) {
          const last = await prisma.corretor.findFirst({
            orderBy: { id: "desc" },
          });

          const nextId = (last?.id ?? 0) + 1;
          const corretorId = `BCTCR-${String(nextId).padStart(5, "0")}`;

          corretor = await prisma.corretor.create({
            data: {
              userId: dbUser.id,
              corretorId,
            },
          });
        }

        // ✅ CORREÇÃO CRÍTICA AQUI
        const cookieStore = await cookies();

        cookieStore.set(
          "consultor_session",
          JSON.stringify({
            userId: dbUser.id,
            corretorId: corretor.corretorId,
            email,
            timestamp: Date.now(),
          }),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          }
        );

        return true;
      } catch (err) {
        console.error("Erro login Google:", err);
        return false;
      }
    },

    async redirect() {
      return "/painel";
    },

    async session({ session }) {
      return session;
    },
  },
});

export { handler as GET, handler as POST };