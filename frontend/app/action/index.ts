"use server"
import { updateTag } from 'next/cache'

export const handleCreateUserAction = async (data: Record<string, unknown>) => {
    try {
        const res = await fetch("http://localhost:8080/api/v1/users", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })

        console.log("check data : ", data)

        if (!res.ok) {
            return {
                success: false,
                message: "Thêm người dùng thất bại!",
            };
        }

        updateTag("list-users")
        // revalidateTag("list-users", "max")

        return {
            success: true,
            message: "Thêm người dùng thành công!",
        };

    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Không thể kết nối tới máy chủ!",
        };
    }
}

