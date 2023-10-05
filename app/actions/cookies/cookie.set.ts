'use server'

import { cookies } from 'next/headers'

interface CookieSetUpParams {
    name: string
    value: string
    options: any
}

const set_cookie = async ({ name, value, options }: CookieSetUpParams) => {
    const cookieSystem = cookies()
    cookieSystem.set(name, value, { ...options })
}
export default set_cookie