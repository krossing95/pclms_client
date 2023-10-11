'use client'

import { Box, Pagination, IconButton } from '@mui/material'
import * as React from 'react'
import styles from '@/app/admin/equipment/styles.module.css'
import { DeleteForeverOutlined, NoteAddOutlined, ReplayOutlined, SearchRounded, SortOutlined } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { SaveEquipmentPageState } from '@/redux/app/slice.app'
import { FetchEquipment } from '@/redux/equipment/slice.equipment'
import useCustomMethods from '@/app/hooks/useCustomMethods'
import Title from '@/app/utils/components/Title'
import SuspenseLoader from '@/app/components/Loader'
import get_hidden_equipment from '@/app/actions/recycle_bin/bin.get_equipment'
import EmptyList from '@/app/utils/components/EmptyList'
import search_hidden_equipment from '@/app/actions/recycle_bin/bin.search_equipment'
import Search from './components/Prompts/Search'
import List from './components/List'
import ClearHiddenEquipmentPermanently from './components/Prompts/ClearHiddenEquipmentPermanently'
import RetrieveHiddenEquipment from './components/Prompts/RetrieveHiddenEquipment'
import Remove from './components/Prompts/RemoveHiddenEquipment'

export type EquipmentInRecycleBinPageStates = {
    loading: boolean
    shouldGoTop: boolean
    currentPage: number
    totalCount: number
    totalPages: number
}

const EquipmentInRecycleBin = () => {
    const dispatch = useAppDispatch()
    const useMethods = useCustomMethods()
    const app = useAppSelector(state => state.appReducer.equipment)
    const equipment = useAppSelector(state => state.equipmentReducer.equipment)
    const [states, setStates] = React.useState<EquipmentInRecycleBinPageStates>({
        currentPage: 1, totalPages: 0, totalCount: 0,
        shouldGoTop: false, loading: true
    })
    React.useEffect(() => {
        const initStates = () => dispatch(SaveEquipmentPageState({
            hasOpenedCreateEquipmentPrompt: false,
            hasOpenedSearchBoxPrompt: false,
            isSearchResultDisplayed: false
        }))
        initStates() //eslint-disable-next-line
    }, [])
    const getEquipment = async (page: number, refreshAction: boolean) => {
        try {
            const equipment = (app.isSearchResultDisplayed &&
                app.equipmentSearchQuery.length > 0 &&
                !refreshAction) ?
                await search_hidden_equipment({ page: states.currentPage, keyword: app.equipmentSearchQuery }) :
                await get_hidden_equipment({ page })
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
        const toRefresh = (app.isSearchResultDisplayed && app.equipmentSearchQuery.length > 0)
        getEquipment(states.currentPage, toRefresh ? false : true) //eslint-disable-next-line
    }, [states.currentPage])
    React.useEffect(() => {
        const setPageUrl = () => {
            if (app.hasOpenedSearchBoxPrompt || app.isSearchResultDisplayed) return false
            useMethods.removeQueryParameter('q')
        }
        setPageUrl() //eslint-disable-next-line
    }, [app.hasOpenedSearchBoxPrompt, app.isSearchResultDisplayed])
    const searchEnvBuilder = () => {
        return dispatch(SaveEquipmentPageState({ ...app, hasOpenedSearchBoxPrompt: true }))
    }
    const refreshHandler = async () => {
        try {
            useMethods.removeQueryParameter('q')
            setStates(prev => ({ ...prev, currentPage: 1, loading: true }))
            dispatch(SaveEquipmentPageState({
                ...app,
                isSearchResultDisplayed: false,
                isFilteredResultDispayed: false,
                equipmentSearchQuery: "",
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
                <Title text='Hidden equipment' variant_switch={false} />
                <Box component='div' className={styles.toolbar}>
                    {(equipment.length > 0 && !states.loading) ? (
                        <React.Fragment>
                            <IconButton onClick={app.isSearchResultDisplayed ? refreshHandler : searchEnvBuilder}>
                                {app.isSearchResultDisplayed ? (
                                    <ReplayOutlined />
                                ) : (
                                    <SearchRounded />
                                )}
                            </IconButton>
                            <IconButton onClick={() => dispatch(SaveEquipmentPageState({ ...app, hasOpenedPermanentDeletePrompt: true }))}>
                                <DeleteForeverOutlined />
                            </IconButton>
                        </React.Fragment>
                    ) : null}
                </Box>
            </Box>
            <Box component='div'>
                {states.loading ? (
                    <SuspenseLoader text='Loading items' ignoreOptionalHeight />
                ) : (
                    <React.Fragment>
                        {equipment.length === 0 ? (
                            <EmptyList />
                        ) : (
                            <List />
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
            ) : app.hasOpenedPermanentDeletePrompt ? (
                <ClearHiddenEquipmentPermanently />
            ) : app.hasOpenedRetrieveHiddenEquipmentPrompt ? (
                <RetrieveHiddenEquipment
                    paginate={(page: number, totalItem: number, totalPages: number) => setStates(prev => ({
                        ...prev,
                        shouldGoTop: false,
                        currentPage: page,
                        totalCount: totalItem,
                        totalPages: totalPages
                    }))}
                />
            ) : app.hasOpenedDeleteEquipmentPrompt ? (
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
export default EquipmentInRecycleBin