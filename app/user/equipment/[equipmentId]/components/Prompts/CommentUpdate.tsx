import * as React from 'react'
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import { CancelOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import StringMethods from '@/helpers/helper.string_methods'
import { SaveEquipmentPageState } from '@/redux/app/slice.app'
import useValidations from '@/app/hooks/useValidations'
import update_comment from '@/app/actions/equipment/equipment.update_comment'
import styles from '../../../styles.module.css'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import MessageBox from '@/app/utils/components/MessageBox'
import InputField from '@/app/components/Input'
import { UpdateComment } from '@/redux/equipment/comments/slice.comments'

interface CommentUpdateStates {
    message: string
    open: boolean
    isErrorFree: boolean
    fullscreen: boolean
    loading: boolean
    name: string
    comment: string
}

const CommentUpdate = () => {
    const app = useAppSelector(state => state.appReducer.equipment)
    const comment = useAppSelector(state => state.commentsReducer.comments).filter(comment => comment.id === app.selectedCommentId)?.[0]
    const [states, setStates] = React.useState<CommentUpdateStates>({
        message: '',
        open: false,
        isErrorFree: false,
        fullscreen: false,
        loading: false,
        name: comment.equipment_name,
        comment: comment.comment || ''
    })
    const dispatch = useAppDispatch()
    const useStringMethods = StringMethods()
    const validations = useValidations()
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveEquipmentPageState({ ...app, hasOpenedCommentEditPrompt: false, selectedCommentId: undefined }))
    }
    const submitHandler = async () => {
        const params = {
            data: {
                id: comment.id,
                equipment_id: comment.equipment_id,
                comment: useStringMethods.textProcessor(states.comment)
            },
            next: () => setStates(prev => ({ ...prev, loading: true }))
        }
        setStates(prev => ({ ...prev, message: '', open: false, isErrorFree: false }))
        const validate = validations.validateComment({ ...params })
        if (validate !== undefined) return setStates(prev => ({ ...prev, message: validate.error, open: true, isErrorFree: false }))
        try {
            const update = await update_comment({ ...params.data })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(update.data?.code) !== 200) return setStates(prev => ({ ...prev, message: update.data?.message, open: true, isErrorFree: false }))
            const data = update.data?.data
            dispatch(UpdateComment({ ...data }))
            return setStates(prev => ({ ...prev, message: update.data?.message, open: true, isErrorFree: true }))
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
        }
    }
    return (
        <Dialog fullScreen={states.fullscreen} open={app.hasOpenedCommentEditPrompt} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <Box component='div' className={styles.header}>
                <DialogTitle className='text' style={{ cursor: 'move' }} id="draggable-dialog-title">Comment update</DialogTitle>
                <Box component='div' className={styles.toolbar}>
                    <IconButton onClick={() => setStates(prev => ({ ...prev, fullscreen: !prev.fullscreen }))}>
                        {states.fullscreen ? (
                            <FullscreenExitOutlined />
                        ) : (
                            <FullscreenOutlined />
                        )}
                    </IconButton>
                    <IconButton onClick={handleClose}>
                        <CancelOutlined />
                    </IconButton>
                </Box>
            </Box>
            <MessageBox
                open={states.open}
                isErrorFree={states.isErrorFree}
                message={states.message}
            />
            <DialogContent>
                <Typography variant='body2'>Please note that the current comment is immediately published once updated</Typography>
                <Grid container spacing={1}>
                    <Grid item xs={12} className={styles.input_container} >
                        <InputField
                            value={states.name} type='text'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, name: (e.target as HTMLInputElement).value }))}
                            classes={styles.input}
                            disabled={states.loading}
                            placeholder='Enter name of equipment'
                            readOnly
                        />
                    </Grid>
                    <Grid item xs={12} className={styles.input_container}>
                        <textarea
                            style={{ fontSize: '15px' }}
                            rows={states.fullscreen ? 15 : 10} value={states.comment}
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, comment: (e.target as HTMLInputElement).value }))}
                            placeholder='Please enter your comment here...'
                            className={styles.input}>
                        </textarea>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button disabled={states.loading} className={styles.dashedBoaderBtn} onClick={submitHandler}>
                    {states.loading ? (
                        <CircularProgress color='inherit' size={15} />
                    ) : 'update'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default CommentUpdate