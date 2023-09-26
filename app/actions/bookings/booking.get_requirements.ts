import axios from 'axios'
import Cookies from 'js-cookie'

interface GetBookingRequirementsProps {
    id: string
    page: number
}

const get_requirements = async ({ id, page }: GetBookingRequirementsProps) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}bookings/requirements?equipment_id=${id}&page=${page}`
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
export default get_requirements