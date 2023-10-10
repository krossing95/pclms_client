import axios from "axios"

interface GetHiddenEquipmentProps {
    page: number
}

const get_hidden_equipment = async ({ page }: GetHiddenEquipmentProps) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}equipment/hidden?page=${page}`
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
export default get_hidden_equipment