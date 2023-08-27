import axios from 'axios'

interface VerificationRequestProps {
    user_id: string
    verification_code: string
}

const verify = async (
    { user_id, verification_code
    }: VerificationRequestProps) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}users/auth/verify`
    const data = {
        user_id, verification_code
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
export default verify
