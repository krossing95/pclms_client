import useAuthPotencyChecker from '@/helpers/helper.logout_on_request'
import axios from 'axios'
import Cookies from 'js-cookie'

interface EquipmentSaveCommentProps {
    equipment_id: string
    comment: string
}

const post_comment = async ({ equipment_id, comment }: EquipmentSaveCommentProps) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}equipment/comments`
    const data = { equipment_id, comment }
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
export default post_comment