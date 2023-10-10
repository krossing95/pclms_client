import * as React from 'react'
import { recycle_bin_meta } from '@/app/utils/statics'
import type { Metadata } from 'next'

export const metadata: Metadata = { ...recycle_bin_meta, title: 'Hidden equipment | PCLMS - Laboratory Management System' }
export const dynamic = 'force-dynamic'

interface EquipmentRecycleBinLayoutProps {
    children: React.ReactNode
}

const EquipmentRecycleBinLayout: React.FC<EquipmentRecycleBinLayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default EquipmentRecycleBinLayout