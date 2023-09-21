import * as React from 'react'
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import { CancelOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@mui/icons-material'
import styles from '../../../styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { SaveEquipmentPageState } from '@/redux/app/slice.app'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import MessageBox from '@/app/utils/components/MessageBox'
import InputField from '@/app/components/Input'
import useValidations from '@/app/hooks/useValidations'
import StringMethods from '@/helpers/helper.string_methods'
import post_comment from '@/app/actions/equipment/equipment.post_comment'
import { FetchComments } from '@/redux/equipment/comments/slice.comments'

interface CommentStates {
    message: string
    open: boolean
    isErrorFree: boolean
    fullscreen: boolean
    loading: boolean
    id: string
    name: string
    comment: string
}

const Comment = () => {
    const app = useAppSelector(state => state.appReducer.equipment)
    const equipment = useAppSelector(state => state.equipmentReducer.equipment)?.[0]
    const dispatch = useAppDispatch()
    const validations = useValidations()
    const stringMethods = StringMethods()
    const [states, setStates] = React.useState<CommentStates>({
        message: '',
        open: false,
        isErrorFree: false,
        fullscreen: false,
        loading: false,
        id: equipment.id,
        name: equipment.name,
        comment: ''
    })
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveEquipmentPageState({ ...app, hasOpenedEquipmentComment: false }))
    }
    const submitHandler = async () => {
        const params = {
            data: {
                equipment_id: equipment.id,
                comment: stringMethods.textProcessor(states.comment)
            },
            next: () => setStates(prev => ({ ...prev, loading: true }))
        }
        setStates(prev => ({ ...prev, message: '', open: false, isErrorFree: false }))
        const validate = validations.validateComment({ ...params })
        if (validate !== undefined) return setStates(prev => ({ ...prev, message: validate.error, open: true, isErrorFree: false }))
        try {
            const post = await post_comment({ ...params.data })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(post.data?.code) !== 201) return setStates(prev => ({ ...prev, message: post.data?.message, open: true, isErrorFree: false }))
            const data = post.data?.data
            dispatch(FetchComments([...data?.comments]))
            return setStates(prev => ({ ...prev, message: post.data?.message, open: true, isErrorFree: true }))
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
        }
    }
    return (
        <Dialog fullScreen={states.fullscreen} open={app.hasOpenedEquipmentComment} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <Box component='div' className={styles.header}>
                <DialogTitle className='text' style={{ cursor: 'move' }} id="draggable-dialog-title">Write a comment</DialogTitle>
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
                <Typography variant='body2'>Please note that the comment you create on this equipment is immediately published</Typography>
                <Grid container spacing={1}>
                    <Grid item xs={12} className={styles.input_container}>
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
                    ) : 'post'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default Comment