import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "user" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "user" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "user" | "admin";
  }
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "user" | "admin";
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
