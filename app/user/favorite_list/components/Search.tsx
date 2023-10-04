import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material'
import * as React from 'react'
import styles from '../styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import StringMethods from '@/helpers/helper.string_methods'
import { SaveFavoritesPageState } from '@/redux/app/slice.app'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import MessageBox from '@/app/utils/components/MessageBox'
import InputField from '@/app/components/Input'
import { FetchEquipment } from '@/redux/equipment/slice.equipment'
import useCustomMethods from '@/app/hooks/useCustomMethods'
import search_favorites from '@/app/actions/favorites/favorite.search'

interface FavoriteSearchStates {
    keyword: string
    open: boolean
    message: string
    isErrorFree: boolean
    loading: boolean
}

interface FavoriteSearchProps {
    paginate: (page: number, totalItem: number, totalPages: number) => void
}

const Search: React.FC<FavoriteSearchProps> = ({ paginate }) => {
    const app = useAppSelector(state => state.appReducer.favorites)
    const dispatch = useAppDispatch()
    const { textProcessor } = StringMethods()
    const useMethods = useCustomMethods()
    const [states, setStates] = React.useState<FavoriteSearchStates>({
        keyword: '',
        open: false,
        message: '',
        isErrorFree: false,
        loading: false
    })
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveFavoritesPageState({ ...app, hasOpenedSearchBoxPrompt: false }))
    }
    const searchHandler = async () => {
        setStates(prev => ({ ...prev, open: false, message: '', isErrorFree: false }))
        const word = textProcessor(states.keyword).trim()
        if (word.length === 0) return setStates(prev => ({ ...prev, keyword: '' }))
        useMethods.appendQueryParameter(word, 'q')
        setStates(prev => ({ ...prev, loading: true }))
        try {
            const result = await search_favorites({ page: 1, keyword: word })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(result.data?.code) !== 200) return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
            const collection = result.data?.data
            if (collection?.equipment?.length === 0) return setStates(prev => ({ ...prev, message: 'No matching records found', open: true, isErrorFree: false }))
            dispatch(FetchEquipment([...collection?.equipment]))
            const page_data = collection?.page_data
            dispatch(SaveFavoritesPageState({
                ...app,
                isSearchResultDisplayed: true,
                isFilteredResultDispayed: false,
                hasOpenedSearchBoxPrompt: false,
                favoriteSearchQuery: page_data?.totalPages > 1 ? word : ''
            }))
            paginate(page_data?.currentPage, page_data?.totalCount, page_data?.totalPages)
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
        }
    }
    return (
        <Dialog open={app.hasOpenedSearchBoxPrompt} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <DialogTitle className={styles.text} style={{ cursor: 'move' }} id="draggable-dialog-title">Search equipment</DialogTitle>
            <MessageBox
                open={states.open}
                isErrorFree={states.isErrorFree}
                message={states.message}
            />
            <DialogContent>
                <Typography variant='body2'>Enter a keyword in the search box below to search for related equipment</Typography>
                <Grid container spacing={1}>
                    <Grid item xs={12} className={styles.input_container}>
                        <InputField
                            value={states.keyword} type='text'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, keyword: (e.target as HTMLInputElement).value }))}
                            classes={styles.input}
                            disabled={states.loading}
                            placeholder='Enter your keyword...'
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button className={styles.dashedBoaderBtn} autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                <Button disabled={states.loading} className={styles.dashedBoaderBtn} onClick={searchHandler}>
                    {states.loading ? (
                        <CircularProgress color='inherit' size={15} />
                    ) : 'search'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default Search