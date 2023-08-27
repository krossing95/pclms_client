import * as React from "react"

interface AuthLayoutProps {
    children: React.ReactNode
}

const AuthPage: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default AuthPage