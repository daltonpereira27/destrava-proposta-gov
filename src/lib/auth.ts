import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "seu@email.com" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios.");
        }

        // Credenciais de teste rápido para o ambiente de Piloto
        if (
          (credentials.email === "piloto@destrava.com.br" || credentials.email === "admin@destrava.com.br") &&
          credentials.password === "123456"
        ) {
          return {
            id: "user-piloto-001",
            email: credentials.email,
            name: "Usuário Piloto",
            role: "ADMIN",
            planStatus: "ACTIVE",
            credits: 9999,
          };
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.passwordHash) {
          throw new Error("Usuário não encontrado ou credenciais inválidas.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValid) {
          throw new Error("Credenciais inválidas.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          planStatus: user.planStatus,
          credits: user.credits,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.planStatus = user.planStatus;
        token.credits = user.credits;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          planStatus: token.planStatus as string,
          credits: token.credits as number,
        };
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "destrava_secret_key_production_2026_super_secure",
};
