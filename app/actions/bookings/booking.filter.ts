import axios from "axios"
import Cookies from "js-cookie"

interface BookingFilterProps {
    from: string
    to: string
    status: number
    page: number
}

const filter_bookings = async ({ from, to, status, page }: BookingFilterProps) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}bookings/filter?page=${page}from=${from}&to=${to}&status=${status}`
    try {
        const res = await axios({
            method: 'GET',
            url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookie.token}`
            }
        })
        return { data: res?.data }
    } catch (error: any) {
        return { data: error?.response?.data }
    }
}
export default filter_bookings