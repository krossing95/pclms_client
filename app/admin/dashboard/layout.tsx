import { dashboard_meta } from '@/app/utils/statics'
import * as React from 'react'

export const metadata = { ...dashboard_meta }

interface DashboardLayoutProps {
    children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = async ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default DashboardLayout