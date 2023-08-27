import { cookies } from "next/headers"

interface CookieRetrievalParams {
    cookie_name: string
}

const get_cookie = async ({ cookie_name }: CookieRetrievalParams) => {
    const cookieSystem = cookies()
    const obj = cookieSystem.get(cookie_name)
    return { ...obj }
}
export default get_cookie