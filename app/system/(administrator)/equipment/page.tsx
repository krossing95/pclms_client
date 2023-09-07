'use client'

import { Box, Button, CircularProgress, Pagination, IconButton, Typography } from '@mui/material'
import * as React from 'react'
import styles from './styles.module.css'
import { NoteAddOutlined, ReplayOutlined, SearchRounded, SortOutlined } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { SaveEquipmentPageState } from '@/redux/app/slice.app'
import Title from '@/app/utils/components/Title'
import SuspenseLoader from '@/app/components/Loader'
import get_equipment from '@/app/actions/equipment/equipment.get'
import { FetchEquipment } from '@/redux/equipment/slice.equipment'
import EmptyList from '@/app/utils/components/EmptyList'
import Create from './components/Prompts/Create'
import EquipmentList from './components/List'
import Search from './components/Prompts/Search'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Filter from './components/Prompts/Filter'

export type EquipmentPageStates = {
    loading: boolean
    refreshing: boolean
    shouldGoTop: boolean
    currentPage: number
    totalCount: number
    totalPages: number
}

const Equipment = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const app = useAppSelector(state => state.appReducer.equipment)
    const equipment = useAppSelector(state => state.equipmentReducer.equipment)
    const [states, setStates] = React.useState<EquipmentPageStates>({
        currentPage: 1, totalPages: 0, totalCount: 0,
        shouldGoTop: false, loading: true,
        refreshing: false
    })
    React.useEffect(() => {
        const initStates = () => dispatch(SaveEquipmentPageState({
            hasOpenedCreateEquipmentPrompt: false,
            hasOpenedSearchBoxPrompt: false,
            isFilteredResultDispayed: false,
            isSearchResultDisplayed: false,
            hasOpenedEquipmentFilter: false
        }))
        initStates() //eslint-disable-next-line
    }, [])
    const getEquipment = async (page: number) => {
        try {
            const equipment = await get_equipment({ page })
            if (parseInt(equipment.data?.code) !== 200) return toast(equipment.data?.message)
            setStates(prev => ({ ...prev, loading: false }))
            if (states.shouldGoTop) window.scrollTo(0, 0)
            const data = equipment.data?.data
            setStates(prev => ({
                ...prev,
                shouldGoTop: false,
                refreshing: false,
                currentPage: data?.page_data?.currentPage,
                totalCount: data?.page_data?.totalCount,
                totalPages: data?.page_data?.totalPages
            }))
            dispatch(FetchEquipment([...data?.equipment]))
            return dispatch(SaveEquipmentPageState({ ...app, isSearchResultDisplayed: false, isFilteredResultDispayed: false }))
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    React.useEffect(() => {
        getEquipment(states.currentPage) //eslint-disable-next-line
    }, [states.currentPage])
    React.useEffect(() => {
        const setPageUrl = () => {
            if (app.hasOpenedSearchBoxPrompt || app.isSearchResultDisplayed) return false
            const existingQuery = new URLSearchParams(Array.from(searchParams.entries()))
            existingQuery.delete('q')
            router.replace(pathname, { shallow: true })
        }
        setPageUrl() //eslint-disable-next-line
    }, [app.hasOpenedSearchBoxPrompt, app.isSearchResultDisplayed])
    const searchEnvBuilder = () => {
        return dispatch(SaveEquipmentPageState({ ...app, hasOpenedSearchBoxPrompt: true }))
    }
    const refreshHandler = async () => {
        try {
            const existingQuery = new URLSearchParams(Array.from(searchParams.entries()))
            existingQuery.delete('q')
            router.replace(pathname, { shallow: true })
            setStates(prev => ({ ...prev, currentPage: 1, refreshing: true }))
            await getEquipment(1)
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setStates(prev => ({ ...prev, currentPage: value }))
    }
    return (
        <Box component='div'>
            <Box component='div' className={styles.header}>
                <Title text='Equipment' variant_switch={false} />
                <Box component='div' className={styles.toolbar}>
                    <IconButton onClick={() => dispatch(SaveEquipmentPageState({ ...app, hasOpenedCreateEquipmentPrompt: true }))}>
                        <NoteAddOutlined />
                    </IconButton>
                    {(equipment.length > 0 && !states.loading) ? (
                        <React.Fragment>
                            <IconButton onClick={app.isSearchResultDisplayed ? refreshHandler : searchEnvBuilder}>
                                {app.isSearchResultDisplayed ? (
                                    <React.Fragment>
                                        {states.refreshing ? (
                                            <CircularProgress color='inherit' size={20} />
                                        ) : (
                                            <ReplayOutlined />
                                        )}
                                    </React.Fragment>
                                ) : (
                                    <SearchRounded />
                                )}
                            </IconButton>
                            <IconButton onClick={app.isFilteredResultDispayed ? refreshHandler : () => dispatch(SaveEquipmentPageState({ ...app, hasOpenedEquipmentFilter: true }))}>
                                {app.isFilteredResultDispayed ? (
                                    <React.Fragment>
                                        {states.refreshing ? (
                                            <CircularProgress color='inherit' size={18} />
                                        ) : (
                                            <ReplayOutlined />
                                        )}
                                    </React.Fragment>
                                ) : (
                                    <SortOutlined />
                                )}
                            </IconButton>
                        </React.Fragment>
                    ) : null}
                </Box>
            </Box>
            <Box component='div'>
                {states.loading ? (
                    <SuspenseLoader text='Loading equipment' issueOptionalHeight />
                ) : (
                    <React.Fragment>
                        {equipment.length === 0 ? (
                            <EmptyList />
                        ) : (
                            <EquipmentList />
                        )}
                    </React.Fragment>
                )}
                <Box component='div' className={styles.loadmoreContainer} sx={{ mt: 4 }}>
                    {!states.loading ? (
                        <Pagination
                            count={states.totalPages}
                            page={states.currentPage}
                            onChange={handleChange}
                            sx={{ marginTop: '30px' }}
                        />
                    ) : null}
                </Box>
            </Box>
            {app.hasOpenedCreateEquipmentPrompt ? (
                <Create
                    paginate={(page: number, totalItem: number, totalPages: number) => setStates(prev => ({
                        ...prev,
                        shouldGoTop: false,
                        refreshing: false,
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
                        refreshing: false,
                        currentPage: page,
                        totalCount: totalItem,
                        totalPages: totalPages
                    }))}
                />
            ) : app.hasOpenedEquipmentFilter ? (
                <Filter
                    paginate={(page: number, totalItem: number, totalPages: number) => setStates(prev => ({
                        ...prev,
                        shouldGoTop: false,
                        refreshing: false,
                        currentPage: page,
                        totalCount: totalItem,
                        totalPages: totalPages
                    }))}
                />
            ) : null}
        </Box>
    )
}
export default Equipment