import MessageBox from '@/app/utils/components/MessageBox'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import { SaveEquipmentPageState } from '@/redux/app/slice.app'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import * as React from 'react'
import styles from '../../../styles.module.css'
import remove_comment from '@/app/actions/equipment/equipment.remove_comment'
import { FetchComments } from '@/redux/equipment/comments/slice.comments'

interface CommentDeleteStates {
    message: string
    open: boolean
    isErrorFree: boolean
    loading: boolean
}

interface CommentDeleteProps {
    paginate: (page: number, totalItem: number, totalPages: number) => void
}

const CommentDelete: React.FC<CommentDeleteProps> = ({ paginate }) => {
    const dispatch = useAppDispatch()
    const app = useAppSelector(state => state.appReducer.equipment)
    const [states, setStates] = React.useState<CommentDeleteStates>({
        message: '',
        open: false,
        isErrorFree: false,
        loading: false
    })
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveEquipmentPageState({ ...app, hasOpenedCommentDeletePrompt: false, selectedCommentId: undefined }))
    }
    const removeHandler = async () => {
        try {
            setStates(prev => ({ ...prev, loading: true, message: '', open: false, isErrorFree: false }))
            const remove = await remove_comment({ id: app.selectedCommentId })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(remove.data?.code) !== 200) return setStates(prev => ({ ...prev, message: remove.data?.message, open: true, isErrorFree: false }))
            const collection = remove.data?.data
            dispatch(FetchComments([...collection?.comments]))
            const page_data = collection?.page_data
            dispatch(SaveEquipmentPageState({
                ...app,
                hasOpenedCommentDeletePrompt: false
            }))
            paginate(page_data?.currentPage, page_data?.totalCount, page_data?.totalPages)
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong', open: false, isErrorFree: false }))
        }
    }
    return (
        <Dialog open={app.hasOpenedCommentDeletePrompt} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <DialogTitle className={styles.text} style={{ cursor: 'move' }} id="draggable-dialog-title">Remove Comment</DialogTitle>
            <MessageBox
                open={states.open}
                isErrorFree={states.isErrorFree}
                message={states.message}
            />
            <DialogContent>
                <Typography gutterBottom variant='body2'>Are you sure to delete the targetted comment? Note that, this is an irreversible action.</Typography>
            </DialogContent>
            <DialogActions>
                <Button className={styles.dashedBoaderBtn} autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                <Button disabled={states.loading} className={styles.dashedBoaderBtn} onClick={removeHandler}>
                    {states.loading ? (
                        <CircularProgress color='inherit' size={15} />
                    ) : 'remove'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default CommentDelete