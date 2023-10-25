'use client'

import { Avatar, Box, IconButton, Tooltip } from '@mui/material'
import * as React from 'react'
import { DeleteSweepOutlined, ModeEditOutlined } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useParams } from 'next/navigation'
import { SuspenseLoader } from '../exports'
import { FetchBookings } from '@/redux/bookings/slice.bookings'
import styles from '../styles.module.css'
import { SaveBookingsPageState } from '@/redux/app/slice.app'
import get_booking from '@/app/actions/bookings/booking.get_one'
import { toast } from 'react-toastify'
import DataRepresentation from './components/DataRepresentation'
import Cancel from './components/Prompts/Cancel'
import BookingUpdatePage from './components/Prompts/Update'

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
            const getBooking = await get_booking({ id: booking.id })
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
                                <Tooltip title='Cancel Booking'>
                                    <IconButton onClick={() => dispatch(SaveBookingsPageState({ ...app, hasOpenedBookingCancelPrompt: true }))}>
                                        <DeleteSweepOutlined />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Edit Booking'>
                                    <IconButton disabled={booking.update_count === 3 ? true : false} onClick={() => dispatch(SaveBookingsPageState({ ...app, hasOpenedBookingEditPrompt: true }))}>
                                        <ModeEditOutlined />
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
                ) : app?.hasOpenedBookingEditPrompt ? (
                    <BookingUpdatePage />
                ) : null}
            </React.Fragment>
        </Box>
    )
}
export default SingleBookingPage