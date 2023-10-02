import MessageBox from '@/app/utils/components/MessageBox'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import { SaveBookingsPageState } from '@/redux/app/slice.app'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Typography, } from '@mui/material'
import { useParams, usePathname, useRouter } from 'next/navigation'
import * as React from 'react'
import styles from '../../../styles.module.css'
import cancel_booking from '@/app/actions/bookings/booking.cancel'

interface BookingCancelStates {
    open: boolean
    message: string
    isErrorFree: boolean
    loading: boolean
}

const Cancel = () => {
    const { bookingId } = useParams()
    const pathname = usePathname()
    const app = useAppSelector(state => state.appReducer.bookings)
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [states, setStates] = React.useState<BookingCancelStates>({
        open: false,
        message: '',
        isErrorFree: false,
        loading: false
    })
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveBookingsPageState({ ...app, hasOpenedBookingCancelPrompt: false }))
    }
    const cancelHandler = async () => {
        setStates(prev => ({ ...prev, open: false, message: '', isErrorFree: false }))
        setStates(prev => ({ ...prev, loading: true }))
        try {
            const cancel = await cancel_booking({ id: bookingId })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(cancel.data?.code) !== 200) return setStates(prev => ({ ...prev, message: cancel.data?.message, open: true, isErrorFree: false }))
            setStates(prev => ({ ...prev, message: cancel.data?.message, open: true, isErrorFree: true }))
            router.push(pathname.startsWith('/admin') ? '/admin/bookings' : pathname.startsWith('/user') ? '/user/bookings' : pathname)
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
        }
    }
    return (
        <Dialog open={app.hasOpenedBookingCancelPrompt} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <DialogTitle className={styles.text} style={{ cursor: 'move' }} id="draggable-dialog-title">Cancel appointment</DialogTitle>
            <MessageBox
                open={states.open}
                isErrorFree={states.isErrorFree}
                message={states.message}
            />
            <DialogContent>
                <Typography gutterBottom variant='body2'>{'Are you absolutely sure you want to cancel the targetted appointment?'}</Typography>
                <Typography gutterBottom variant='body2'>{"This action cannot be undone, therefore, tread cautiously."}</Typography>
            </DialogContent>
            <DialogActions>
                <Button className={styles.dashedBoaderBtn} autoFocus onClick={handleClose}>
                    Close
                </Button>
                <Button disabled={states.loading} className={styles.dashedBoaderBtn} onClick={cancelHandler}>
                    {states.loading ? (
                        <CircularProgress color='inherit' size={15} />
                    ) : 'cancel'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default Cancel