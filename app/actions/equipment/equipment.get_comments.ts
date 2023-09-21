import axios from 'axios'

interface EquipmentGetCommentProps {
    page: number
    equipment_id: string
}

const get_comments = async ({ equipment_id, page }: EquipmentGetCommentProps) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}equipment/comments?page=${page}&equipment_id=${equipment_id}`
    try {
        const res = await axios({
            method: 'GET',
            url,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return { data: res?.data }
    } catch (error: any) {
        return { data: error?.response?.data }
    }
}
export default get_comments