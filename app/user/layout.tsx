import * as React from "react"
import AppHeader from "../admin/components/Header/Header"

interface UserModuleLayoutProps {
    children: React.ReactNode
}

const UserModuleLayout: React.FC<UserModuleLayoutProps> = ({ children }) => {
    return (
        <AppHeader>
            {children}
        </AppHeader>
    )
}
export default UserModuleLayout