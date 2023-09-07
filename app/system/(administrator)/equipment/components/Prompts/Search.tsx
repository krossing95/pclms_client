import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material'
import * as React from 'react'
import styles from '../../styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import StringMethods from '@/helpers/helper.string_methods'
import { SaveEquipmentPageState } from '@/redux/app/slice.app'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import MessageBox from '@/app/utils/components/MessageBox'
import InputField from '@/app/components/Input'
import search_equipment from '@/app/actions/equipment/equipment.search'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface EquipmentSearchStates {
    keyword: string
    open: boolean
    message: string
    isErrorFree: boolean
    loading: boolean
}

const Search = () => {
    const app = useAppSelector(state => state.appReducer.equipment)
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const dispatch = useAppDispatch()
    const { textProcessor } = StringMethods()
    const [states, setStates] = React.useState<EquipmentSearchStates>({
        keyword: '',
        open: false,
        message: '',
        isErrorFree: false,
        loading: false
    })
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveEquipmentPageState({ ...app, hasOpenedSearchBoxPrompt: false }))
    }
    const handleTyping = (str: string) => {
        const existingQuery = new URLSearchParams(Array.from(searchParams.entries()))
        if (!textProcessor(str).length) return existingQuery.delete('q')
        existingQuery.set('q', str)
        setStates(prev => ({ ...prev, keyword: str }))
        const search = existingQuery.toString()
        const query = search ? `?${search}` : ""
        router.push(`${pathname}${query}`)
    }
    const searchHandler = async () => {
        setStates(prev => ({ ...prev, open: false, message: '', isErrorFree: false }))
        const word = textProcessor(states.keyword).trim()
        if (word.length === 0) return setStates(prev => ({ ...prev, keyword: '' }))
        setStates(prev => ({ ...prev, loading: true }))
        try {
            const result = await search_equipment({ page: 1, keyword: word })
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
        }
        // 
        // setStates(prev => ({ ...prev, loading: false, keyword: '' }))
        // if (result.status !== 200 || !Array.isArray(result.data)) return setStates(prev => ({ ...prev, message: 'Whoops! Something went wrong', open: true, isErrorFree: false }))
        // if (result.data.length === 0) return setStates(prev => ({ ...prev, message: 'No matching records found', open: true, isErrorFree: false }))
        // dispatch(FetchEquipment(result.data))
        // dispatch(SetAppState({ ...app, equipment_search: false, equipment_resultDisplayed: true }))
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