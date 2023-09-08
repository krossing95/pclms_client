// 'use server'

import axios from 'axios'

interface LoginProps {
    phone: string
    captcha: string
    password: string
}

const login = async (
    { phone, captcha, password,
    }: LoginProps) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}users/auth/login`
    const data = { phone, captcha, password }
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
export default login