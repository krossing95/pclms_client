'use client'

import * as React from 'react'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'
import styles from '../../styles.module.css'
import moment from 'moment'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Regex } from '@/app/utils/statics'
import { SaveAppData } from '@/redux/app/slice.app'
import MessageBox from '@/app/utils/components/MessageBox'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import InputField from '@/app/components/Input'
import update_day from '@/app/actions/days/day.update_day'
import { UpdateDay } from '@/redux/days_management/slice.days_management'

interface DaysManagementStates {
    date: string
    name: string
    message: string
    open: boolean
    isErrorFree: boolean
    loading: boolean
}

const Update = () => {
    const app = useAppSelector(state => state.appReducer.app)
    const blockedDays = useAppSelector(state => state.daysReducer.blocked_days).filter(item => item.id === app.selectedDayId)?.[0]
    const dispatch = useAppDispatch()
    const { CSVDOT_HYPHEN } = Regex
    const datePickerRef = React.useRef<HTMLInputElement>(null)


    const validate = (dateString: string) => {
        const day = (new Date(dateString)).getDay()
        if (day === 0 || day === 6) {
            return false
        }
        return true
    }
    // React.useEffect(() => {
    //     const checkDateSelection = () => {
    //         datePickerRef.current?.querySelector('input[date]')?.addEventListener('change', function (evt) {
    //             if (!validate((evt.target as HTMLInputElement).value)) {
    //                 // setStates(prev => ({...prev, date: ''}))
    //                 // evt.target.value = ''
    //             }
    //         })
    //     }
    //     checkDateSelection()
    // }, [])

    const [states, setStates] = React.useState<DaysManagementStates>({ date: blockedDays?.date?.split('T', 2)?.[0] || '', name: blockedDays?.name || '', message: '', open: false, isErrorFree: false, loading: false })
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveAppData({ ...app, hasOpenedEditDayPrompt: false, selectedDayId: undefined }))
    }
    const submitHandler = async () => {
        try {
            setStates(prev => ({ ...prev, open: false, message: '', isErrorFree: false }))
            if (!states.name.match(CSVDOT_HYPHEN) || states.name.length === 0) return setStates(prev => ({ ...prev, message: 'Entity rule violated', open: true, isErrorFree: false }))
            if (!moment(states.date).isValid()) return setStates(prev => ({ ...prev, message: 'Invalid date chosen', open: true, isErrorFree: false }))
            if (moment(states.date).isBefore(moment(new Date()))) return setStates(prev => ({ ...prev, message: 'Cannot block a past date', open: true, isErrorFree: false }))
            setStates(prev => ({ ...prev, loading: true }))
            const update = await update_day({
                name: states.name, date: states.date, id: app.selectedDayId
            })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(update.data?.code) !== 200) return setStates(prev => ({ ...prev, message: update.data?.message, open: true, isErrorFree: false }))
            dispatch(UpdateDay({ ...update.data.data }))
            return setStates(prev => ({ ...prev, message: update.data.message, open: true, isErrorFree: true }))
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
        }
    }
    const handleDateSelection = (date: string) => {
        if (moment(date).isBefore(moment(new Date()))) return setStates(prev => ({ ...prev, message: 'Cannot select a past date', open: true, isErrorFree: false, date: '' }))
        setStates(prev => ({ ...prev, date }))
    }
    return (
        <Dialog open={app.hasOpenedEditDayPrompt} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <DialogTitle className='text' style={{ cursor: 'move', textAlign: 'center' }} id="draggable-dialog-title">Update blocked day</DialogTitle>
            <MessageBox open={states.open}
                isErrorFree={states.isErrorFree}
                message={states.message}
            />
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid item xs={12} className={styles.input_container}>
                        <InputField
                            value={states.name} type='text'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, name: (e.target as HTMLInputElement).value }))}
                            classes={styles.input}
                            disabled={states.loading}
                            placeholder='Enter title of blocked day'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputField
                            value={states.date} type='date'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => handleDateSelection((e.target as HTMLInputElement).value)}
                            classes={styles.input}
                            disabled={states.loading}
                            placeholder='Choose date to block'
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button className={styles.dashedBoaderBtn} autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                <Button disabled={states.loading} className={styles.dashedBoaderBtn} onClick={submitHandler}>
                    {states.loading ? (
                        <CircularProgress color='inherit' size={15} />
                    ) : 'update'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default Update