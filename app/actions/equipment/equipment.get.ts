import axios from "axios"

interface GetEquipmentProps {
    limit: number
}

const get_equipment = async ({ limit }: GetEquipmentProps) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}equipment?limit=${limit}`
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
export default get_equipment