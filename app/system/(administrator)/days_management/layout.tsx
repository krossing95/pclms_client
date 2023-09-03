import { days_mgt_meta } from '@/app/utils/statics'
import * as React from 'react'

export const metadata = { ...days_mgt_meta }

interface DaysManagementLayoutProps {
    children: React.ReactNode
}

const DaysManagementLayout: React.FC<DaysManagementLayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default DaysManagementLayout