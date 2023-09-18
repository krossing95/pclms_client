'use client'

import { ReplayOutlined, SearchRounded } from '@mui/icons-material'
import { Box, IconButton, Pagination, TableContainer, Table, Tooltip } from '@mui/material'
import * as React from 'react'
import { motion } from 'framer-motion'
import { EmptyList, SuspenseLoader, Title, Head, Data, Search, Update, Remove } from './exports'
import styles from './styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { toast } from 'react-toastify'
import { SaveUsersPageState } from '@/redux/app/slice.app'
import { FetchUsers } from '@/redux/user_management/slice.user_management'
import get_users from '@/app/actions/users/user.get_users'
import search_users from '@/app/actions/users/user.search_users'


interface UserManagementStates {
    loading: boolean
    shouldGoTop: boolean
    currentPage: number
    totalCount: number
    totalPages: number
}

const UsersManagementPage = () => {
    const app = useAppSelector(state => state.appReducer.users)
    const [states, setStates] = React.useState<UserManagementStates>({
        currentPage: 1, totalPages: 0, totalCount: 0,
        shouldGoTop: false, loading: true
    })
    const users = useAppSelector(state => state.usersReducer.users)
    const dispatch = useAppDispatch()
    const loadUserData = async (page: number, refreshAction: boolean) => {
        try {
            setStates(prev => ({ ...prev, loading: true }))
            const days = (app.isUserSearchResultDisplayed &&
                app.userSearchQuery.length > 0 &&
                !refreshAction) ? await search_users({ page: states.currentPage, keyword: app.userSearchQuery }) :
                await get_users({ page })
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
            dispatch(SaveUsersPageState({ ...app, isUserSearchResultDisplayed: data?.data_type === 'search' ? true : false }))
            return dispatch(FetchUsers([...data?.users]))
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    const refreshHandler = async () => {
        try {
            setStates(prev => ({ ...prev, currentPage: 1, loading: true }))
            dispatch(SaveUsersPageState({
                ...app,
                isUserSearchResultDisplayed: false,
                userSearchQuery: ""
            }))
            await loadUserData(1, true)
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    React.useEffect(() => {
        const toRefresh = (app.isUserSearchResultDisplayed && app.userSearchQuery.length > 0)
        loadUserData(states.currentPage, toRefresh ? false : true) //eslint-disable-next-line
    }, [states.currentPage])
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setStates(prev => ({ ...prev, currentPage: value, loading: prev.currentPage !== value ? true : false }))
    }
    return (
        <Box component='div' sx={{ mt: '50px' }}>
            <Box component='div' className={styles.header}>
                <Title text='User Management' variant_switch={false} />
                <Box component='div' className={styles.toolbar}>
                    {(!states.loading && users.length > 0) ? (
                        <Tooltip title='Search blocked days'>
                            <IconButton onClick={app.isUserSearchResultDisplayed ? refreshHandler : () => dispatch(SaveUsersPageState({ ...app, hasOpenedSearchBoxPrompt: true }))}>
                                {app.isUserSearchResultDisplayed ? (
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
                        {users.length === 0 ? (
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
                        text='Loading Users'
                        issueOptionalHeight
                    />
                )}
                <Box component='div' className={styles.loadmoreContainer} sx={{ mt: 4 }}>
                    {(!states.loading && users.length > 0) ? (
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
                        shouldGoTop: false,
                        currentPage: page,
                        totalCount: totalItem,
                        totalPages: totalPages
                    }))}
                />
            ) : app.hasOpenedEditUserPrompt ? (
                <Update />
            ) : app.hasOpenedDeleteUserPrompt ? (
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
        </Box>
    )
}
export default UsersManagementPage