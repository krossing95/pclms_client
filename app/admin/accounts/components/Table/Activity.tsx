import { DeleteSweepOutlined, ModeEditOutlineOutlined } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import * as React from 'react'
import styles from '../../styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { SaveUsersPageState } from '@/redux/app/slice.app'
import Cookies from 'js-cookie'

interface ActivityProps {
    id: string
}

export default function Activity({ id }: ActivityProps) {
    const dispatch = useAppDispatch()
    const app = useAppSelector(state => state.appReducer.users)
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const disabled = id === cookie?.user_id
    return (
        <React.Fragment>
            <IconButton disabled={disabled} onClick={() => dispatch(SaveUsersPageState({ ...app, selectedUserId: id, hasOpenedDeleteDayPrompt: true }))} className={styles.activity_remove}>
                <DeleteSweepOutlined fontSize='small' />
            </IconButton>
            <IconButton disabled={disabled} onClick={() => dispatch(SaveUsersPageState({ ...app, selectedUserId: id, hasOpenedEditDayPrompt: true }))} className={styles.activity_edit}>
                <ModeEditOutlineOutlined fontSize='small' />
            </IconButton>
        </React.Fragment>
    )
}