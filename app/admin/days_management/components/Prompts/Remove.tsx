import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import * as React from 'react'
import styles from '../../styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { SaveAppData } from '@/redux/app/slice.app'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import { FetchDays } from '@/redux/days_management/slice.days_management'
import remove_day from '@/app/actions/days/day.remove_day'
import MessageBox from '@/app/utils/components/MessageBox'

interface RemoveDayStates {
    open: boolean
    message: string
    isErrorFree: boolean
    loading: boolean
}

interface RemoveDayProps {
    paginate: (page: number, totalItem: number, totalPages: number) => void
}

const Remove: React.FC<RemoveDayProps> = () => {
    const app = useAppSelector(state => state.appReducer.app)
    const blockedDays = useAppSelector(state => state.daysReducer.blocked_days)
    const dispatch = useAppDispatch()
    const [states, setStates] = React.useState<RemoveDayStates>({ open: false, message: '', isErrorFree: false, loading: false })
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveAppData({ ...app, hasOpenedDeleteDayPrompt: false, selectedDayId: undefined }))
    }
    const removeHandler = async () => {
        try {
            setStates(prev => ({ ...prev, loading: true, message: '', open: false, isErrorFree: false }))
            const remove = await remove_day({ id: app.selectedDayId })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(remove.data?.code) !== 200) return setStates(prev => ({ ...prev, message: remove.data?.message, open: true, isErrorFree: false }))
            const collection = remove.data?.data
            dispatch(FetchDays([...collection?.blocked_days]))
            return handleClose()
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
        }
    }
    return (
        <Dialog open={app.hasOpenedDeleteDayPrompt} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <DialogTitle className={styles.text} style={{ cursor: 'move' }} id="draggable-dialog-title">Remove blocked day</DialogTitle>
            <MessageBox
                open={states.open}
                message={states.message}
                isErrorFree={states.isErrorFree}
            />
            <DialogContent>
                <Typography variant='body2'>The targetted blocked day will be permanently removed</Typography>
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
export default Remove