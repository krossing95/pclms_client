import { DeleteForeverOutlined } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import * as React from 'react'
import styles from '@/app/user/bookings/styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { SaveBookingsPageState } from '@/redux/app/slice.app'

interface HiddenBookingsActivityProps {
    id: string
}

export default function Activity({ id }: HiddenBookingsActivityProps) {
    const app = useAppSelector(state => state.appReducer.bookings)
    const dispatch = useAppDispatch()
    return (
        <Tooltip title='Delete Booking'>
            <IconButton onClick={() => dispatch(SaveBookingsPageState({ ...app, hasOpenedBookingCancelPrompt: true, selectedBookingId: id }))}
                className={styles.activity_edit}>
                <DeleteForeverOutlined fontSize='small' />
            </IconButton>
        </Tooltip>
    )
}