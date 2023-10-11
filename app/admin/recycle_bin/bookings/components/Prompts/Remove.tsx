import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import * as React from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import MessageBox from '@/app/utils/components/MessageBox'
import { SaveBookingsPageState } from '@/redux/app/slice.app'
import { FetchBookings } from '@/redux/bookings/slice.bookings'
import styles from '@/app/user/bookings/styles.module.css'
import remove_hidden_booking from '@/app/actions/recycle_bin/bin.remove_booking'

interface ClearHiddenBookingStates {
    open: boolean
    message: string
    isErrorFree: boolean
    loading: boolean
}

interface HiddenBookingRemoveProps {
    paginate: (page: number, totalItem: number, totalPages: number) => void
}

const RemoveHiddenBooking: React.FC<HiddenBookingRemoveProps> = ({ paginate }) => {
    const app = useAppSelector(state => state.appReducer.bookings)
    const dispatch = useAppDispatch()
    const [states, setStates] = React.useState<ClearHiddenBookingStates>({
        open: false,
        message: '',
        isErrorFree: false,
        loading: false
    })
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveBookingsPageState({
            ...app,
            hasOpenedBookingCancelPrompt: false,
            selectedBookingId: undefined
        }))
    }
    const removeHandler = async () => {
        setStates(prev => ({ ...prev, loading: true, name: '' }))
        try {
            const remove = await remove_hidden_booking({ id: app.selectedBookingId })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(remove.data?.code) !== 200) return setStates(prev => ({ ...prev, message: remove.data?.message, open: true, isErrorFree: false }))
            const collection = remove.data?.data
            dispatch(FetchBookings([...collection?.equipment]))
            const page_data = collection?.page_data
            dispatch(SaveBookingsPageState({
                ...app,
                isBookingSearchResultDisplayed: false,
                hasOpenedBookingCancelPrompt: false
            }))
            paginate(page_data?.currentPage, page_data?.totalCount, page_data?.totalPages)
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
        }
    }
    return (
        <Dialog open={app.hasOpenedBookingCancelPrompt} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <DialogTitle className={styles.text} style={{ cursor: 'move' }} id="draggable-dialog-title">{"Delete item"}</DialogTitle>
            <MessageBox
                open={states.open}
                message={states.message}
                isErrorFree={states.isErrorFree}
            />
            <DialogContent>
                <Typography gutterBottom variant='body2'>{"Are you sure you want to permanently remove the selected hidden booking?"}</Typography>
            </DialogContent>
            <DialogActions>
                <Button className={styles.dashedBoaderBtn} autoFocus onClick={handleClose}>
                    {"Cancel"}
                </Button>
                <Button disabled={states.loading} className={styles.dashedBoaderBtn} onClick={removeHandler}>
                    {states.loading ? (
                        <CircularProgress color='inherit' size={15} />
                    ) : 'remove'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default RemoveHiddenBooking