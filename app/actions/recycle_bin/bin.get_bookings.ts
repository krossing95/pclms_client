import axios from 'axios'

interface GetHiddenBookingsProps {
    page: number
}

const get_hidden_bookings = async ({ page }: GetHiddenBookingsProps) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}bookings/hidden?page=${page}`
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
export default get_hidden_bookings