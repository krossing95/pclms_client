// 'use server'

import axios from 'axios'
import type { MappableObject as PasswordResetProps } from '@/app/auth/password_reset/components/Form'

const reset_password = async (
    { password, password_confirmation, captcha, code, user
    }: PasswordResetProps) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}users/auth/reset_password`
    const data = { password, password_confirmation, captcha, code, user }
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
export default reset_password