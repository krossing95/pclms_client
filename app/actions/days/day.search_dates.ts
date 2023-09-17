import axios from "axios"

interface SearchDayProps {
    page: number
    keyword: string
}

const search_days = async ({ page, keyword }: SearchDayProps) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}days_management/search?q=${keyword}&page=${page}`
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
export default search_days