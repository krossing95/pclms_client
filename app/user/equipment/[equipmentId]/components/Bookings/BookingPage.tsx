import * as React from 'react'
import { Box, Button, CircularProgress, Dialog, Paper, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { SaveEquipmentPageState } from '@/redux/app/slice.app'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import MessageBox from '@/app/utils/components/MessageBox'
import styles from './styles.module.css'
import { useParams } from 'next/navigation'
import { SuspenseLoader } from '../../exports'
import get_requirements from '@/app/actions/bookings/booking.get_requirements'
import { toast } from 'react-toastify'
import type { UnavailableDays } from '@/app/types/type.unavailable_days'
import UnavailableDaysPage from './UnavailableDays'
import BookingSystem from './BookingSystem'
import useCustomMethods from '@/app/hooks/useCustomMethods'

interface BookingPageStates {
    open: boolean
    isErrorFree: boolean
    message: string
    loading: boolean
    booking: boolean
    unavailable_days: UnavailableDays[]
}

const BookingPage = () => {
    const { equipmentId } = useParams()
    const useMethods = useCustomMethods()
    const app = useAppSelector(state => state.appReducer.equipment)
    const dispatch = useAppDispatch()
    const [states, setStates] = React.useState<BookingPageStates>({
        open: false,
        isErrorFree: false,
        message: '',
        loading: true,
        booking: false,
        unavailable_days: []
    })
    const getRequirements = async () => {
        try {
            const requirements = await get_requirements({ id: equipmentId })
            if (parseInt(requirements.data?.code) !== 200) {
                toast(requirements.data?.message)
                return handleClose()
            }
            const data = requirements.data?.data
            return setStates(prev => ({ ...prev, loading: false, unavailable_days: data?.unavailable_days }))
        } catch (error) {
            toast('Something went wrong')
            return handleClose()
        }
    }
    React.useEffect(() => {
        getRequirements() // eslist-disable-next-line
    }, [])
    const handleClose = () => {
        if (states.booking) return false
        useMethods.removeQueryParameter('state')
        dispatch(SaveEquipmentPageState({ ...app, hasOpenedBookingPrompt: false }))
    }
    const submitHandler = () => setStates(prev => ({ ...prev, booking: true }))
    return (
        <Dialog fullScreen open={app.hasOpenedBookingPrompt} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            {states.loading ? (
                <SuspenseLoader text='Loading Requirements' ignoreOptionalHeight={false} />
            ) : (
                <React.Fragment>
                    <Box component='div' className={styles.header}>
                        <DialogTitle className='text' style={{ cursor: 'move' }} id="draggable-dialog-title">{"Book Equipment"}</DialogTitle>
                    </Box>
                    <MessageBox
                        open={states.open}
                        isErrorFree={states.isErrorFree}
                        message={states.message}
                    />
                    <DialogContent>
                        <Box component='div' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Grid container>
                                <Grid item xs={12} md={7}>
                                    <UnavailableDaysPage
                                        unavailable_days={states.unavailable_days}
                                    />
                                </Grid>
                                <Grid item xs={12} md={1} />
                                <Grid item xs={12} md={4}>
                                    <Box component='div' className={styles.bookingFormPanel}>
                                        <Typography>{"Select a date below to continue"}</Typography>
                                        <BookingSystem
                                            shouldSubmit={states.booking}
                                            setButtonLoader={
                                                (progress: boolean) => setStates(prev => ({ ...prev, booking: progress }))
                                            }
                                            unavailable_days={states.unavailable_days}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button className={styles.dashedBoaderBtn} autoFocus onClick={handleClose}>
                            {"close"}
                        </Button>
                        <Button disabled={states.booking} className={styles.dashedBoaderBtn} onClick={submitHandler}>
                            {states.booking ? (
                                <CircularProgress color='inherit' size={15} />
                            ) : 'book'}
                        </Button>
                    </DialogActions>
                </React.Fragment>
            )}
        </Dialog>
    )
}
export default BookingPage