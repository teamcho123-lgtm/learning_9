"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

interface SessionErrorHandlerProps {
    error?: "RefreshAccessTokenError";
}

const SessionErrorHandler = ({
    error,
}: SessionErrorHandlerProps) => {
    useEffect(() => {
        if (error === "RefreshAccessTokenError") {
            void signOut({
                redirectTo: "/auth/signIn",
            });
        }
    }, [error]);

    return null;
};

export default SessionErrorHandler;