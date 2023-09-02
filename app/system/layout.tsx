import * as React from "react"
import AppHeader from "./components/Header/Header"

interface SystemLayoutProps {
    children: React.ReactNode
}

const SystemLayout: React.FC<SystemLayoutProps> = ({ children }) => {
    return (
        <AppHeader>
            {children}
        </AppHeader>
    )
}
export default SystemLayout