import * as React from 'react'
import { recycle_bin_meta } from '@/app/utils/statics'

export const metadata = { ...recycle_bin_meta }
export const dynamic = 'force-dynamic'

interface RecycleBinLayoutProps {
    children: React.ReactNode
}

const RecycleBinLayout: React.FC<RecycleBinLayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default RecycleBinLayout