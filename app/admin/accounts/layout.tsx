import { accounts_meta } from '@/app/utils/statics'
import * as React from 'react'

export const metadata = { ...accounts_meta }

interface AccountsLayoutProps {
    children: React.ReactNode
}

const AccountsLayout: React.FC<AccountsLayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default AccountsLayout