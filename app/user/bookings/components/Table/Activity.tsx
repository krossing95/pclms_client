import { LaunchOutlined } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import * as React from 'react'
import styles from '../../styles.module.css'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface BookingsActivityProps {
    id: string
}

export default function Activity({ id }: BookingsActivityProps) {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const router = useRouter()
    const pathname = usePathname()
    return (
        <Tooltip title='Open Booking'>
            <IconButton onClick={() => router.push(cookie?.usertype === Number(process.env.NEXT_PUBLIC_APP_ADMIN) ?
                `/admin/bookings/${id}` :
                cookie?.usertype === Number(process.env.NEXT_PUBLIC_APP_USER) ?
                    `/user/bookings/${id}` :
                    pathname)}
                className={styles.activity_edit}>
                <LaunchOutlined fontSize='small' />
            </IconButton>
        </Tooltip>
    )
}