"use client";

import { create } from "zustand";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

type ApiError = {
    message?: string | string[];
};

type RegisterInput = {
    name?: string;
    email: string;
    password: string;
};

type AuthState = {
    loading: boolean;
    error: string | null;
    register: (input: RegisterInput) => Promise<void>;
    verifyCode: (email: string, codeId: string) => Promise<void>;
};

async function readApiError(response: Response): Promise<ApiError> {
    try {
        return (await response.clone().json()) as ApiError;
    } catch {
        return {};
    }
}

function getErrorMessage(error: ApiError, fallback: string) {
    if (Array.isArray(error.message)) {
        return error.message.join(", ");
    }

    return error.message ?? fallback;
}

export const useAuthStore = create<AuthState>((set) => ({
    loading: false,
    error: null,

    register: async (input) => {
        set({ loading: true, error: null });

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });

            if (!response.ok) {
                const apiError = await readApiError(response);
                throw new Error(
                    getErrorMessage(apiError, "Đăng ký không thành công"),
                );
            }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Đăng ký không thành công";
            set({ error: message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    verifyCode: async (email, codeId) => {
        set({ loading: true, error: null });

        try {
            const response = await fetch(`${API_URL}/auth/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, codeId }),
            });

            if (!response.ok) {
                const apiError = await readApiError(response);
                throw new Error(
                    getErrorMessage(apiError, "Xác thực tài khoản thất bại"),
                );
            }
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Xác thực tài khoản thất bại";
            set({ error: message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },
}));
