import bcrypt from "bcryptjs";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getEnv } from "@twitter-agent/core";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const env = getEnv();
        const email = String(credentials?.email ?? "");
        const password = String(credentials?.password ?? "");

        if (email !== env.ADMIN_EMAIL) {
          return null;
        }

        if (env.ADMIN_PASSWORD_HASH) {
          const isValid = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);

          if (!isValid) {
            return null;
          }
        } else if (env.ADMIN_PASSWORD) {
          if (password !== env.ADMIN_PASSWORD) {
            return null;
          }
        } else {
          return null;
        }

        return {
          id: "owner",
          email: env.ADMIN_EMAIL,
          name: "Owner"
        };
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = "owner";
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = String(token.role ?? "owner");
      }

      return session;
    }
  }
};

export function getServerAuthSession() {
  return getServerSession(authOptions);
}

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
