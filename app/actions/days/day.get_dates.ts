import axios from "axios"

interface GetDayProps {
    limit: number
}

const get_dates = async ({ limit }: GetDayProps) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}days_management?limit=${limit}`
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