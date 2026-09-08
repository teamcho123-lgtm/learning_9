import type { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface User {
        role: string;
        accessToken: string;
        refreshToken: string;
    }

    interface Session {
        accessToken?: string;
        error?: "RefreshAccessTokenError";

        user: {
            id?: string;
            role?: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId?: string;
        role?: string;
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
        error?: "RefreshAccessTokenError";
    }
}