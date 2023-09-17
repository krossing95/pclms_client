'use client'

import * as React from 'react'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'
import styles from '../../styles.module.css'
import moment from 'moment'
import MessageBox from '@/app/utils/components/MessageBox'
import { SaveAppData } from '@/redux/app/slice.app'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Regex } from '@/app/utils/statics'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import InputField from '@/app/components/Input'
import save_date from '@/app/actions/days/day.save_date'
import { FetchDays } from '@/redux/days_management/slice.days_management'

type BlockDaysStates = {
    open: boolean
    isErrorFree: boolean
    loading: boolean
    message: string
    date: string
    name: string
}

interface CreateDayProps {
    paginate: (page: number, totalItem: number, totalPages: number) => void
}

const CreateBlockedDay: React.FC<CreateDayProps> = ({ paginate }) => {
    const [states, setStates] = React.useState<BlockDaysStates>({ date: '', name: '', message: '', open: false, isErrorFree: false, loading: false })
    const dispatch = useAppDispatch()
    const app = useAppSelector(state => state.appReducer.app)
    const blockedDays = useAppSelector(state => state.daysReducer.blocked_days)
    const { CSVDOT_HYPHEN } = Regex
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveAppData({ ...app, hasOpenedCreateDayPrompt: false }))
    }
    const submitHandler = async () => {
        try {
            setStates(prev => ({ ...prev, open: false, message: '', isErrorFree: false }))
            if (!states.name.match(CSVDOT_HYPHEN) || states.name.length === 0) return setStates(prev => ({ ...prev, message: 'Entity rule violated', open: true, isErrorFree: false }))
            if (!moment(states.date).isValid()) return setStates(prev => ({ ...prev, message: 'Invalid date chosen', open: true, isErrorFree: false }))
            setStates(prev => ({ ...prev, loading: true }))
            const save = await save_date({ name: states.name, date: states.date })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(save.data?.code) !== 201) return setStates(prev => ({ ...prev, message: save.data?.message, open: true, isErrorFree: false }))
            const collection = save.data?.data
            dispatch(FetchDays([...collection?.blocked_days]))
            dispatch(SaveAppData({ ...app, isDaysSearchResultDisplayed: false }))
            const page_data = collection?.page_data
            paginate(page_data?.currentPage, page_data?.totalCount, page_data?.totalPages)
            return setStates(prev => ({ ...prev, message: save.data?.message, open: true, isErrorFree: true, name: '', date: '' }))
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong!', open: true, isErrorFree: false }))
        }
    }
    const handleDateSelection = (date: string) => {
        if (moment(date).isBefore(moment(new Date()))) return setStates(prev => ({ ...prev, message: 'Cannot select a past date', open: true, isErrorFree: false, date: '' }))
        setStates(prev => ({ ...prev, date }))
    }

    return (
        <Dialog open={app.hasOpenedCreateDayPrompt} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <DialogTitle className='text' style={{ cursor: 'move', textAlign: 'center' }} id="draggable-dialog-title">Create blocked day</DialogTitle>
            <MessageBox open={states.open} isErrorFree={states.isErrorFree} message={states.message} />
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
                    ) : 'create'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default CreateBlockedDay