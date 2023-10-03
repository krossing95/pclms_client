import MovablePrompt from '@/app/utils/components/MovablePrompt'
import StringMethods from '@/helpers/helper.string_methods'
import { SaveBookingsPageState } from '@/redux/app/slice.app'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material'
import * as React from 'react'
import styles from '../../styles.module.css'
import MessageBox from '@/app/utils/components/MessageBox'
import { FetchBookings } from '@/redux/bookings/slice.bookings'
import search_bookings from '@/app/actions/bookings/bookings.search'
import InputField from '@/app/components/Input'

interface SearchBookingStates {
    keyword: string
    open: boolean
    message: string
    isErrorFree: boolean
    loading: boolean
}

interface SearchBookingsProps {
    paginate: (page: number, totalItem: number, totalPages: number) => void
}

const Search: React.FC<SearchBookingsProps> = ({ paginate }) => {
    const app = useAppSelector(state => state.appReducer.bookings)
    const dispatch = useAppDispatch()
    const stringMethod = StringMethods()
    const [states, setStates] = React.useState<SearchBookingStates>({
        keyword: '',
        open: false,
        message: '',
        isErrorFree: false,
        loading: false
    })
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveBookingsPageState({ ...app, hasOpenedSearchBoxPrompt: false }))
    }
    const searchHandler = async () => {
        setStates(prev => ({ ...prev, open: false, message: '', isErrorFree: false }))
        const word = stringMethod.textProcessor(states.keyword)?.trim()
        if (word.length === 0) return setStates(prev => ({ ...prev, keyword: '' }))
        setStates(prev => ({ ...prev, loading: true }))
        try {
            const result = await search_bookings({ page: 1, keyword: word })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(result.data?.code) !== 200) return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
            const collection = result.data?.data
            if (collection?.bookings?.length === 0) return setStates(prev => ({ ...prev, message: 'No matching records found', open: true, isErrorFree: false }))
            dispatch(FetchBookings([...collection?.bookings]))
            const page_data = collection?.page_data
            dispatch(SaveBookingsPageState({
                ...app,
                isBookingSearchResultDisplayed: true,
                hasOpenedSearchBoxPrompt: false,
                bookingSearchQuery: page_data?.totalPages > 1 ? word : ''
            }))
            paginate(page_data?.currentPage, page_data?.totalCount, page_data?.totalPages)
        } catch (error) {
            return setStates(prev => ({ ...prev, open: false, message: 'Something went wrong', isErrorFree: false }))
        }
    }
    return (
        <Dialog open={app.hasOpenedSearchBoxPrompt} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <DialogTitle className={styles.text} style={{ cursor: 'move' }} id="draggable-dialog-title">{"Search bookings"}</DialogTitle>
            <MessageBox
                open={states.open}
                message={states.message}
                isErrorFree={states.isErrorFree}
            />
            <DialogContent>
                <Typography variant='body2'>{"Enter a keyword in the search box below to search for related bookings"}</Typography>
                <Grid container spacing={1}>
                    <Grid item xs={12} className={styles.input_container}>
                        <InputField
                            value={states.keyword} type='text'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, keyword: (e.target as HTMLInputElement).value }))}
                            classes={styles.input}
                            disabled={states.loading}
                            placeholder='Enter your keyword...'
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button className={styles.dashedBoaderBtn} autoFocus onClick={handleClose}>
                    {"Cancel"}
                </Button>
                <Button disabled={states.loading} className={styles.dashedBoaderBtn} onClick={searchHandler}>
                    {states.loading ? (
                        <CircularProgress color='inherit' size={15} />
                    ) : 'search'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default Search