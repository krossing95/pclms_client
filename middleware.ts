import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Regex } from './app/utils/statics'

export default function middleware(request: NextRequest) {
    const signedInCookie = request.cookies?.get('__signedInUserObj')?.value || '{}'
    const userObj = JSON.parse(signedInCookie)?.user || {}
    const isMissingUserCookieObj = Object.keys(userObj).length === 0
    const usertype: number = userObj?.usertype || 0
    const verificationCookie = request.cookies?.get('__requesting_verification')?.value || '{}'
    const verificationCookieObj = JSON.parse(verificationCookie)
    const isMissingVerificationCookieObj = Object.keys(verificationCookieObj).length === 0
    const pathname = request.nextUrl.pathname
    const urlQueryParams = request.nextUrl.searchParams
    const regex = Regex

    const unauthorizedBasePath = '/auth'
    const adminBasePath = '/admin'
    const userBasePath = '/user'

    if (unauthorizedBasePath === pathname || pathname === '/') return NextResponse.redirect(new URL(`${unauthorizedBasePath}/register`, request.url))
    if (pathname === `${unauthorizedBasePath}/password_reset`) {
        const user = urlQueryParams.get('user') || ''
        const code = urlQueryParams.get('code') || ''
        const shouldHault = !user.match(regex.MONGODB) && code.length < 10
        if (shouldHault) return NextResponse.redirect(new URL(`${unauthorizedBasePath}/login`, request.url))
    }
    if (isMissingVerificationCookieObj && pathname === `${unauthorizedBasePath}/register/verify`) return NextResponse.redirect(new URL(`${unauthorizedBasePath}/register`, request.url))
    if (isMissingVerificationCookieObj && pathname === `${unauthorizedBasePath}/login/verify`) return NextResponse.redirect(new URL(`${unauthorizedBasePath}/login`, request.url))

    if (!isMissingUserCookieObj && ![1, 2].includes(usertype)) {
        request.cookies?.delete('__signedInUserObj')
        return NextResponse.redirect(new URL(`${unauthorizedBasePath}/login`, request.url))
    }
    if (adminBasePath === pathname) return NextResponse.redirect(new URL(`${adminBasePath}/dashboard`, request.url))

    if (pathname.startsWith(`${unauthorizedBasePath}/`) && !isMissingUserCookieObj) return NextResponse.redirect(new URL(usertype === 2 ? `${adminBasePath}/dashboard` : `${userBasePath}/dashboard`, request.url))

    if ((pathname.startsWith(`${adminBasePath}/`) || pathname.startsWith(`${userBasePath}/`)) && isMissingUserCookieObj) return NextResponse.redirect(new URL(`${unauthorizedBasePath}/login`, request.url))

    if (pathname.startsWith(`${adminBasePath}/`) && usertype === 1) return NextResponse.redirect(new URL(`${userBasePath}/dashboard`, request.url))

    if (pathname.startsWith(`${userBasePath}/`) && usertype === 2) return NextResponse.redirect(new URL(`${adminBasePath}/dashboard`, request.url))
}