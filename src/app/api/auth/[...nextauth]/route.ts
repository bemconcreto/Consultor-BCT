import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const email = credentials.email.toLowerCase();

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) return null;

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  pages: {
    signIn: "/",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;

      const email = user.email.toLowerCase();

      // 1️⃣ USER
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

      // 2️⃣ CORRETOR
      let corretor = await prisma.corretor.findUnique({
        where: { userId: dbUser.id },
      });

      if (!corretor) {
        const last = await prisma.corretor.findFirst({
          orderBy: { id: "desc" },
        });

        const nextId = (last?.id ?? 0) + 1;

        corretor = await prisma.corretor.create({
          data: {
            userId: dbUser.id,
            corretorId: `BCTCR-${String(nextId).padStart(5, "0")}`,
            statusCertificacao: "pendente",
          },
        });
      }

      // 3️⃣ COOKIE (🔑 O QUE FAZ TUDO FUNCIONAR)
      const cookieStore = await cookies();

      cookieStore.set(
        "consultor_session",
        JSON.stringify({
          userId: dbUser.id,
          corretorId: corretor.id,
          email: dbUser.email,
          createdAt: Date.now(),
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 dias
        }
      );

      return true;
    },

    async redirect() {
      return "/painel";
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };