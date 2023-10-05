import useAuthPotencyChecker from "@/helpers/helper.logout_on_request"
import axios from "axios"
import Cookies from "js-cookie"

interface SaveDayProps {
    name: string
    date: string
    id: string
}

const update_day = async ({ name, date, id }: SaveDayProps) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}days_management`
    const data = { name, date, id }

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

export default update_day