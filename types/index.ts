import { DefaultSession } from "next-auth";

export type UserRole = "user" | "seller" | "admin";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: UserRole;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  stock: number;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
