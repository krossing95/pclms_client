import { reset_password_meta } from '@/app/utils/statics'
import * as React from 'react'

export const metadata = { ...reset_password_meta }


interface PasswordResetLayoutProps {
    children: React.ReactNode
}

const PasswordResetLayout: React.FC<PasswordResetLayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default PasswordResetLayout