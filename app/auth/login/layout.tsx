import { login_meta } from '@/app/utils/statics'
import * as React from 'react'

export const metadata = { ...login_meta }


interface LoginLayoutProps {
    children: React.ReactNode
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default LoginLayout