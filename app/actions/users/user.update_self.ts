import axios from 'axios'
import Cookies from 'js-cookie'

interface SelfUpdateProps {
    firstname: string
    lastname: string
    email: string
    phone: string
}

const update_self = async ({ firstname, lastname, email, phone }: SelfUpdateProps) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}users/self`
    const data = { firstname, lastname, email, phone }
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
export default update_self