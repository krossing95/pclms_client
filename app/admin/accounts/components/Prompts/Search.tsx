'use client'

import * as React from 'react'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import MessageBox from '@/app/utils/components/MessageBox'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { SaveUsersPageState } from '@/redux/app/slice.app'
import styles from '../../styles.module.css'
import InputField from '@/app/components/Input'
import StringMethods from '@/helpers/helper.string_methods'
import { toast } from 'react-toastify'
import { FetchUsers } from '@/redux/user_management/slice.user_management'
import search_users from '@/app/actions/users/user.search_users'

interface SearchUserStates {
    open: boolean
    isErrorFree: boolean
    loading: boolean
    message: string
    keyword: string
}

interface SearchUserProps {
    paginate: (page: number, totalItem: number, totalPages: number) => void
}

const Search: React.FC<SearchUserProps> = ({ paginate }) => {
    const app = useAppSelector(state => state.appReducer.users)
    const dispatch = useAppDispatch()
    const { textProcessor } = StringMethods()
    const [states, setStates] = React.useState<SearchUserStates>({ keyword: '', open: false, message: '', isErrorFree: false, loading: false })
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveUsersPageState({ ...app, hasOpenedSearchBoxPrompt: false }))
    }
    const searchHandler = async () => {
        setStates(prev => ({ ...prev, open: false, message: '', isErrorFree: false }))
        const word = textProcessor(states.keyword)?.trim()
        if (word.length === 0) return setStates(prev => ({ ...prev, keyword: '' }))
        setStates(prev => ({ ...prev, loading: true }))
        try {
            const result = await search_users({ page: 1, keyword: word })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(result.data?.code) !== 200) return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
            const collection = result.data?.data
            if (collection?.blocked_days?.length === 0) return setStates(prev => ({ ...prev, message: 'No matching records found', open: true, isErrorFree: false }))
            dispatch(FetchUsers([...collection?.users]))
            const page_data = collection?.page_data
            dispatch(SaveUsersPageState({
                ...app,
                isUserSearchResultDisplayed: true,
                hasOpenedSearchBoxPrompt: false,
                userSearchQuery: page_data?.totalPages > 1 ? word : ''
            }))
            paginate(page_data?.currentPage, page_data?.totalCount, page_data?.totalPages)
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    return (
        <Dialog open={app.hasOpenedSearchBoxPrompt} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <DialogTitle className={styles.text} style={{ cursor: 'move' }} id="draggable-dialog-title">Search users</DialogTitle>
            <MessageBox
                open={states.open}
                isErrorFree={false}
                message={states.message}
            />
            <DialogContent>
                <Typography variant='body2'>Enter a keyword in the search box below to look for related users.</Typography>
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