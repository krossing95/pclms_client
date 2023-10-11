import axios from 'axios'

interface GetHiddenBookingsProps {
    page: number
    keyword: string
}

const search_hidden_bookings = async ({ page, keyword }: GetHiddenBookingsProps) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}bookings/hidden/search?q=${keyword}&page=${page}`
    try {
        const res = await axios({
            method: 'GET',
            url,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return { data: res?.data }
    } catch (error: any) {
        return { data: error?.response?.data }
    }
}
export default search_hidden_bookings