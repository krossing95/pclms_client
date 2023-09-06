import axios from 'axios'
import Cookies from 'js-cookie'

interface EquipmentSaveProps {
    name: string
    description: string
    system_error: string
    functionality_status: boolean
    availability_status: boolean
}

const save_equipment = async ({ name, description, system_error, functionality_status, availability_status }: EquipmentSaveProps) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}equipment`
    const data = { name, description, system_error, functionality_status, availability_status }
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
        return { data: res?.data }
    } catch (error: any) {
        return { data: error?.response?.data }
    }
}
export default save_equipment