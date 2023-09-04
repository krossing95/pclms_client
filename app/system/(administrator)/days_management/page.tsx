'use client'

import { NoteAddOutlined, ReplayOutlined, SearchRounded } from '@mui/icons-material'
import { Box, CircularProgress, IconButton, TableContainer, Table, Tooltip } from '@mui/material'
import * as React from 'react'
import { motion } from 'framer-motion'
import Title from '@/app/utils/components/Title'
import styles from './styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { SaveAppData } from '@/redux/app/slice.app'
import { toast } from 'react-toastify'
import EmptyList from '@/app/utils/components/EmptyList'
import Head from './components/Table/Head'
import Data from './components/Table/Data'
import CreateBlockedDay from './components/Prompts/Create'
import get_dates from '@/app/actions/days/day.get_dates'
import { FetchDays } from '@/redux/days_management/slice.days_management'
import SuspenseLoader from '@/app/components/Loader'
import Search from './components/Prompts/Search'
import Update from './components/Prompts/Update'
import Remove from './components/Prompts/Remove'

interface DaysManagementStates {
    refreshing: boolean
    loading: boolean
    limit: number
}

const DaysManagementPage = () => {
    const app = useAppSelector(state => state.appReducer.app)
    const [states, setStates] = React.useState<DaysManagementStates>({ loading: true, refreshing: false, limit: 50 })
    const blockedDays = useAppSelector(state => state.daysReducer.blocked_days)
    const dispatch = useAppDispatch()
    const refreshHandler = async () => {
        try {
            setStates(prev => ({ ...prev, refreshing: true }))
            const days = await get_dates({ limit: states.limit })
            setStates(prev => ({ ...prev, refreshing: false }))
            if (parseInt(days.data?.code) !== 200) return toast('Something went wrong')
            dispatch(SaveAppData({ ...app, isDaysSearchResultDisplayed: false }))
            return dispatch(FetchDays([...days.data?.data?.blocked_days]))
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    const loadData = async () => {
        try {
            setStates(prev => ({ ...prev, refreshing: false, loading: true }))
            const days = await get_dates({ limit: states.limit })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(days.data?.code) !== 200) return toast('Something went wrong')
            dispatch(SaveAppData({ ...app, isDaysSearchResultDisplayed: false }))
            return dispatch(FetchDays([...days.data?.data?.blocked_days]))
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    React.useEffect(() => {
        loadData() // eslint-disable-next-line
    }, [])
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
                    {!states.loading ? (
                        <Tooltip title='Search blocked days'>
                            <IconButton onClick={app?.isDaysSearchResultDisplayed ? refreshHandler : () => dispatch(SaveAppData({ ...app, hasOpenedSearchBoxPrompt: true }))}>
                                {app?.isDaysSearchResultDisplayed ? (
                                    <React.Fragment>
                                        {states.refreshing ? (
                                            <CircularProgress color='inherit' size={22} />
                                        ) : (
                                            <ReplayOutlined />
                                        )}
                                    </React.Fragment>
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
                        issueOptionalHeight
                    />
                )}
            </Box>
            {app.hasOpenedCreateDayPrompt ? (
                <CreateBlockedDay />
            ) : app.hasOpenedSearchBoxPrompt ? (
                <Search />
            ) : app.hasOpenedEditDayPrompt ? (
                <Update />
            ) : app.hasOpenedDeleteDayPrompt ? (
                <Remove />
            ) : null}
        </Box >
    )
}
export default DaysManagementPage