'use client'

import { Box, Pagination, IconButton } from '@mui/material'
import * as React from 'react'
import styles from '@/app/admin/equipment/styles.module.css'
import { ReplayOutlined, SearchRounded, SortOutlined } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { SaveFavoritesPageState } from '@/redux/app/slice.app'
import { FetchEquipment } from '@/redux/equipment/slice.equipment'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import get_favorites from '@/app/actions/favorites/favorite.get'
import { EmptyList, EquipmentKeyRepresentation, FavoriteList, Search, SuspenseLoader, Title } from './exports'
import search_favorites from '@/app/actions/favorites/favorite.search'
import filter_favorites from '@/app/actions/favorites/favorite.filter'

export type FavoriteListPageStates = {
    loading: boolean
    shouldGoTop: boolean
    currentPage: number
    totalCount: number
    totalPages: number
}

const FavoriteListPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const app = useAppSelector(state => state.appReducer.favorites)
    const equipment = useAppSelector(state => state.equipmentReducer.equipment)
    const [states, setStates] = React.useState<FavoriteListPageStates>({
        currentPage: 1, totalPages: 0, totalCount: 0,
        shouldGoTop: false, loading: true
    })
    React.useEffect(() => {
        const initStates = () => dispatch(SaveFavoritesPageState({
            hasOpenedSearchBoxPrompt: false,
            isFilteredResultDispayed: false,
            isSearchResultDisplayed: false,
            hasOpenedFavoritesFilter: false
        }))
        initStates() //eslint-disable-next-line
    }, [])
    const getFavoriteList = async (page: number, refreshAction: boolean) => {
        try {
            const equipment = (app.isSearchResultDisplayed &&
                app.favoriteSearchQuery.length > 0 &&
                !refreshAction) ?
                await search_favorites({ page: states.currentPage, keyword: app.favoriteSearchQuery }) :
                (app.isFilteredResultDispayed &&
                    Object.keys(app.favoriteFilters).length === 2 &&
                    !refreshAction) ?
                    await filter_favorites({ page: states.currentPage, functionality_status: app.favoriteFilters?.functionality_status, availability_status: app.favoriteFilters?.availability_status }) :
                    await get_favorites({ page })
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
            return dispatch(SaveFavoritesPageState({
                ...app,
                isSearchResultDisplayed: data?.data_type === 'search' ? true : false,
                isFilteredResultDispayed: data?.data_type === 'filter' ? true : false
            }))
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    React.useEffect(() => {
        const toRefresh = (app.isSearchResultDisplayed && app.favoriteSearchQuery.length > 0) ||
            (app.isFilteredResultDispayed && Object.keys(app.favoriteFilters).length === 2)
        getFavoriteList(states.currentPage, toRefresh ? false : true) //eslint-disable-next-line
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
        return dispatch(SaveFavoritesPageState({ ...app, hasOpenedSearchBoxPrompt: true }))
    }
    const refreshHandler = async () => {
        try {
            const existingQuery = new URLSearchParams(Array.from(searchParams.entries()))
            existingQuery.delete('q')
            router.replace(pathname, { shallow: true })
            setStates(prev => ({ ...prev, currentPage: 1, loading: true }))
            dispatch(SaveFavoritesPageState({
                ...app,
                isSearchResultDisplayed: false,
                isFilteredResultDispayed: false,
                favoriteSearchQuery: "",
                favoriteFilters: {}
            }))
            await getFavoriteList(1, true)
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
                <Title text='Favorite list' variant_switch={false} />
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
                            <IconButton onClick={app.isFilteredResultDispayed ? refreshHandler : () => dispatch(SaveFavoritesPageState({ ...app, hasOpenedFavoritesFilter: true }))}>
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
                    <SuspenseLoader text='Loading Favorites' ignoreOptionalHeight />
                ) : (
                    <React.Fragment>
                        {equipment.length === 0 ? (
                            <EmptyList />
                        ) : (
                            <React.Fragment>
                                <EquipmentKeyRepresentation />
                                <FavoriteList />
                            </React.Fragment>
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
            ) : null}
            {/* app.hasOpenedFavoritesFilter ? (
                <Filter
                    paginate={(page: number, totalItem: number, totalPages: number) => setStates(prev => ({
                        ...prev,
                        shouldGoTop: false,
                        currentPage: page,
                        totalCount: totalItem,
                        totalPages: totalPages
                    }))}
                />
            ) : null} */}
        </Box>
    )
}
export default FavoriteListPage