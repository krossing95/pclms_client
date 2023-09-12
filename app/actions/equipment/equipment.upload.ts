import axios from 'axios'
import Cookies from 'js-cookie'

interface EquipmentFileUploadProps {
    img_url: string
    id: string
}

const upload_equipment_file = async ({ img_url, id }: EquipmentFileUploadProps) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}equipment/file-upload`
    const data = { img_url, id }
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
export default upload_equipment_file