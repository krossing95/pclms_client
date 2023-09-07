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

export type EquipmentPageStates = {
    loading: boolean
    search_mode: boolean
    refreshing: boolean
    reloadingData: boolean
    shouldGoTop: boolean
    currentPage: number
    totalCount: number
    totalPages: number
}

const Equipment = () => {
    const dispatch = useAppDispatch()
    const app = useAppSelector(state => state.appReducer.equipment)
    const equipment = useAppSelector(state => state.equipmentReducer.equipment)
    const [states, setStates] = React.useState<EquipmentPageStates>({
        currentPage: 1, totalPages: 0, totalCount: 0,
        shouldGoTop: false, loading: true,
        search_mode: false, refreshing: false, reloadingData: false,
    })
    React.useEffect(() => {
        const initStates = () => dispatch(SaveEquipmentPageState({
            hasOpenedCreateEquipmentPrompt: false,
            hasOpenedSearchBoxPrompt: false,
            isWillingToShowReloadBtn: false,
            isSearchResultDisplayed: false,
            hasOpenedEquipmentFilter: false
        }))
        initStates() //eslint-disable-next-line
    }, [])
    React.useEffect(() => {
        const getEquipment = async () => {
            try {
                const equipment = await get_equipment({ page: states.currentPage })
                setStates(prev => ({ ...prev, loading: false }))
                if (parseInt(equipment.data?.code) !== 200) return toast(equipment.data?.message)
                if (states.shouldGoTop) window.scrollTo(0, 0)
                const data = equipment.data?.data
                setStates(prev => ({
                    ...prev,
                    reloadingData: false,
                    search_mode: false,
                    shouldGoTop: false,
                    refreshing: false,
                    currentPage: data?.page_data?.currentPage,
                    totalCount: data?.page_data?.totalCount,
                    totalPages: data?.page_data?.totalPages
                }))
                dispatch(FetchEquipment([...data?.equipment]))
                return dispatch(SaveEquipmentPageState({ ...app, isSearchResultDisplayed: false, isWillingToShowReloadBtn: false }))
            } catch (error) {
                return toast('Something went wrong')
            }
        }
        getEquipment() //eslint-disable-next-line
    }, [states.currentPage])
    const searchEnvBuilder = () => {
        setStates(prev => ({ ...prev, search_mode: true }))
        return dispatch(SaveEquipmentPageState({ ...app, hasOpenedSearchBoxPrompt: true }))
    }
    const refreshHandler = () => setStates(prev => ({ ...prev, currentPage: 1, refreshing: true }))
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setStates(prev => ({ ...prev, page: value }))
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
                            <IconButton onClick={() => dispatch(SaveEquipmentPageState({ ...app, hasOpenedEquipmentFilter: true }))}>
                                <SortOutlined />
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

                    {/* {(app.isWillingToShowReloadBtn && !app.isSearchResultDisplayed) ? (
                        <Button onClick={() => setStates(prev => ({ ...prev, shouldGoTop: true, reloadingData: true, limit: Math.round(prev?.limit + 20) }))} sx={{ p: 2 }} variant='contained'>
                            {states.reloadingData ? (
                                <CircularProgress color='inherit' size={20} />
                            ) : 'reload data'}
                        </Button>
                    ) : null} */}
                </Box>
            </Box>
            {app.hasOpenedCreateEquipmentPrompt ? (
                <Create
                    trigger_loading={(page: number, totalItem: number, totalPages: number) => setStates(prev => ({
                        ...prev,
                        reloadingData: false,
                        search_mode: false,
                        shouldGoTop: false,
                        refreshing: false,
                        currentPage: page,
                        totalCount: totalItem,
                        totalPages: totalPages
                    }))}
                />
            ) : app.hasOpenedSearchBoxPrompt ? (
                <Search />
            ) : null}
            {/* {app.equipment_search ? (
                <Search />
            ) : null} */}
            {/* {app.equipment_filter ? (
                <Filter />
            ) : null} */}
        </Box>
    )
}
export default Equipment