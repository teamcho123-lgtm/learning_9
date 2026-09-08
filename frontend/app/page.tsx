import Link from "next/link";
import { auth } from "@/auth";
import LogoutButton from "./components/auth/Logout";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100 px-4">
      <section className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl shadow-pink-950/10">
        <div aria-hidden="true" className="text-6xl">🐰</div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Learning 9</h1>

        {session?.user ? (
          <div className="mt-3 text-slate-600">
            <p>Xin chào: {session.user.email}</p>
            {/* <p>ID: {session.user.id}</p> */}
            <p>Vai trò: {session.user.role}</p>
          </div>
        ) : (
          <p className="mt-3 text-slate-600">
            Bạn chưa đăng nhập.
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {session?.user ? (
            <>
              <Link
                className="rounded-xl border border-pink-200 px-5 py-3 font-semibold text-pink-600 hover:bg-pink-50"
                href="/users"
              >
                Danh sách user
              </Link>

              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                className="rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white hover:bg-pink-600"
                href="/auth/signIn"
              >
                Đăng nhập
              </Link>

              <Link
                className="rounded-xl border border-pink-200 px-5 py-3 font-semibold text-pink-600 hover:bg-pink-50"
                href="/auth/signUp"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
