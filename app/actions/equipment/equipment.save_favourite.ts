import useAuthPotencyChecker from '@/helpers/helper.logout_on_request'
import axios from 'axios'
import Cookies from 'js-cookie'

interface EquipmentSaveFavouriteProps {
    id: string
}

const save_as_favourite = async ({ id }: EquipmentSaveFavouriteProps) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}equipment/save`
    const data = { id }
    try {
        const res = await axios({
            method: 'POST',
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
export default save_as_favourite