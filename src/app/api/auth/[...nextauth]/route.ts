import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  providers: [
    // 🔐 LOGIN COM GOOGLE
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // 🔐 LOGIN COM EMAIL/SENHA
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const email = credentials.email.toLowerCase();

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) return null;

        // ⚠️ se depois quiser hash de senha, valida aqui
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  pages: {
    signIn: "/", // sua tela de login
  },

  callbacks: {
    // 🚀 CRIA USER + CORRETOR NO PRIMEIRO LOGIN
    async signIn({ user }) {
      if (!user?.email) return false;

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

      const corretor = await prisma.corretor.findUnique({
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

    // 🔑 COLOCA USER ID NA SESSION
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = Number(token.sub);
      }
      return session;
    },

    async redirect() {
      return "/painel";
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };