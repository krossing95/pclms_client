import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, RadioGroup, Typography } from '@mui/material'
import * as React from 'react'
import styles from '../styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Functionality_Status, Availability_Status } from '@/app/utils/statics'
import { SaveFavoritesPageState } from '@/redux/app/slice.app'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import MessageBox from '@/app/utils/components/MessageBox'
import FunctionalitySelector from '@/app/utils/components/Selectors/FunctionalityStatus'
import AvailabilitySelector from '@/app/utils/components/Selectors/AvailabilityStatus'
import { toast } from 'react-toastify'
import { FetchEquipment } from '@/redux/equipment/slice.equipment'
import filter_favorites from '@/app/actions/favorites/favorite.filter'

interface FavoriteListFilterStates {
    message: string
    functionality_status: number | string
    availability_status: number | string
    open: boolean
    isErrorFree: boolean
    loading: boolean
}

interface FavoriteListFilterProps {
    paginate: (page: number, totalItem: number, totalPages: number) => void
}

const Filter: React.FC<FavoriteListFilterProps> = ({ paginate }) => {
    const app = useAppSelector(state => state.appReducer.favorites)
    const dispatch = useAppDispatch()
    const [states, setStates] = React.useState<FavoriteListFilterStates>({
        loading: false, message: '', functionality_status: '',
        availability_status: '', open: false, isErrorFree: false
    })
    React.useEffect(() => {
        const selectAlgorithm = () => {
            if (Number(states.functionality_status) === 1) return setStates(prev => ({ ...prev, availability_status: Number(states.functionality_status) }))
            setStates(prev => ({ ...prev, availability_status: Number(states.availability_status) }))
        }
        selectAlgorithm() //eslint-disable-next-line
    }, [states.functionality_status, states.availability_status, setStates])
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveFavoritesPageState({ ...app, hasOpenedFavoritesFilter: false }))
    }
    const filterHandler = async () => {
        try {
            setStates(prev => ({ ...prev, message: '', open: false, isErrorFree: false }))
            if (!Functionality_Status.some(e => e.value === Number(states.functionality_status)) && !Availability_Status.some(e => e.value === Number(states.availability_status))) return setStates(prev => ({ ...prev, message: 'Filter is required', open: true, isErrorFree: false }))
            setStates(prev => ({ ...prev, loading: true }))
            const { functionality_status, availability_status } = states
            const f_status = Number(functionality_status) === 2 ? true : Number(functionality_status) === 1 ? false : null
            const a_status = Number(availability_status) === 2 ? true : Number(availability_status) === 1 ? false : null
            const results = await filter_favorites({ page: 1, functionality_status: f_status, availability_status: a_status })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(results.data?.code) !== 200) return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
            const collection = results.data?.data
            if (collection?.equipment?.length === 0) return setStates(prev => ({ ...prev, message: 'No matching records found', open: true, isErrorFree: false }))
            dispatch(FetchEquipment([...collection?.equipment]))
            const page_data = collection?.page_data
            dispatch(SaveFavoritesPageState({
                ...app,
                isFilteredResultDispayed: true,
                isSearchResultDisplayed: false,
                hasOpenedFavoritesFilter: false,
                favoriteFilters: page_data?.totalPages > 1 ? {
                    functionality_status: f_status,
                    availability_status: a_status
                } : {}
            }))
            paginate(page_data?.currentPage, page_data?.totalCount, page_data?.totalPages)
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    return (
        <Dialog open={app.hasOpenedFavoritesFilter} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <DialogTitle className={styles.text} style={{ cursor: 'move' }} id="draggable-dialog-title">{"Filter"}</DialogTitle>
            <MessageBox
                open={states.open}
                message={states.message}
                isErrorFree={states.isErrorFree}
            />
            <DialogContent>
                <Typography variant='body2'>{"Create a filter below to get most related equipment"}</Typography>
                <Grid container spacing={1}>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <label className='text' htmlFor='func_status'>{"Functionality Status"}</label>
                        <RadioGroup
                            value={states.functionality_status}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStates(prev => ({ ...prev, functionality_status: (e.target as HTMLInputElement).value }))}
                            aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group" row>
                            {<FunctionalitySelector />}
                        </RadioGroup>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <label className='text' htmlFor='avail_status'>{"Availability Status"}</label>
                        <RadioGroup
                            value={states.availability_status}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStates(prev => ({ ...prev, availability_status: (e.target as HTMLInputElement).value }))}
                            aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group" row>
                            {<AvailabilitySelector />}
                        </RadioGroup>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button className={styles.dashedBoaderBtn} autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                <Button disabled={states.loading} className={styles.dashedBoaderBtn} onClick={filterHandler}>
                    {states.loading ? (
                        <CircularProgress color='inherit' size={15} />
                    ) : 'filter'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default Filter