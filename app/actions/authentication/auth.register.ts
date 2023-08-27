import axios from 'axios'

interface RegistrationProps {
    firstname: string
    lastname: string
    phone: string
    email: string
    password: string
    password_confirmation: string
}

const register = async (
    { firstname, lastname, phone, email,
        password, password_confirmation
    }: RegistrationProps) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}users/auth`
    const data = {
        firstname, lastname, phone, email,
        password, password_confirmation
    }
    try {
        const res = await axios({
            method: 'POST',
            url,
            headers: {
                'Content-Type': 'application/json',
            },
            data
        })
        return { data: res?.data }
    } catch (error: any) {
        return { data: error?.response?.data }
    }
}
export default register
