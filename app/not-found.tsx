'use client'

import * as React from "react"
import NotFoundWrapper from "./components/NotFoundWrapper"
import NavigatorButton from "./utils/components/NavigatorButton"

const NotFound = () => {
    return (
        <NotFoundWrapper>
            <NavigatorButton
                destination="/auth/register"
                direction="backward"
            />
        </NotFoundWrapper>
    )
}
export default NotFound