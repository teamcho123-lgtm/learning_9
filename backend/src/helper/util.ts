import bcrypt from 'bcrypt';

const saltRound = 10;

export const hashPasswordHelper = async (plainPassword: string) => {
    try {
        return await bcrypt.hash(plainPassword, saltRound)
    } catch (error) {
        console.log(error)
    }
}

export const isComparePasswordHelper = async (plainPassword: string, hashedPassword: string) => {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword)
    } catch (error) {
        console.log(error)
    }
}
