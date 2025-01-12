import connectDB from '@/lib/db/mongoose';
import { User as MongooseUser } from '@/models/user';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        await connectDB();

        const user = await MongooseUser.findOne({ email: credentials.email }).select('+password');
        if (!user) throw new Error('Wrong Email');

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatch) throw new Error('Wrong Password');

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          totalXP: user.totalXP,
          totalCurrency: user.totalCurrency
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          totalXP: user.totalXP,
          totalCurrency: user.totalCurrency
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: token.email,
          name: token.name,
          image: token.image,
          totalXP: token.totalXP,
          totalCurrency: token.totalCurrency
        },
      };
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  image?: string;
  totalXP: number;
  totalCurrency: number;
};