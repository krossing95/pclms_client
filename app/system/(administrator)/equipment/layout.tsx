import { equipment_meta } from '@/app/utils/statics'
import * as React from 'react'

export const metadata = { ...equipment_meta }

interface EquipmentLayoutProps {
    children: React.ReactNode
}

const DaysManagementLayout: React.FC<EquipmentLayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default DaysManagementLayout