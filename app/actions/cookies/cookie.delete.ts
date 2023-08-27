'use server'

import { cookies } from 'next/headers'

interface CookieRemovalvalParams {
    cookie_name: string
}

const remove_cookie = async ({ cookie_name }: CookieRemovalvalParams) => {
    cookies().delete(cookie_name)
}
export default remove_cookie