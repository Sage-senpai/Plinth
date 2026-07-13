import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { env } from '@/lib/env';

/**
 * Auth for the pilot.
 *
 * Plinth's customers are individual buyers, estate agencies and one law firm —
 * they are onboarded by hand, so a credentials provider backed by the pilot
 * user list is honest about where the product is. Nothing here assumes it stays
 * that way: the session shape is what the workspace reads, so swapping in an
 * email or OAuth provider later touches this file and nothing else.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Plinth',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // In demo mode any email gets in — there is nothing behind the door
        // but seeded records.
        if (env.demoMode) {
          return {
            id: 'demo',
            email: credentials.email,
            name: credentials.email.split('@')[0],
          };
        }

        // Pilot users are provisioned out of band. Until that store exists,
        // refuse rather than let anyone in with any password.
        return null;
      },
    }),
  ],

  session: { strategy: 'jwt' },

  pages: {
    signIn: '/signin',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid) {
        (session.user as { id?: string }).id = token.uid as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET ?? 'plinth-development-secret',
};
