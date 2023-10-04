import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, RadioGroup, Typography } from '@mui/material'
import * as React from 'react'
import moment from 'moment'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import styles from '../../styles.module.css'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import { SaveBookingsPageState } from '@/redux/app/slice.app'
import MessageBox from '@/app/utils/components/MessageBox'
import InputField from '@/app/components/Input'
import useCustomMethods from '@/app/hooks/useCustomMethods'
import BookingStatusSelector from '@/app/utils/components/Selectors/BookingStatus'
import useValidations from '@/app/hooks/useValidations'
import filter_bookings from '@/app/actions/bookings/booking.filter'
import { FetchBookings } from '@/redux/bookings/slice.bookings'


interface FilterBookingsStates {
    from: string
    to: string
    status: string | number
    open: boolean
    message: string
    isErrorFree: boolean
    loading: boolean
}

interface FilterBookingsProps {
    paginate: (page: number, totalItem: number, totalPages: number) => void
}

const FilterBookings: React.FC<FilterBookingsProps> = ({ paginate }) => {
    const app = useAppSelector(state => state.appReducer.bookings)
    const dispatch = useAppDispatch()
    const methodHooks = useCustomMethods()
    const validations = useValidations()
    const [states, setStates] = React.useState<FilterBookingsStates>({
        from: '',
        to: moment(new Date()).format("YYYY-MM-DD"),
        status: '',
        open: false,
        message: '',
        isErrorFree: false,
        loading: false
    })
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveBookingsPageState({ ...app, hasOpenedBookingFilterPrompt: false }))
    }
    const filterHandler = async () => {
        setStates(prev => ({ ...prev, message: '', open: false, isErrorFree: false }))
        const params = {
            data: {
                from: states.from,
                to: states.to,
                status: Number(states.status)
            },
            next: () => setStates(prev => ({ ...prev, loading: true }))
        }
        const validate = validations.validateBookingFilter({ ...params })
        if (validate?.error !== undefined) return setStates(prev => ({ ...prev, message: validate?.error, open: true, isErrorFree: false }))
        const filter = await filter_bookings({ page: 1, from: states.from, to: states.to, status: params.data.status })
        setStates(prev => ({ ...prev, loading: false }))
        if (parseInt(filter.data?.code) !== 200) return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
        const collection = filter.data?.data
        if (collection?.bookings?.length === 0) return setStates(prev => ({ ...prev, message: 'No matching records found', open: true, isErrorFree: false }))
        dispatch(FetchBookings([...collection?.bookings]))
        const page_data = collection?.page_data
        dispatch(SaveBookingsPageState({
            ...app,
            isFilteredResultDispayed: true,
            isBookingSearchResultDisplayed: false,
            hasOpenedBookingFilterPrompt: false,
            bookingFilters: page_data?.totalPages > 1 ? {
                to: states.to,
                from: states.from,
                status: params.data.status
            } : {}
        }))
        paginate(page_data?.currentPage, page_data?.totalCount, page_data?.totalPages)
    }
    return (
        <Dialog open={app.hasOpenedBookingFilterPrompt} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <DialogTitle className={styles.text} style={{ cursor: 'move' }} id="draggable-dialog-title">{"Filter bookings"}</DialogTitle>
            <MessageBox
                open={states.open}
                message={states.message}
                isErrorFree={states.isErrorFree}
            />
            <DialogContent>
                <Typography variant='body2'>{"Choose a date range or select a status below to retrieve most related bookings. NB: The dates to select are the scheduled dates"}</Typography>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} className={styles.input_container} sx={{ mt: 1 }}>
                        <InputField
                            value={states.from} type='date'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, from: (e.target as HTMLInputElement).value }))}
                            classes={styles.input}
                            disabled={states.loading}
                            placeholder='Select a from date'
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} className={styles.input_container} sx={{ mt: 1 }}>
                        <InputField
                            value={states.to} type='date'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, to: (e.target as HTMLInputElement).value }))}
                            classes={styles.input}
                            disabled={states.loading}
                            placeholder='Select a to date'
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <RadioGroup value={states.status} onChange={(e) => setStates(prev => ({ ...prev, status: Number(e.target.value) }))} aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group" row>{<BookingStatusSelector />}</RadioGroup>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button className={styles.dashedBoaderBtn} autoFocus onClick={handleClose}>
                    {"Cancel"}
                </Button>
                <Button disabled={states.loading} className={styles.dashedBoaderBtn} onClick={filterHandler}>
                    {states.loading ? (
                        <CircularProgress color='inherit' size={15} />
                    ) : 'filter'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default FilterBookings