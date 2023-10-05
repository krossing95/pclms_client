import useAuthPotencyChecker from "@/helpers/helper.logout_on_request"
import axios from "axios"
import Cookies from "js-cookie"

interface FilterEquipmentProps {
    functionality_status: boolean | null
    availability_status: boolean | null
    page: number
}

const filter_favorites = async ({ functionality_status, availability_status, page }: FilterEquipmentProps) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}favorites/filter?page=${page}&functionality_status=${functionality_status}&availability_status=${availability_status}`
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
export default filter_favorites