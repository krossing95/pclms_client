'use client'

import { NoteAddOutlined, ReplayOutlined, SearchRounded } from '@mui/icons-material'
import { Box, IconButton, Pagination, TableContainer, Table, Tooltip } from '@mui/material'
import * as React from 'react'
import { motion } from 'framer-motion'
import { CreateBlockedDay, Search, Head, Data, EmptyList, SuspenseLoader, Update, Remove, Title } from './exports'
import styles from './styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { SaveAppData } from '@/redux/app/slice.app'
import { toast } from 'react-toastify'
import get_dates from '@/app/actions/days/day.get_dates'
import { FetchDays } from '@/redux/days_management/slice.days_management'
import search_days from '@/app/actions/days/day.search_dates'

interface DaysManagementStates {
    loading: boolean
    shouldGoTop: boolean
    currentPage: number
    totalCount: number
    totalPages: number
}

const DaysManagementPage = () => {
    const app = useAppSelector(state => state.appReducer.app)
    const [states, setStates] = React.useState<DaysManagementStates>({
        currentPage: 1, totalPages: 0, totalCount: 0,
        shouldGoTop: false, loading: true
    })
    const blockedDays = useAppSelector(state => state.daysReducer.blocked_days)
    const dispatch = useAppDispatch()
    const refreshHandler = async () => {
        try {
            setStates(prev => ({ ...prev, currentPage: 1, loading: true }))
            dispatch(SaveAppData({
                ...app,
                isDaysSearchResultDisplayed: false,
                daySearchQuery: ""
            }))
            await loadData(1, true)
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    const loadData = async (page: number, refreshAction: boolean) => {
        try {
            setStates(prev => ({ ...prev, loading: true }))
            const days = (app.isDaysSearchResultDisplayed &&
                app.daySearchQuery.length > 0 &&
                !refreshAction) ? await search_days({ page: states.currentPage, keyword: app.daySearchQuery }) :
                await get_dates({ page })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(days.data?.code) !== 200) return toast('Something went wrong')
            const data = days.data?.data
            setStates(prev => ({
                ...prev,
                shouldGoTop: false,
                currentPage: data?.page_data?.currentPage,
                totalCount: data?.page_data?.totalCount,
                totalPages: data?.page_data?.totalPages
            }))
            dispatch(SaveAppData({ ...app, isDaysSearchResultDisplayed: data?.data_type === 'search' ? true : false }))
            return dispatch(FetchDays([...data?.blocked_days]))
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    React.useEffect(() => {
        const toRefresh = (app.isDaysSearchResultDisplayed && app.daySearchQuery.length > 0)
        loadData(states.currentPage, toRefresh ? false : true) //eslint-disable-next-line
    }, [states.currentPage])
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setStates(prev => ({ ...prev, currentPage: value, loading: prev.currentPage !== value ? true : false }))
    }
    return (
        <Box component='div' sx={{ mt: '50px' }}>
            <Box component='div' className={styles.header}>
                <Title text='Blocked Days' variant_switch={false} />
                <Box component='div' className={styles.toolbar}>
                    <Tooltip title='Create new blocked day'>
                        <IconButton onClick={() => dispatch(SaveAppData({ ...app, hasOpenedCreateDayPrompt: true }))}>
                            <NoteAddOutlined />
                        </IconButton>
                    </Tooltip>
                    {(!states.loading && blockedDays.length > 0) ? (
                        <Tooltip title='Search blocked days'>
                            <IconButton onClick={app.isDaysSearchResultDisplayed ? refreshHandler : () => dispatch(SaveAppData({ ...app, hasOpenedSearchBoxPrompt: true }))}>
                                {app.isDaysSearchResultDisplayed ? (
                                    <ReplayOutlined />
                                ) : (
                                    <SearchRounded />
                                )}
                            </IconButton>
                        </Tooltip>
                    ) : null}
                </Box>
            </Box>
            <Box component='div'>
                {!states.loading ? (
                    <React.Fragment>
                        {blockedDays.length === 0 ? (
                            <EmptyList />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{
                                    opacity: 1, transition: { duration: 1 }
                                }}
                            >
                                <TableContainer component='div'>
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
                        text='Loading Blocked Days'
                        ignoreOptionalHeight
                    />
                )}
                <Box component='div' className={styles.loadmoreContainer} sx={{ mt: 4 }}>
                    {(!states.loading && blockedDays.length > 0) ? (
                        <Pagination
                            count={states.totalPages}
                            page={states.currentPage}
                            onChange={handleChange}
                            sx={{ marginTop: '30px' }}
                        />
                    ) : null}
                </Box>
            </Box>
            {app.hasOpenedCreateDayPrompt ? (
                <CreateBlockedDay
                    paginate={(page: number, totalItem: number, totalPages: number) => setStates(prev => ({
                        ...prev,
                        shouldGoTop: false,
                        currentPage: page,
                        totalCount: totalItem,
                        totalPages: totalPages
                    }))}
                />
            ) : app.hasOpenedSearchBoxPrompt ? (
                <Search
                    paginate={(page: number, totalItem: number, totalPages: number) => setStates(prev => ({
                        ...prev,
                        shouldGoTop: false,
                        currentPage: page,
                        totalCount: totalItem,
                        totalPages: totalPages
                    }))}
                />
            ) : app.hasOpenedEditDayPrompt ? (
                <Update />
            ) : app.hasOpenedDeleteDayPrompt ? (
                <Remove
                    paginate={(page: number, totalItem: number, totalPages: number) => setStates(prev => ({
                        ...prev,
                        shouldGoTop: false,
                        currentPage: page,
                        totalCount: totalItem,
                        totalPages: totalPages
                    }))}
                />
            ) : null}
        </Box >
    )
}
export default DaysManagementPage