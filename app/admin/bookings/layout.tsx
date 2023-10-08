import { bookings_meta } from '@/app/utils/statics'
import * as React from 'react'

export const metadata = { ...bookings_meta }
export const dynamic = 'force-dynamic'

interface BookingsManagementLayoutProps {
    children: React.ReactNode
}

const BookingsManagementLayout: React.FC<BookingsManagementLayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default BookingsManagementLayout