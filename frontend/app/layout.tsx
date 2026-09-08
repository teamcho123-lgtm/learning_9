import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import { auth } from "@/auth";
import SessionErrorHandler from "./components/auth/session-error-handler";

export const metadata: Metadata = {
  title: "Danh sách user | Learning 9",
  description: "Bảng danh sách user của dự án Learning 9.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();
  return (
    <html lang="vi">
      <body>
        <SessionErrorHandler error={session?.error} />
        <AntdRegistry>{children}</AntdRegistry>
        <ToastContainer />
      </body>
    </html>
  );
}
