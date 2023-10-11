'use client'

import { ReplayOutlined, SearchRounded, SortOutlined } from '@mui/icons-material'
import { Box, IconButton, Pagination, TableContainer, Table, Tooltip } from '@mui/material'
import * as React from 'react'
import { motion } from 'framer-motion'
import styles from '@/app/user/bookings/styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { toast } from 'react-toastify'
import { SaveBookingsPageState } from '@/redux/app/slice.app'
import { FetchBookings } from '@/redux/bookings/slice.bookings'
import { EmptyList, SuspenseLoader, Title } from '@/app/user/bookings/exports'
import BookingKeyRepresentation from '@/app/user/bookings/components/Key'
import get_hidden_bookings from '@/app/actions/recycle_bin/bin.get_bookings'
import search_hidden_bookings from '@/app/actions/recycle_bin/bin.search_bookings'
import Search from './components/Prompts/Search'
import Head from '../../bookings/components/Table/Head'
import Data from './components/Table/Data'
import RemoveHiddenBooking from './components/Prompts/Remove'

interface HiddenBookingListStates {
    loading: boolean
    currentPage: number
    totalCount: number
    totalPages: number
}

const BookingListPage = () => {
    const app = useAppSelector(state => state.appReducer.bookings)
    const [states, setStates] = React.useState<HiddenBookingListStates>({
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
                bookingSearchQuery: "",
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
                !refreshAction) ? await search_hidden_bookings({ page: states.currentPage, keyword: app.bookingSearchQuery }) :
                await get_hidden_bookings({ page })
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
                isBookingSearchResultDisplayed: data?.data_type === 'search' ? true : false
            }))
            return dispatch(FetchBookings([...data?.bookings]))
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    React.useEffect(() => {
        const toRefresh = (app.isBookingSearchResultDisplayed && app.bookingSearchQuery.length > 0)
        loadData(states.currentPage, toRefresh ? false : true) //eslint-disable-next-line
    }, [states.currentPage])
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setStates(prev => ({ ...prev, currentPage: value, loading: prev.currentPage !== value ? true : false }))
    }
    return (
        <Box component='div' sx={{ mt: '50px' }}>
            <Box component='div' className={styles.header}>
                <Title text='Hidden bookings' variant_switch={false} />
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
            ) : app.hasOpenedBookingCancelPrompt ? (
                <RemoveHiddenBooking
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