'use client'

import { Avatar, Box, IconButton, Tooltip } from '@mui/material'
import * as React from 'react'
import { CheckCircleOutlined, DeleteSweepOutlined } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useParams } from 'next/navigation'
import { FetchBookings } from '@/redux/bookings/slice.bookings'
import styles from '@/app/user/bookings/styles.module.css'
import { SaveBookingsPageState } from '@/redux/app/slice.app'
import get_booking from '@/app/actions/bookings/booking.get_one'
import { toast } from 'react-toastify'
import DataRepresentation from './components/DataRepresentation'
import Cancel from '@/app/user/bookings/[bookingId]/components/Prompts/Cancel'
import SuspenseLoader from '@/app/components/Loader'
import moment from 'moment'
import BookingStatusUpdate from './components/Prompts/StatusUpdate'
import MarkAttendance from './components/MarkAsAttended'

interface SingleBookingState {
    loading: boolean
}

const SingleBookingPage = () => {
    const { bookingId } = useParams()
    const app = useAppSelector(state => state.appReducer.bookings)
    const [states, setStates] = React.useState<SingleBookingState>({ loading: true })
    const dispatch = useAppDispatch()
    const booking = useAppSelector(state => state.bookingsReducer.bookings).filter(booking => booking.id === (bookingId as string))?.[0]
    const loadData = async () => {
        try {
            const getBooking = await get_booking({ id: bookingId as string })
            if (parseInt(getBooking.data?.code) !== 200) return toast(getBooking.data?.message)
            const data = getBooking.data?.data
            setStates(prev => ({ ...prev, loading: false }))
            dispatch(FetchBookings([{ ...data }]))
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    React.useEffect(() => {
        loadData() // eslint-disable-next-line
    }, [])
    return (
        <Box component='div'>
            {states.loading ? (
                <SuspenseLoader text='Loading Booking Data' ignoreOptionalHeight={true} />
            ) : (
                <React.Fragment>
                    <Box component='div' className={styles.header}>
                        <Avatar
                            alt={booking.name}
                            src={booking?.photo_url}
                            sx={{ width: 56, height: 56, border: '3px #F9FAFB solid', borderRadius: '100%' }}
                        />
                        <Box component='div' className={styles.toolbar}>
                            <React.Fragment>
                                <MarkAttendance />
                                <Tooltip title='Cancel Booking'>
                                    <IconButton onClick={() => dispatch(SaveBookingsPageState({ ...app, hasOpenedBookingCancelPrompt: true }))}>
                                        <DeleteSweepOutlined />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Booking Status Update'>
                                    <IconButton disabled={moment(booking.date).isBefore(moment(new Date())) ? true : false} onClick={() => dispatch(SaveBookingsPageState({ ...app, hasOpenedBookingApprovalPrompt: true }))}>
                                        <CheckCircleOutlined />
                                    </IconButton>
                                </Tooltip>
                            </React.Fragment>
                        </Box>
                    </Box>
                    <DataRepresentation />
                </React.Fragment>
            )}
            <React.Fragment>
                {app?.hasOpenedBookingCancelPrompt ? (
                    <Cancel />
                ) : app?.hasOpenedBookingApprovalPrompt ? (
                    <BookingStatusUpdate />
                ) : null}
            </React.Fragment>
        </Box>
    )
}
export default SingleBookingPage