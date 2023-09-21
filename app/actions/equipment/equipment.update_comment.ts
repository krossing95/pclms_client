import axios from 'axios'
import Cookies from 'js-cookie'

interface EquipmentUpdateCommentProps {
    id: string
    comment: string
}

const update_comment = async ({ id, comment }: EquipmentUpdateCommentProps) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}equipment/comments`
    const data = { id, comment }
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
export default update_comment