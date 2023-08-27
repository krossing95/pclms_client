import * as React from 'react'
import VerificationLayout from '../../register/verify/layout'

interface LoginVerificationLayoutProps {
    children: React.ReactNode
}

const LoginVerificationLayout: React.FC<LoginVerificationLayoutProps> = ({ children }) => {
    return (
        <VerificationLayout>
            {children}
        </VerificationLayout>
    )
}

export default LoginVerificationLayout