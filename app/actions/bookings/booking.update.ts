import useAuthPotencyChecker from "@/helpers/helper.logout_on_request"
import axios from "axios"
import Cookies from "js-cookie"

interface UpdateBookingProp {
    booking_id: string
    date: string
    need_assist: boolean
    slots: string[]
}

const update_booking = async ({ booking_id, date, need_assist, slots }: UpdateBookingProp) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}bookings`
    const data = { booking_id, date, need_assist, slots }
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
export default update_booking