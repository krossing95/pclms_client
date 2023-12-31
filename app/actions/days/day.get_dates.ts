import axios from "axios"

interface GetDayProps {
    page: number
}

const get_dates = async ({ page }: GetDayProps) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}days_management?page=${page}`
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

export default get_dates