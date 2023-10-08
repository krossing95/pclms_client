'use client'

import NotFoundWrapper from "@/app/components/NotFoundWrapper"
import NavigatorButton from "@/app/utils/components/NavigatorButton"
import Cookies from "js-cookie"
import * as React from "react"

const NotFound = () => {
    const cookies = Cookies.get('__signedInUserObj')
    const cookieOfInterest = cookies !== undefined ? cookies : '{}'
    const cookieObj = JSON.parse(cookieOfInterest)?.user
    const usertype: number = cookieObj?.usertype || 0
    return (
        <NotFoundWrapper>
            <NavigatorButton
                destination={`/${usertype === 2 ? 'admin' : usertype === 1 ? 'user' : ''}/equipment`}
                direction="backward"
            />
        </NotFoundWrapper>
    )
}
export default NotFound