import useAuthPotencyChecker from '@/helpers/helper.logout_on_request'
import axios from 'axios'
import Cookies from 'js-cookie'

interface GetBookingsProps {
    page: number
    keyword: string
}

const search_bookings = async ({ page, keyword }: GetBookingsProps) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}bookings/search?q=${keyword}&page=${page}`
    try {
        const res = await axios({
            method: 'GET',
            url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookie.token}`
            }
        })
        await useAuthPotencyChecker({ code: parseInt(res?.data?.code) })
        return { data: res?.data }
    } catch (error: any) {
        return { data: error?.response?.data }
    }
}
export default search_bookings