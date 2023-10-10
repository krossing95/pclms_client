import mark_attendance from '@/app/actions/bookings/booking.mark_attendance'
import { FetchBookings } from '@/redux/bookings/slice.bookings'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { TurnedInNotOutlined, TurnedInOutlined } from '@mui/icons-material'
import { CircularProgress, IconButton, Tooltip } from '@mui/material'
import { useParams } from 'next/navigation'
import * as React from 'react'
import { toast } from 'react-toastify'
import moment from 'moment'

interface MarkAttendanceState {
    loading: boolean
}

const MarkAttendance = () => {
    const { bookingId } = useParams()
    const booking = useAppSelector(state => state.bookingsReducer.bookings).filter(item => item.id === bookingId)?.[0]
    const dispatch = useAppDispatch()
    const [states, setStates] = React.useState<MarkAttendanceState>({ loading: false })
    const handleAttendance = async () => {
        setStates(prev => ({ ...prev, loading: true }))
        try {
            const mark = await mark_attendance({ id: booking.id })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(mark.data?.code) !== 200) return toast(mark.data?.message)
            dispatch(FetchBookings([{ ...booking, has_attended: mark.data?.data?.is_saved }]))
            return toast(mark.data?.message)
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    return (
        <React.Fragment>
            {moment(booking.date).isSameOrBefore(moment(new Date())) ? (
                <Tooltip title={booking.has_attended ? 'Mark as unattended' : 'Mark as attended'}>
                    <span>
                        <IconButton disabled={states.loading} onClick={handleAttendance}>
                            {states.loading ? (
                                <CircularProgress color='inherit' size={22} />
                            ) : (
                                <React.Fragment>
                                    {booking.has_attended ? (
                                        <TurnedInNotOutlined />
                                    ) : (
                                        <TurnedInOutlined />
                                    )}
                                </React.Fragment>
                            )}
                        </IconButton>
                    </span>
                </Tooltip>
            ) : null}
        </React.Fragment>
    )
}
export default MarkAttendance