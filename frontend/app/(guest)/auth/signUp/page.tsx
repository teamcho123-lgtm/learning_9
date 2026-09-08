import Link from "next/link";
import SignupForm from "@/app/components/auth/signup-form";

const SignupPage = () => {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100 px-4 py-10">
            <div className="w-full max-w-5xl">
                <section className="overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl shadow-pink-950/10">
                    <div className="grid md:grid-cols-2">
                        <div className="p-7 sm:p-10">
                            <div className="mb-7 text-center">
                                <Link
                                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-300 text-xl font-bold text-white shadow-lg shadow-pink-200"
                                    href="/"
                                >
                                    L9
                                </Link>

                                <h1 className="mt-5 text-3xl font-bold text-slate-900">
                                    Tạo tài khoản
                                </h1>
                                <p className="mt-2 text-slate-500">
                                    Chào mừng bạn! Hãy đăng ký để bắt đầu.
                                </p>
                                <div aria-hidden="true" className="mt-4 flex justify-center gap-2 md:hidden">
                                    <span className="rounded-full bg-pink-100 p-2 text-2xl">🐰</span>
                                    <span className="rounded-full bg-rose-100 p-2 text-2xl">🐻</span>
                                    <span className="rounded-full bg-fuchsia-100 p-2 text-2xl">🐱</span>
                                </div>
                            </div>

                            <SignupForm />

                            <p className="mt-6 text-center text-sm text-slate-600">
                                Đã có tài khoản?{" "}
                                <Link
                                    className="font-semibold text-pink-600 hover:text-pink-700"
                                    href="/auth/signIn"
                                >
                                    Đăng nhập
                                </Link>
                            </p>
                        </div>

                        <div className="relative hidden min-h-full overflow-hidden bg-gradient-to-br from-pink-200 via-rose-300 to-fuchsia-400 p-10 text-white md:flex md:flex-col md:justify-between">
                            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
                            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/10" />
                            <span aria-hidden="true" className="absolute right-10 top-24 rotate-12 text-4xl">♡</span>
                            <span aria-hidden="true" className="absolute bottom-40 left-8 -rotate-12 text-3xl">✦</span>

                            <div className="relative">
                                <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                                    Learning 9
                                </span>
                            </div>

                            <div className="relative">
                                <p className="text-3xl font-bold leading-tight">
                                    Bắt đầu hành trình của bạn ngay hôm nay.
                                </p>
                                <p className="mt-4 max-w-sm text-pink-50">
                                    Tạo tài khoản để sử dụng các tính năng của hệ thống.
                                </p>
                            </div>

                            <div className="relative grid grid-cols-3 gap-3">
                                <div className="flex h-28 items-center justify-center rounded-2xl bg-white/20 text-5xl shadow-sm backdrop-blur">🐰</div>
                                <div className="flex h-28 items-center justify-center rounded-2xl bg-white/15 text-5xl shadow-sm backdrop-blur">🐻</div>
                                <div className="flex h-28 items-center justify-center rounded-2xl bg-white/25 text-5xl shadow-sm backdrop-blur">🐱</div>
                            </div>
                        </div>
                    </div>
                </section>

                <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-5 text-slate-500">
                    Bằng cách tiếp tục, bạn đồng ý với{" "}
                    <a className="underline underline-offset-4" href="#">
                        Điều khoản dịch vụ
                    </a>{" "}
                    và{" "}
                    <a className="underline underline-offset-4" href="#">
                        Chính sách bảo mật
                    </a>
                    .
                </p>
            </div>
        </main>
    );
};

export default SignupPage;
