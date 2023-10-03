import axios from 'axios'

interface GetOneBookingProp {
    id: string
}

const get_booking = async ({ id }: GetOneBookingProp) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}bookings/single?booking_id=${id}`
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
export default get_booking