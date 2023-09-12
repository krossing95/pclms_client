'use client'

import NotFoundWrapper from "@/app/components/NotFoundWrapper"
import NavigatorButton from "@/app/utils/components/NavigatorButton"
import * as React from "react"

const NotFound = () => {
    return (
        <NotFoundWrapper>
            <NavigatorButton
                destination="/system/equipment"
                direction="backward"
            />
        </NotFoundWrapper>
    )
}
export default NotFound