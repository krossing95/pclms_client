import { verify_meta } from '@/app/utils/statics'
import * as React from 'react'

export const metadata = { ...verify_meta }

interface VerificationLayoutProps {
    children: React.ReactNode
}

const VerificationLayout: React.FC<VerificationLayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default VerificationLayout