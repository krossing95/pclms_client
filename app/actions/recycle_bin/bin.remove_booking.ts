import axios from "axios"
import Cookies from "js-cookie"

interface HiddenBookingRemoveProp {
    id: string
}

const remove_hidden_booking = async ({ id }: HiddenBookingRemoveProp) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}bookings/hidden?id=${id}`
    try {
        const res = await axios({
            method: 'DELETE',
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
export default remove_hidden_booking