import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

interface AccessTokenPayload {
    exp?: number;
}

const getAccessTokenExpires = (accessToken: string): number => {
    try {
        const payloadBase64 = accessToken.split(".")[1];

        if (!payloadBase64) {
            return 0;
        }

        const payload = JSON.parse(
            Buffer.from(payloadBase64, "base64url").toString("utf8"),
        ) as AccessTokenPayload;

        // exp của JWT tính bằng giây, Date.now() tính bằng mili giây.
        return typeof payload.exp === "number"
            ? payload.exp * 1000
            : 0;
    } catch {
        return 0;
    }


};

const refreshAccessToken = async (token: JWT): Promise<JWT> => {
    if (!token.refreshToken) {
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }

    try {
        const response = await fetch(`${API_URL}/auth/refreshToken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refreshToken: token.refreshToken,
            }),
            cache: "no-store",
        });

        const data: unknown = await response.json();

        if (!response.ok || !data || typeof data !== "object") {
            throw new Error("Không thể refresh access token");
        }

        const refreshedTokens = data as Record<string, unknown>;

        if (typeof refreshedTokens.access_token !== "string") {
            throw new Error("Backend không trả access token");
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: getAccessTokenExpires(
                refreshedTokens.access_token,
            ),
            error: undefined,
        };
    } catch {
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
};

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60,
    },

    pages: {
        signIn: "/auth/signIn",
    },

    secret: process.env.AUTH_SECRET,

    providers: [
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Add logic here to look up the user from the credentials supplied
                const email = credentials.email;
                const password = credentials.password;

                if (
                    typeof email !== "string" ||
                    typeof password !== "string"
                ) {
                    return null;
                }

                try {
                    const response = await fetch(`${API_URL}/auth/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email,
                            password,
                        }),
                        cache: "no-store",
                    });

                    const data: unknown = await response.json();

                    if (!response.ok) {
                        console.log(data);
                        return null;
                    }

                    if (!data || typeof data !== "object") {
                        return null;
                    }

                    const tokens = data as Record<string, unknown>;

                    if (
                        typeof tokens.access_token !== "string" ||
                        typeof tokens.refresh_token !== "string"
                    ) {
                        return null;
                    }


                    const profileResponse = await fetch(`${API_URL}/auth/profile`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${tokens.access_token}`,
                        },
                        cache: "no-store",
                    });

                    if (!profileResponse.ok) {
                        return null;
                    }

                    const profileData: unknown = await profileResponse.json();

                    if (!profileData || typeof profileData !== "object") {
                        return null;
                    }

                    const profile = profileData as Record<string, unknown>;

                    if (
                        typeof profile._id !== "string" ||
                        typeof profile.role !== "string"
                    ) {
                        return null;
                    }

                    // Đã lấy được _id và role, bước sau mới trả user cho NextAuth.
                    return {
                        id: profile._id,
                        email,
                        role: profile.role,
                        accessToken: tokens.access_token,
                        refreshToken: tokens.refresh_token,
                    };
                } catch {
                    return null;
                }
            }


        }),


    ],

    callbacks: {
        authorized({ auth, request }) {
            const pathname = request.nextUrl.pathname;

            const isLoggedIn = Boolean(
                auth?.accessToken &&
                auth.error !== "RefreshAccessTokenError"
            );

            const isUsersPage = pathname.startsWith("/users");

            const isGuestPage =
                pathname === "/auth/signIn" ||
                pathname === "/auth/signUp";

            // Chưa đăng nhập thì không được vào /users
            if (isUsersPage) {
                return isLoggedIn;
            }

            // Đã đăng nhập thì không cần xem lại form đăng nhập/đăng ký
            if (isGuestPage && isLoggedIn) {
                return NextResponse.redirect(
                    new URL("/", request.url),
                );
            }

            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id;
                token.role = user.role;
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.accessTokenExpires = getAccessTokenExpires(user.accessToken);

                return token;
            }

            // Nhánh 2: access token vẫn còn hạn
            if (
                token.accessTokenExpires &&
                Date.now() < token.accessTokenExpires - 30_000
            ) {
                return token;
            }

            return refreshAccessToken(token);
        },

        session({ session, token }) {
            if (token.userId) session.user.id = token.userId;
            if (token.role) session.user.role = token.role;
            if (token.accessToken) session.accessToken = token.accessToken;
            if (token.error) session.error = token.error;

            return session;
        },
    }
});
