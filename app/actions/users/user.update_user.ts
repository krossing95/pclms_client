import useAuthPotencyChecker from '@/helpers/helper.logout_on_request'
import axios from 'axios'
import Cookies from 'js-cookie'

interface UserUpdateProps {
    id: string
    firstname: string
    lastname: string
    email: string
    phone: string
    usertype: number
}

const update_user = async ({ id, firstname, lastname, email, phone, usertype }: UserUpdateProps) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}users`
    const data = { id, firstname, lastname, email, phone, usertype }
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
        await useAuthPotencyChecker({ code: parseInt(res?.data?.code) })
        return { data: res?.data }
    } catch (error: any) {
        return { data: error?.response?.data }
    }
}
export default update_user