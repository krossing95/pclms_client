import MovablePrompt from '@/app/utils/components/MovablePrompt'
import { SaveBookingsPageState } from '@/redux/app/slice.app'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { CircularProgress, Dialog, DialogContent, DialogActions, Button, DialogTitle, Grid, RadioGroup, Typography } from '@mui/material'
import { useParams } from 'next/navigation'
import * as React from 'react'
import styles from '@/app/user/bookings/styles.module.css'
import MessageBox from '@/app/utils/components/MessageBox'
import BookingStatusSelector from '@/app/utils/components/Selectors/BookingStatus'
import { Booking_Status } from '@/app/utils/statics'
import assign_status from '@/app/actions/bookings/booking.assign_status'
import { FetchBookings } from '@/redux/bookings/slice.bookings'

interface BookingStatusUpdateStates {
    status: number | string
    loading: boolean
    open: boolean
    message: string
    isErrorFree: boolean
}

const BookingStatusUpdate = () => {
    const { bookingId } = useParams()
    const app = useAppSelector(state => state.appReducer.bookings)
    const booking = useAppSelector(state => state.bookingsReducer.bookings).filter(booking => booking.id === bookingId)?.[0]
    const [states, setStates] = React.useState<BookingStatusUpdateStates>({
        status: booking.status || '',
        loading: false,
        open: false,
        message: '',
        isErrorFree: false
    })
    const dispatch = useAppDispatch()
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveBookingsPageState({ ...app, hasOpenedBookingApprovalPrompt: false }))
    }
    const statusUpdateHandler = async () => {
        setStates(prev => ({ ...prev, message: '', open: false, isErrorFree: false }))
        const status = Number(states.status)
        if (!Booking_Status.some(e => e.value === status)) return setStates(prev => ({ ...prev, message: 'Invalid status selected', open: true, isErrorFree: false }))
        if (booking.status === status) return setStates(prev => ({ ...prev, message: 'No changes found yet', open: true, isErrorFree: false }))
        setStates(prev => ({ ...prev, loading: true }))
        try {
            const statusAssignment = await assign_status({ id: bookingId, status })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(statusAssignment.data?.code) !== 200) return setStates(prev => ({ ...prev, message: statusAssignment.data?.message, open: true, isErrorFree: false }))
            dispatch(FetchBookings([{ ...booking, status }]))
            return setStates(prev => ({ ...prev, message: statusAssignment.data?.message, open: true, isErrorFree: true }))
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: true }))
        }
    }
    return (
        <Dialog open={app.hasOpenedBookingApprovalPrompt} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <DialogTitle className={styles.text} style={{ cursor: 'move' }} id="draggable-dialog-title">{"Status assignment"}</DialogTitle>
            <MessageBox
                open={states.open}
                isErrorFree={states.isErrorFree}
                message={states.message}
            />
            <DialogContent>
                <Typography variant='body2'>{"Please choose a status below that fits the targetted booking to update"}</Typography>
                <Grid container spacing={1}>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <RadioGroup value={states.status} onChange={(e) => setStates(prev => ({ ...prev, status: Number(e.target.value) }))} aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group" row>{<BookingStatusSelector />}</RadioGroup>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button className={styles.dashedBoaderBtn} autoFocus onClick={handleClose}>
                    {"close"}
                </Button>
                <Button disabled={states.loading} className={styles.dashedBoaderBtn} onClick={statusUpdateHandler}>
                    {states.loading ? (
                        <CircularProgress color='inherit' size={15} />
                    ) : 'assign'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default BookingStatusUpdate