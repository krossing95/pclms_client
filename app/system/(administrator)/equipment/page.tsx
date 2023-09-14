'use client'

import { Box, Pagination, IconButton } from '@mui/material'
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
import search_equipment from '@/app/actions/equipment/equipment.search'
import filter_equipment from '@/app/actions/equipment/equipment.filter'

export type EquipmentPageStates = {
    loading: boolean
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
        shouldGoTop: false, loading: true
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
    const getEquipment = async (page: number, refreshAction: boolean) => {
        try {
            const equipment = (app.isSearchResultDisplayed &&
                app.equipmentSearchQuery.length > 0 &&
                !refreshAction) ?
                await search_equipment({ page: states.currentPage, keyword: app.equipmentSearchQuery }) :
                (app.isFilteredResultDispayed &&
                    Object.keys(app.equipmentFilters).length === 2 &&
                    !refreshAction) ?
                    await filter_equipment({ page: states.currentPage, functionality_status: app.equipmentFilters?.functionality_status, availability_status: app.equipmentFilters?.availability_status }) :
                    await get_equipment({ page })
            if (parseInt(equipment.data?.code) !== 200) return toast(equipment.data?.message)
            setStates(prev => ({ ...prev, loading: false }))
            if (states.shouldGoTop) window.scrollTo(0, 0)
            const data = equipment.data?.data
            setStates(prev => ({
                ...prev,
                shouldGoTop: false,
                currentPage: data?.page_data?.currentPage,
                totalCount: data?.page_data?.totalCount,
                totalPages: data?.page_data?.totalPages
            }))
            dispatch(FetchEquipment([...data?.equipment]))
            return dispatch(SaveEquipmentPageState({
                ...app,
                isSearchResultDisplayed: data?.data_type === 'search' ? true : false,
                isFilteredResultDispayed: data?.data_type === 'filter' ? true : false
            }))
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    React.useEffect(() => {
        const toRefresh = (app.isSearchResultDisplayed && app.equipmentSearchQuery.length > 0) ||
            (app.isFilteredResultDispayed && Object.keys(app.equipmentFilters).length === 2)
        getEquipment(states.currentPage, toRefresh ? false : true) //eslint-disable-next-line
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
            setStates(prev => ({ ...prev, currentPage: 1, loading: true }))
            dispatch(SaveEquipmentPageState({
                ...app,
                isSearchResultDisplayed: false,
                isFilteredResultDispayed: false,
                equipmentSearchQuery: "",
                equipmentFilters: {}
            }))
            await getEquipment(1, true)
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setStates(prev => ({ ...prev, currentPage: value, loading: prev.currentPage !== value ? true : false }))
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
                                    <ReplayOutlined />
                                ) : (
                                    <SearchRounded />
                                )}
                            </IconButton>
                            <IconButton onClick={app.isFilteredResultDispayed ? refreshHandler : () => dispatch(SaveEquipmentPageState({ ...app, hasOpenedEquipmentFilter: true }))}>
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
                    {(!states.loading && equipment.length > 0) ? (
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
            ) : app.hasOpenedEquipmentFilter ? (
                <Filter
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
export default Equipment