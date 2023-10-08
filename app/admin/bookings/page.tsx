'use client'

import { ReplayOutlined, SearchRounded, SortOutlined } from '@mui/icons-material'
import { Box, IconButton, Pagination, TableContainer, Table, Tooltip } from '@mui/material'
import * as React from 'react'
import { motion } from 'framer-motion'
import styles from './styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { toast } from 'react-toastify'
import { SaveBookingsPageState } from '@/redux/app/slice.app'
import { FetchBookings } from '@/redux/bookings/slice.bookings'
import { EmptyList, SuspenseLoader, Title } from '@/app/user/bookings/exports'
import get_bookings from '@/app/actions/bookings/bookings.get'
import search_bookings from '@/app/actions/bookings/bookings.search'
import BookingKeyRepresentation from '@/app/user/bookings/components/Key'
import Search from '@/app/user/bookings/components/Prompts/Search'
import filter_bookings from '@/app/actions/bookings/booking.filter'
import FilterBookings from '@/app/user/bookings/components/Prompts/Filter'
import Head from './components/Table/Head'
import Data from './components/Table/Data'

interface BookingListStates {
    loading: boolean
    currentPage: number
    totalCount: number
    totalPages: number
}

const BookingListPage = () => {
    const app = useAppSelector(state => state.appReducer.bookings)
    const [states, setStates] = React.useState<BookingListStates>({
        currentPage: 1, totalPages: 0, totalCount: 0, loading: true
    })
    const bookings = useAppSelector(state => state.bookingsReducer.bookings)
    const dispatch = useAppDispatch()
    const refreshHandler = async () => {
        try {
            setStates(prev => ({ ...prev, currentPage: 1, loading: true }))
            dispatch(SaveBookingsPageState({
                ...app,
                isBookingSearchResultDisplayed: false,
                isFilteredResultDispayed: false,
                bookingSearchQuery: "",
                bookingFilters: {}
            }))
            await loadData(1, true)
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    const loadData = async (page: number, refreshAction: boolean) => {
        try {
            setStates(prev => ({ ...prev, loading: true }))
            const bokings = (app.isBookingSearchResultDisplayed &&
                app.bookingSearchQuery.length > 0 &&
                !refreshAction) ? await search_bookings({ page: states.currentPage, keyword: app.bookingSearchQuery }) :
                (app.isFilteredResultDispayed &&
                    Object.keys(app.bookingFilters).length === 3 &&
                    !refreshAction) ?
                    await filter_bookings({ page: states.currentPage, from: app.bookingFilters.from, to: app.bookingFilters.to, status: Number(app.bookingFilters.status) }) :
                    await get_bookings({ page })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(bokings.data?.code) !== 200) return toast('Something went wrong')
            const data = bokings.data?.data
            setStates(prev => ({
                ...prev,
                currentPage: data?.page_data?.currentPage,
                totalCount: data?.page_data?.totalCount,
                totalPages: data?.page_data?.totalPages
            }))
            dispatch(SaveBookingsPageState({
                ...app,
                isBookingSearchResultDisplayed: data?.data_type === 'search' ? true : false,
                isFilteredResultDispayed: data?.data_type === 'filter' ? true : false
            }))
            return dispatch(FetchBookings([...data?.bookings]))
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    React.useEffect(() => {
        const toRefresh = (app.isBookingSearchResultDisplayed && app.bookingSearchQuery.length > 0) ||
            (app.isFilteredResultDispayed && Object.keys(app.bookingFilters).length === 3)
        loadData(states.currentPage, toRefresh ? false : true) //eslint-disable-next-line
    }, [states.currentPage])
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setStates(prev => ({ ...prev, currentPage: value, loading: prev.currentPage !== value ? true : false }))
    }
    return (
        <Box component='div' sx={{ mt: '50px' }}>
            <Box component='div' className={styles.header}>
                <Title text='Bookings' variant_switch={false} />
                <Box component='div' className={styles.toolbar}>
                    {(!states.loading && bookings.length > 0) ? (
                        <React.Fragment>
                            <Tooltip title='Search bookings'>
                                <IconButton onClick={app.isBookingSearchResultDisplayed ? refreshHandler : () => dispatch(SaveBookingsPageState({ ...app, hasOpenedSearchBoxPrompt: true }))}>
                                    {app.isBookingSearchResultDisplayed ? (
                                        <ReplayOutlined />
                                    ) : (
                                        <SearchRounded />
                                    )}
                                </IconButton>
                            </Tooltip>
                            <IconButton onClick={app.isFilteredResultDispayed ? refreshHandler : () => dispatch(SaveBookingsPageState({ ...app, hasOpenedBookingFilterPrompt: true }))}>
                                {app.isFilteredResultDispayed ? (
                                    <ReplayOutlined />
                                ) : (
                                    <SortOutlined />
                                )}
                            </IconButton>
                        </React.Fragment>
                    ) : null}
                </Box>
            </Box>
            <Box component='div'>
                {!states.loading ? (
                    <React.Fragment>
                        {bookings.length === 0 ? (
                            <EmptyList />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{
                                    opacity: 1, transition: { duration: 1 }
                                }}
                            >
                                <BookingKeyRepresentation />
                                <TableContainer component='div' sx={{ mt: 2 }}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <Head />
                                        <Data />
                                    </Table>
                                </TableContainer>
                            </motion.div>
                        )}
                    </React.Fragment>
                ) : (
                    <SuspenseLoader
                        text='Loading Bookings'
                        ignoreOptionalHeight
                    />
                )}
                <Box component='div' className={styles.loadmoreContainer} sx={{ mt: 4 }}>
                    {(!states.loading && bookings.length > 0) ? (
                        <Pagination
                            count={states.totalPages}
                            page={states.currentPage}
                            onChange={handleChange}
                            sx={{ marginTop: '30px' }}
                        />
                    ) : null}
                </Box>
            </Box>
            {app.hasOpenedSearchBoxPrompt ? (
                <Search
                    paginate={(page: number, totalItem: number, totalPages: number) => setStates(prev => ({
                        ...prev,
                        currentPage: page,
                        totalCount: totalItem,
                        totalPages: totalPages
                    }))}
                />
            ) : app.hasOpenedBookingFilterPrompt ? (
                <FilterBookings
                    paginate={(page: number, totalItem: number, totalPages: number) => setStates(prev => ({
                        ...prev,
                        currentPage: page,
                        totalCount: totalItem,
                        totalPages: totalPages
                    }))}
                />
            ) : null}
        </Box>
    )
}
export default BookingListPage