import axios from "axios"
import Cookies from "js-cookie"

interface HiddenEquipmentRetrieveProp {
    id: string
}


const retrieve_hidden_equipment = async ({ id }: HiddenEquipmentRetrieveProp) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}equipment/hidden`
    const data = { id }
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
        return { data: res?.data }
    } catch (error: any) {
        return { data: error?.response?.data }
    }
}
export default retrieve_hidden_equipment