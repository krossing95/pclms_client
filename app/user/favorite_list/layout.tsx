import * as React from 'react'
import { favorite_list_meta } from '@/app/utils/statics'

export const metadata = { ...favorite_list_meta }
export const dynamic = 'force-dynamic'

interface FavoriteListManagementLayoutProps {
    children: React.ReactNode
}

const FavoriteListManagementLayout: React.FC<FavoriteListManagementLayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default FavoriteListManagementLayout