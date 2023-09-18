'use client'

import * as React from 'react'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, RadioGroup } from '@mui/material'
import styles from '../../styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import MessageBox from '@/app/utils/components/MessageBox'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import InputField from '@/app/components/Input'
import { SaveUsersPageState } from '@/redux/app/slice.app'
import UserStatusSelector from '@/app/utils/components/Selectors/UserStatus'
import useValidations from '@/app/hooks/useValidations'
import { UpdateUser } from '@/redux/user_management/slice.user_management'
import update_user from '@/app/actions/users/user.update_user'

interface UserManagementStates {
    firstname: string
    lastname: string
    email: string
    phone: string
    usertype: string | number
    message: string
    open: boolean
    isErrorFree: boolean
    loading: boolean
}

const Update = () => {
    const { validateUserUpdate } = useValidations()
    const app = useAppSelector(state => state.appReducer.users)
    const user = useAppSelector(state => state.usersReducer.users).filter(item => item.id === app.selectedUserId)?.[0]
    const dispatch = useAppDispatch()

    const [states, setStates] = React.useState<UserManagementStates>({
        message: '', open: false, isErrorFree: false, loading: false,
        firstname: user.firstname || '', lastname: user.lastname || '',
        email: user.email || '', phone: user.phone || '', usertype: user.usertype || ''
    })
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveUsersPageState({ ...app, hasOpenedEditUserPrompt: false, selectedUserId: undefined }))
    }
    const submitHandler = async () => {
        const params = {
            data: {
                firstname: states.firstname,
                lastname: states.lastname,
                email: states.email,
                phone: states.phone,
                user_status: Number(states.usertype)
            },
            next: () => setStates(prev => ({ ...prev, loading: true }))
        }
        setStates(prev => ({ ...prev, open: false, message: '', isErrorFree: false }))
        const validate = validateUserUpdate({ ...params })
        if (validate !== undefined) return setStates(prev => ({ ...prev, message: validate?.error, open: true, isErrorFree: false }))
        setStates(prev => ({ ...prev, loading: true }))
        try {
            const update = await update_user({
                id: app.selectedUserId,
                firstname: states.firstname,
                lastname: states.lastname,
                email: states.email,
                phone: states.phone,
                usertype: params.data.user_status
            })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(update.data?.code) !== 200) return setStates(prev => ({ ...prev, message: update.data?.message, open: true, isErrorFree: false }))
            dispatch(UpdateUser({ ...update.data.data }))
            return setStates(prev => ({ ...prev, message: update.data.message, open: true, isErrorFree: true }))
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
        }
    }
    return (
        <Dialog open={app.hasOpenedEditUserPrompt} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <DialogTitle className='text' style={{ cursor: 'move', textAlign: 'center' }} id="draggable-dialog-title">Update user</DialogTitle>
            <MessageBox open={states.open}
                isErrorFree={states.isErrorFree}
                message={states.message}
            />
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid item xs={12} className={styles.input_container}>
                        <InputField
                            value={states.firstname} type='text'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, firstname: (e.target as HTMLInputElement).value }))}
                            classes={styles.input}
                            disabled={states.loading}
                            placeholder='Enter your firstname'
                        />
                    </Grid>
                    <Grid item xs={12} className={styles.input_container}>
                        <InputField
                            value={states.lastname} type='text'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, lastname: (e.target as HTMLInputElement).value }))}
                            classes={styles.input}
                            disabled={states.loading}
                            placeholder='Enter your lastname'
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} className={styles.input_container}>
                        <InputField
                            value={states.email} type='email'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, email: (e.target as HTMLInputElement).value }))}
                            classes={styles.input}
                            disabled={states.loading}
                            placeholder='Enter your email address'
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} className={styles.input_container}>
                        <InputField
                            value={states.phone} type='text'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, phone: (e.target as HTMLInputElement).value }))}
                            classes={styles.input}
                            disabled={states.loading}
                            placeholder='Enter your phone number'
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <label className='text' htmlFor='user_role'>User Role</label>
                        <RadioGroup
                            value={states.usertype}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStates(prev => ({ ...prev, usertype: (e.target as HTMLInputElement).value }))}
                            aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group" row>
                            {<UserStatusSelector />}
                        </RadioGroup>
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