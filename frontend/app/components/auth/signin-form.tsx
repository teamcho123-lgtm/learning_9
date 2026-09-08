"use client";

import { signIn } from "next-auth/react";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "react-toastify";

interface SignInFormProps {
    callbackUrl: string;
}

export default function SignInForm({
    callbackUrl,
}: SignInFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const submitRef = useRef<boolean>(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (submitRef.current) {
            return;
        }

        submitRef.current = true;
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email: email.trim(),
                password,
                redirect: false,
                redirectTo: callbackUrl,
            });

            if (!result || result.error) {
                submitRef.current = false;
                setLoading(false);
                toast.error(
                    "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
                );
                return;
            }

            await toast.success("Đăng nhập thành công.");
            window.location.assign(result.url ?? "/");
        } catch {
            submitRef.current = false;
            setLoading(false);
            toast.error("Không thể kết nối tới hệ thống đăng nhập.");
        }
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
                    Email
                </label>
                <input
                    autoComplete="email"
                    className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    id="email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="ban@example.com"
                    required
                    type="email"
                    value={email}
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
                    Mật khẩu
                </label>
                <input
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    id="password"
                    minLength={6}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Nhập mật khẩu"
                    required
                    type="password"
                    value={password}
                />
            </div>

            <button
                className="w-full rounded-xl bg-pink-500 px-4 py-3 font-semibold text-white shadow-lg shadow-pink-200 transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={loading}
            >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
        </form>
    );
}
