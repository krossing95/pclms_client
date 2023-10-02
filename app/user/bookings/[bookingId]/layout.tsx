import * as React from 'react'
import { bookings_meta } from '@/app/utils/statics'

export const metadata = { ...bookings_meta }
export const dynamic = 'force-dynamic'

interface SingleBookingManagementLayoutProps {
    children: React.ReactNode
}

const SingleBookingManagementLayout: React.FC<SingleBookingManagementLayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default SingleBookingManagementLayout