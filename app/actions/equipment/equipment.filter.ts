import axios from "axios"

interface FilterEquipmentProps {
    functionality_status: boolean | null
    availability_status: boolean | null
    page: number
}

const filter_equipment = async ({ functionality_status, availability_status, page }: FilterEquipmentProps) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}equipment/filter?page=${page}&functionality_status=${functionality_status}&availability_status=${availability_status}`
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
export default filter_equipment