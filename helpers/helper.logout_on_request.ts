import remove_cookie from '@/app/actions/cookies/cookie.delete'
import set_cookie from '@/app/actions/cookies/cookie.set'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface AuthPotencyCheckerProps {
    code: number
    request?: NextRequest
}

const useAuthPotencyChecker = async ({ code, request }: AuthPotencyCheckerProps) => {
    try {
        if (code === 401) {
            await remove_cookie({ cookie_name: '__signedInUserObj' })
            const expiration = Date.now() + 180000
            await set_cookie({ name: '__logout_message', value: 'Session expired', options: { expires: expiration } })
            return NextResponse.redirect(new URL('/auth/login', request?.url))
        }
    } catch (error) {
        console.log('ISSUE')
    }
}
export default useAuthPotencyChecker