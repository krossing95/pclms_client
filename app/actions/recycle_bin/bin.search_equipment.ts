import axios from "axios"

interface SearchEquipmentInBinProps {
    page: number
    keyword: string
}

const search_hidden_equipment = async ({ page, keyword }: SearchEquipmentInBinProps) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}equipment/hidden/search?q=${keyword}&page=${page}`
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
export default search_hidden_equipment