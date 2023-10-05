import useAuthPotencyChecker from '@/helpers/helper.logout_on_request'
import axios from 'axios'
import Cookies from 'js-cookie'

interface GetSlotsProps {
    equipment_id: string
    date: string
}

const get_slots = async ({ equipment_id, date }: GetSlotsProps) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}bookings/slots?equipment_id=${equipment_id}&date=${date}`
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
export default get_slots