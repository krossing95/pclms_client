import axios from 'axios'
import Cookies from 'js-cookie'

interface PasswordUpdateProps {
    id: string
    old_password: string
    new_password: string
    confirm_password: string
}

const password_update = async ({ id, old_password, new_password, confirm_password }: PasswordUpdateProps) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}users/password-update`
    const data = { id, old_password, new_password, confirm_password }
    try {
        const res = await axios({
            method: 'PATCH',
            url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookie.token}`
            },
            data
        })
        return { data: res?.data }
    } catch (error: any) {
        return { data: error?.response?.data }
    }
}
export default password_update