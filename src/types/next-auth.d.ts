import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      planStatus: string;
      credits: number;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    planStatus: string;
    credits: number;
  }
}
