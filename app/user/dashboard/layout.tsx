import * as React from "react"

interface UserDashboardLayoutProps {
    children: React.ReactNode
}

const UserDashboardLayout: React.FC<UserDashboardLayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default UserDashboardLayout