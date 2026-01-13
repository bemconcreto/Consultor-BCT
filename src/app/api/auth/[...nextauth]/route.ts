import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/", // app/page.tsx
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const email = user.email.toLowerCase();

      // USER
      let dbUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            email,
            name: user.name ?? null,
          },
        });
      }

      // CORRETOR
      let corretor = await prisma.corretor.findUnique({
        where: { userId: dbUser.id },
      });

      if (!corretor) {
        const last = await prisma.corretor.findFirst({
          orderBy: { id: "desc" },
        });

        const nextId = (last?.id ?? 0) + 1;

        await prisma.corretor.create({
          data: {
            userId: dbUser.id,
            corretorId: `BCTCR-${String(nextId).padStart(5, "0")}`,
            statusCertificacao: "pendente",
          },
        });
      }

      return true;
    },

    async session({ session, token }) {
      if (token?.sub && session.user) {
        (session.user as any).id = Number(token.sub);
      }
      return session;
    },

    async redirect() {
      return "/painel";
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };