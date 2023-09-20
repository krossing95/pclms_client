import { equipment_meta } from '@/app/utils/statics'
import * as React from 'react'

export const metadata = { ...equipment_meta }

interface UserEquipmentLayoutProps {
    children: React.ReactNode
}

const UserEquipmentLayout: React.FC<UserEquipmentLayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default UserEquipmentLayout