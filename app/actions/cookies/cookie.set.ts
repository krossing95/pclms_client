'use server'

import Cookies from "js-cookie"

interface CookieSetUpParams {
    name: string
    value: string
    options: any
}

const set_cookie = async ({ name, value, options }: CookieSetUpParams) => {
    Cookies.set(name, value, { ...options, path: '', secure: true })
}
export default set_cookie