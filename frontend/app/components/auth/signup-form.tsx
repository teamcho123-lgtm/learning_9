"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { useAuthStore } from "@/app/stores/useAuthStore";

export default function SignupForm() {
    const router = useRouter();
    const register = useAuthStore((state) => state.register);
    const loading = useAuthStore((state) => state.loading);
    const apiError = useAuthStore((state) => state.error);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);

        if (password !== confirmPassword) {
            setFormError("Mật khẩu nhập lại không khớp");
            return;
        }

        try {
            await register({ name: name.trim(), email: email.trim(), password });
            router.push(`/verify?email=${encodeURIComponent(email.trim())}`);
        } catch {
            // Store hiển thị lỗi do API trả về.
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="name">
                    Họ và tên
                </label>
                <input
                    autoComplete="name"
                    className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    id="name"
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Nguyễn Văn A"
                    required
                    type="text"
                    value={name}
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="signup-email">
                    Email
                </label>
                <input
                    autoComplete="email"
                    className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    id="signup-email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="ban@example.com"
                    required
                    type="email"
                    value={email}
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="signup-password">
                        Mật khẩu
                    </label>
                    <input
                        autoComplete="new-password"
                        className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                        id="signup-password"
                        minLength={6}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        type="password"
                        value={password}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="confirm-password">
                        Nhập lại mật khẩu
                    </label>
                    <input
                        autoComplete="new-password"
                        className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                        id="confirm-password"
                        minLength={6}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        required
                        type="password"
                        value={confirmPassword}
                    />
                </div>
            </div>

            {(formError || apiError) && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                    {formError ?? apiError}
                </p>
            )}

            <button
                className="w-full rounded-xl bg-pink-500 px-4 py-3 font-semibold text-white shadow-lg shadow-pink-200 transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
                type="submit"
            >
                {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
            </button>
        </form>
    );
}
