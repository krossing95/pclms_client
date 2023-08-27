import { register_meta } from '@/app/utils/statics'
import * as React from 'react'

export const metadata = { ...register_meta }


interface RegisterLayoutProps {
    children: React.ReactNode
}

const RegisterLayout: React.FC<RegisterLayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default RegisterLayout