// types/next-auth.d.ts
import { DefaultSession } from 'next-auth';


declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      totalXP: number;
      totalCurrency: number;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    totalXP: number;
    totalCurrency: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    totalXP: number;
    totalCurrency: number;

  }
}
