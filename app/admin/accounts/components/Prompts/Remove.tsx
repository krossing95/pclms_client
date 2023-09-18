import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material'
import * as React from 'react'
import styles from '../../styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { SaveUsersPageState } from '@/redux/app/slice.app'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import MessageBox from '@/app/utils/components/MessageBox'
import InputField from '@/app/components/Input'
import { FetchUsers } from '@/redux/user_management/slice.user_management'
import remove_user from '@/app/actions/users/user.remove_user'

interface UserDeleteStates {
    name: string
    open: boolean
    message: string
    isErrorFree: boolean
    loading: boolean
}

interface UserDeleteProps {
    paginate: (page: number, totalItem: number, totalPages: number) => void
}

const Remove: React.FC<UserDeleteProps> = ({ paginate }) => {
    const app = useAppSelector(state => state.appReducer.users)
    const user = useAppSelector(state => state.usersReducer.users).filter(user => user.id === app.selectedUserId)?.[0]
    const dispatch = useAppDispatch()
    const confirmStatement: string = `sudo delete ${user.lastname.trim().toLowerCase()}`
    const [states, setStates] = React.useState<UserDeleteStates>({ name: '', open: false, message: '', isErrorFree: false, loading: false })
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveUsersPageState({ ...app, hasOpenedDeleteUserPrompt: false, selectedUserId: undefined }))
    }
    const removeHandler = async () => {
        if (confirmStatement !== states.name.trim().toLowerCase()) return false
        setStates(prev => ({ ...prev, loading: true, name: '' }))
        try {
            const remove = await remove_user({ id: user.id })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(remove.data?.code) !== 200) return setStates(prev => ({ ...prev, message: remove.data?.message, open: true, isErrorFree: false }))
            const collection = remove.data?.data
            dispatch(FetchUsers([...collection?.users]))
            const page_data = collection?.page_data
            dispatch(SaveUsersPageState({
                ...app,
                isUserSearchResultDisplayed: false,
                hasOpenedDeleteUserPrompt: false
            }))
            paginate(page_data?.currentPage, page_data?.totalCount, page_data?.totalPages)
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
        }
    }
    return (
        <Dialog open={app.hasOpenedDeleteUserPrompt} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <DialogTitle className={styles.text} style={{ cursor: 'move' }} id="draggable-dialog-title">Remove User</DialogTitle>
            <MessageBox
                open={states.open}
                message={states.message}
                isErrorFree={states.isErrorFree}
            />
            <DialogContent>
                <Typography gutterBottom variant='body2'>{"Are you sure you want to remove this user?"}</Typography>
                <Typography gutterBottom variant='body2'>{'To confirm the action, enter '}<strong style={{ color: '#026FBD' }}>{`sudo delete ${user.lastname.toLowerCase()}`}</strong></Typography>
                <Grid container spacing={1}>
                    <Grid item xs={12} className={styles.input_container}>
                        <InputField
                            value={states.name} type='text'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, name: (e.target as HTMLInputElement).value }))}
                            classes={styles.input}
                            disabled={states.loading}
                            placeholder=''
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button className={styles.dashedBoaderBtn} autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                <Button disabled={confirmStatement === states.name.trim().toLowerCase() ? false : true} className={styles.dashedBoaderBtn} onClick={removeHandler}>
                    {states.loading ? (
                        <CircularProgress color='inherit' size={15} />
                    ) : 'remove'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default Remove