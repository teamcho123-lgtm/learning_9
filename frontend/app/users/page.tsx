import UsersTable from "../components/users/users.table";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface IPageProps {
    searchParams: Promise<{
        page?: string | string[];
    }>;
}

const UsersPage = async ({ searchParams }: IPageProps) => {
    const session = await auth();
    console.log(session)

    if (!session?.accessToken) {
        redirect("/auth/signIn");
    }


    const LIMIT = 3;
    const query = await searchParams;
    const pageValue = Array.isArray(query.page)
        ? query.page[0]
        : query.page;
    const page = Math.max(Number(pageValue) || 1, 1);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users?current=${page}&pageSize=${LIMIT}`,
        {
            method: "GET",
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        }

    );

    if (!res.ok) {
        throw new Error("Không thể tải danh sách user");
    }

    const data = await res.json();

    return (
        <>
            <UsersTable
                users={data ?? null}
                meta={{
                    current: page,
                    pageSize: LIMIT,
                    total: 50,
                }}
            />
        </>

    );
};

export default UsersPage;
