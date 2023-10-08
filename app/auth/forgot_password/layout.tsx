import { forgot_password_meta } from '@/app/utils/statics'
import * as React from 'react'

export const metadata = { ...forgot_password_meta }


interface ForgotPasswordLayoutProps {
    children: React.ReactNode
}

const ForgotPasswordLayout: React.FC<ForgotPasswordLayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default ForgotPasswordLayout