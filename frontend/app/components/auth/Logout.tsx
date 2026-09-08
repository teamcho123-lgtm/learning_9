"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            type="button"
            onClick={() =>
                signOut({
                    redirectTo: "/auth/signIn",
                })
            }
            className="rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white hover:bg-pink-600"
        >
            Đăng xuất
        </button>
    );
}