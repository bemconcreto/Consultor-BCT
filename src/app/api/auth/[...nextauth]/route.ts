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

    let corretor = await prisma.corretor.findUnique({
      where: { userId: dbUser.id },
    });

    if (!corretor) {
      // Timestamp + random evita colisão de corretorId sob concorrência
      // (ler "max + 1" fora de transação permitia duas requisições simultâneas gerarem o mesmo id)
      const corretorId = `BEMCR-${Date.now()}${Math.floor(Math.random() * 1000)}`;

      await prisma.corretor.create({
        data: {
          userId: dbUser.id,
          corretorId,
          statusCertificacao: "pendente",
        },
      });
    }

    // 🔑 guarda o ID REAL do banco no user object
    (user as any).dbUserId = dbUser.id;

    return true;
  },

  async jwt({ token, user }) {
    if (user && (user as any).dbUserId) {
      token.userId = (user as any).dbUserId;
    }
    return token;
  },

  async session({ session, token }) {
    if (session.user && token.userId) {
      (session.user as any).id = token.userId;
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