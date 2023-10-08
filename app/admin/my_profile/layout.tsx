import * as React from 'react'
import { user_profile_meta } from '@/app/utils/statics'

export const metadata = { ...user_profile_meta }
export const dynamic = 'force-dynamic'

interface UserProfileLayoutProps {
    children: React.ReactNode
}

const UserProfileLayout: React.FC<UserProfileLayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default UserProfileLayout