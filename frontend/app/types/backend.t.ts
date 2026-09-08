interface IUsers {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    image?: string;
    role: string;
    accountType: string;
    isActive: boolean;
    codeId?: string;
    codeExpired?: string;
    createdAt: string;
    updatedAt: string;
}
