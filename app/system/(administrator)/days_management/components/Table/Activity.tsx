import { DeleteSweepOutlined, ModeEditOutlineOutlined } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import * as React from 'react'
import styles from '../../styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { SaveAppData } from '@/redux/app/slice.app'

interface ActivityProps {
    id: string
}

export default function Activity({ id }: ActivityProps) {
    const dispatch = useAppDispatch()
    const app = useAppSelector(state => state.appReducer.app)
    return (
        <React.Fragment>
            <IconButton onClick={() => dispatch(SaveAppData({ ...app, selectedDayId: id, hasOpenedDeleteDayPrompt: true }))} className={styles.activity_remove}>
                <DeleteSweepOutlined fontSize='small' />
            </IconButton>
            <IconButton onClick={() => dispatch(SaveAppData({ ...app, selectedDayId: id, hasOpenedEditDayPrompt: true }))} className={styles.activity_edit}>
                <ModeEditOutlineOutlined fontSize='small' />
            </IconButton>
        </React.Fragment>
    )
}