import axios from 'axios'

interface ResendOTPRequestProps {
    user_id: string
    tk_value: string
}

const resend_otp = async ({ user_id, tk_value }: ResendOTPRequestProps) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}users/auth/resend_otp`
    const data = {
        user_id, tk_value
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
export default resend_otp