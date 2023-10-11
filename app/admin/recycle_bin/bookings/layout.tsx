import * as React from 'react'
import { recycle_bin_meta } from '@/app/utils/statics'
import type { Metadata } from 'next'

export const metadata: Metadata = { ...recycle_bin_meta, title: 'Hidden bookings | PCLMS - Laboratory Management System' }
export const dynamic = 'force-dynamic'

interface BookingsRecycleBinLayoutProps {
    children: React.ReactNode
}

const BookingsRecycleBinLayout: React.FC<BookingsRecycleBinLayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default BookingsRecycleBinLayout