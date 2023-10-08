// 'use server'

import axios from 'axios'

interface ForgotPasswordProps {
    phone: string
    captcha: string
}

const forgot_password = async (
    { phone, captcha
    }: ForgotPasswordProps) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}users/auth/forgot_password`
    const data = { phone, captcha }
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
export default forgot_password