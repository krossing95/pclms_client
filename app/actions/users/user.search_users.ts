import axios from "axios"

interface SearchUsersProps {
    page: number
    keyword: string
}

const search_users = async ({ page, keyword }: SearchUsersProps) => {
    const HOST = process.env.NEXT_PUBLIC_HTTPHOST
    const url = `${HOST}users/search?q=${keyword}&page=${page}`
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
export default search_users