import axios from "axios"

const clear_hidden_equipment = async () => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}equipment/hidden`
    try {
        const res = await axios({
            method: 'DELETE',
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
export default clear_hidden_equipment