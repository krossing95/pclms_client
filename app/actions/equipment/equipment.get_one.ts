// 'use server'

import axios from "axios"

interface GetEquipmentProps {
    equipment_id: string
}

const getone_equipment = async ({ equipment_id }: GetEquipmentProps) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}equipment/single?equipment_id=${equipment_id}`
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
export default getone_equipment