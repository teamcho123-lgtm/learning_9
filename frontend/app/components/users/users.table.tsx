"use client";

import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined, } from "@ant-design/icons";
import { Avatar, Button, Card, ConfigProvider, Empty, Form, Modal, Space, Table, Tag, Tooltip, } from "antd";
import type { TableColumnsType, TablePaginationConfig, } from "antd";
import { usePathname, useRouter, useSearchParams, } from "next/navigation";
import { useState } from "react";

interface IProps {
    users: IUsers[] | null;
    meta: {
        current: number;
        pageSize: number;
        total: number;
    };
}

const formatDate = (value?: string) => {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "Asia/Ho_Chi_Minh",
    }).format(date);
};

const UsersTable = ({ users, meta }: IProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [form] = Form.useForm<Partial<IUsers>>();
    const [showForm, setShowForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUsers | null>(null);

    const openUserForm = (user?: IUsers) => {
        form.resetFields();
        setSelectedUser(user ?? null);

        if (user) {
            form.setFieldsValue(user);
        }

        setShowForm(true);
    };

    const closeUserForm = () => {
        setShowForm(false);
        setSelectedUser(null);
        form.resetFields();
    };

    const handleTableChange = (pagination: TablePaginationConfig) => {
        const nextPage = pagination.current ?? 1;
        const params = new URLSearchParams(searchParams.toString());

        params.set("page", nextPage.toString());
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // Không tạo cột _id và password. _id chỉ dùng ngầm làm rowKey.
    const columns: TableColumnsType<IUsers> = [
        {
            title: "ID",
            dataIndex: "_id",
            width: 150,
            ellipsis: true,
        },
        {
            title: "User",
            width: 150,
            fixed: "left",
            render: (_value, record) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        size={20}
                        src={record.image || undefined}
                        icon={<UserOutlined />}
                    />
                    <span className="font-semibold text-slate-900">
                        {record.name || "—"}
                    </span>
                </div>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            width: 150,
            ellipsis: true,
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            width: 150,
            render: (phone?: string) => phone || "—",
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            width: 150,
            ellipsis: true,
            render: (address?: string) => address || "—",
        },
        {
            title: "Vai trò",
            dataIndex: "role",
            width: 100,
            render: (role: string) => (
                <Tag color={role === "ADMIN" ? "purple" : "blue"}>
                    {role || "—"}
                </Tag>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "isActive",
            width: 130,
            render: (isActive: boolean) => (
                <Tag color={isActive ? "success" : "default"}>
                    {isActive ? "Hoạt động" : "Tạm khóa"}
                </Tag>
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            width: 150,
            render: formatDate,
        },
        {
            title: "Cập nhật",
            dataIndex: "updatedAt",
            width: 150,
            render: formatDate,
        },
        {
            title: "Thao tác",
            width: 80,
            fixed: "right",
            align: "right",
            render: (_value, record) => (
                <Space size="small">
                    <Tooltip title="Mở form chỉnh sửa">
                        <Button
                            type="text"
                            aria-label={`Chỉnh sửa ${record.name}`}
                            icon={<EditOutlined />}
                            onClick={() => openUserForm(record)}
                        />
                    </Tooltip>

                    <Tooltip title="Chưa kết nối API xóa">
                        <Button
                            type="text"
                            danger
                            disabled
                            aria-label={`Xóa ${record.name}`}
                            icon={<DeleteOutlined />}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const dataSource = users ?? [];



    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#f45f76",
                    },
                    components: {
                        Table: {
                            headerBg: "#fff3f4",
                            rowHoverBg: "#fff8f8",
                        },
                    },
                }}
            >
                <main className="min-h-screen w-full bg-[#fff7f5] p-4 md:p-7">
                    <div className="mx-auto w-full max-w-7xl">
                        <Card
                            variant="borderless"
                            className="overflow-hidden rounded-2xl! shadow-[0_4px_20px_rgba(143,60,74,0.14)]"
                            classNames={{ body: "p-0!" }}
                        >
                            <div className="flex flex-col gap-4 border-b border-rose-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
                                <div className="flex items-center gap-3">
                                    <h1 className="m-0 text-2xl font-bold text-stone-900 md:text-3xl">
                                        Danh sách user
                                    </h1>
                                    <Tag className="m-0! rounded-full! border-0! bg-rose-50! px-3! py-1! text-sm! text-rose-700!">
                                        {dataSource.length} user
                                    </Tag>
                                </div>

                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<PlusOutlined />}
                                    className="rounded-full! border-none! bg-[#ff7185]! px-6! font-semibold! shadow-md! hover:bg-[#f45f76]!"
                                    onClick={() => openUserForm()}
                                >
                                    Thêm user
                                </Button>
                            </div>

                            <div className="p-5 md:p-7">
                                <Table<IUsers>
                                    rowKey={(record) => record._id}
                                    columns={columns}
                                    dataSource={dataSource}
                                    scroll={{ x: 2050 }}
                                    rowClassName={() => "transition-colors"}
                                    onChange={handleTableChange}
                                    pagination={{
                                        current: meta.current,
                                        pageSize: meta.pageSize,
                                        total: meta.total,
                                        showSizeChanger: false,
                                        showTotal: (total, range) =>
                                            `${range[0]}–${range[1]} trong ${total} user`,
                                    }}
                                    locale={{
                                        emptyText: (
                                            <Empty
                                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                description="Chưa có dữ liệu user"
                                            />
                                        ),
                                    }}
                                />
                            </div>
                        </Card>
                    </div>
                </main>

                <Modal
                    title={selectedUser ? "Chỉnh sửa user" : "Thêm user"}
                    open={showForm}
                    onCancel={closeUserForm}
                    cancelText="Đóng"
                    okText="Lưu"
                    okButtonProps={{ disabled: true }}
                >
                    <Form<Partial<IUsers>>
                        form={form}
                        name="user-form"
                        layout="vertical"
                        className="pt-4"
                    >
                        {/* Thêm các Form.Item của user vào vị trí này. */}
                        <div className="rounded-xl border border-dashed border-rose-200 bg-rose-50/40 px-4 py-10">
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Chưa cấu hình trường thông tin user"
                            />
                        </div>
                    </Form>
                </Modal>
            </ConfigProvider>
        </>


    );
};

export default UsersTable;
