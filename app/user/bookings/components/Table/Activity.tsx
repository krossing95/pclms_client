import { SaveBookingsPageState } from '@/redux/app/slice.app'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { DeleteSweepOutlined, LaunchOutlined } from '@mui/icons-material'
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
    const dispatch = useAppDispatch()
    const app = useAppSelector(state => state.bookingsReducer.bookings)
    const router = useRouter()
    const pathname = usePathname()
    return (
        <React.Fragment>
            <Tooltip title='Cancel Booking'>
                <IconButton onClick={() => dispatch(SaveBookingsPageState({ ...app, selectedBookingId: id, hasOpenedDeleteBookingPrompt: true }))} className={styles.activity_remove}>
                    <DeleteSweepOutlined fontSize='small' />
                </IconButton>
            </Tooltip>
            <IconButton onClick={() => router.push(cookie?.usertype === Number(process.env.NEXT_PUBLIC_APP_ADMIN) ?
                `/admin/bookings/${id}` :
                cookie?.usertype === Number(process.env.NEXT_PUBLIC_APP_USER) ?
                    `/user/bookings/${id}` :
                    pathname)}
                className={styles.activity_edit}>
                <LaunchOutlined fontSize='small' />
            </IconButton>
        </React.Fragment>
    )
}