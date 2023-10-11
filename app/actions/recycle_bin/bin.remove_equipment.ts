import axios from "axios"
import Cookies from "js-cookie"

interface HiddenEquipmentRemoveProp {
    id: string
}

const remove_hidden_equipment = async ({ id }: HiddenEquipmentRemoveProp) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}equipment/hidden/single?id=${id}`
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
export default remove_hidden_equipment