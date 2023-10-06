import * as React from 'react'
import { Box, Card, CardContent, Grid, LinearProgress, Button, Typography } from '@mui/material'
import styles from '../styles.module.css'
import { toast } from 'react-toastify'
import useValidations from '@/app/hooks/useValidations'
import password_update from '@/app/actions/users/user.password_update'
import { useAppSelector } from '@/redux/hooks'
import useCustomMethods from '@/app/hooks/useCustomMethods'
import MessageBox from '@/app/utils/components/MessageBox'
import InputField from '@/app/components/Input'
import SubmitButton from '@/app/components/SubmitButton'
import { PasswordOutlined } from '@mui/icons-material'
import type { SubmitButtonClasses } from '@/app/components/types'
import { useRouter } from 'next/navigation'
import remove_cookie from '@/app/actions/cookies/cookie.delete'

interface PasswordUpdateStates {
    loading: boolean
    open: boolean
    message: string
    isErrorFree: boolean
    old_password: string
    new_password: string
    confirm_password: string
}

const PasswordUpdate = () => {
    const user = useAppSelector(state => state.usersReducer.users)?.[0]
    const methodHook = useCustomMethods()
    const router = useRouter()
    let btnClasses: SubmitButtonClasses = {}
    const [states, setStates] = React.useState<PasswordUpdateStates>({
        loading: false,
        open: false,
        message: '',
        isErrorFree: false,
        old_password: '',
        new_password: '',
        confirm_password: ''
    })
    const validations = useValidations()
    const handleSubmit = async () => {
        setStates(prev => ({ ...prev, message: '', open: false, isErrorFree: false, new_password: '', old_password: '', confirm_password: '' }))
        const params = {
            data: {
                old_password: states.old_password,
                new_password: states.new_password,
                confirm_password: states.confirm_password
            },
            next: () => setStates(prev => ({ ...prev, loading: true })),
            takeOutPassword: () => setStates(prev => ({ ...prev, old_password: '', new_password: '', confirm_password: '' }))
        }
        const validate = validations.validatePasswordUpdate({ ...params })
        if (validate !== undefined) return setStates(prev => ({ ...prev, message: validate?.error, open: true, isErrorFree: false }))
        try {
            const updatePassword = await password_update({ id: user.id, old_password: params.data.old_password, new_password: params.data.new_password, confirm_password: params.data.confirm_password })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(updatePassword.data?.code) !== 200) return setStates(prev => ({ ...prev, message: updatePassword.data?.message, open: true, isErrorFree: false }))
            setTimeout(async () => {
                await remove_cookie({ cookie_name: '__signedInUserObj' })
                return router.refresh()
            }, 2000)
            return toast("Password update was successful. You'll be logged out soon for session update")
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
        }
    }
    return (
        <Card>
            <MessageBox
                open={states.open}
                isErrorFree={states.isErrorFree}
                message={states.message}
            />
            <CardContent sx={{ marginTop: '-6px' }}>
                <Box component='div'>
                    <Typography variant='h6' sx={{ textTransform: 'uppercase' }} className={styles.text}>{"password update"}</Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={12} className={styles.input_container}>
                            <InputField
                                value={states.old_password} type='password'
                                onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, old_password: (e.target as HTMLInputElement).value }))}
                                classes={styles.input}
                                disabled={states.loading}
                                preventCopyPaste={(e) => methodHook.preventCopyPaste(e)}
                                placeholder='Enter your current password'
                            />
                        </Grid>
                        <Grid item xs={12} className={styles.input_container}>
                            <InputField
                                value={states.new_password} type='password'
                                onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, new_password: (e.target as HTMLInputElement).value }))}
                                classes={styles.input}
                                disabled={states.loading}
                                preventCopyPaste={(e) => methodHook.preventCopyPaste(e)}
                                placeholder='Enter your new password'
                            />
                        </Grid>
                        <Grid item xs={12} className={styles.input_container}>
                            <InputField
                                value={states.confirm_password} type='password'
                                onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, confirm_password: (e.target as HTMLInputElement).value }))}
                                classes={styles.input}
                                disabled={states.loading}
                                preventCopyPaste={(e) => methodHook.preventCopyPaste(e)}
                                placeholder='Confirm the new password'
                            />
                        </Grid>
                        <Grid item xs={12} className={styles.input_container}>
                            <SubmitButton
                                text='change password' icon={() => <PasswordOutlined />}
                                loading={states.loading}
                                design='contained'
                                handleSubmit={handleSubmit}
                                classes={{
                                    ...btnClasses,
                                    background: '#026FBD',
                                    color: '#ffffff',
                                    hoverBackground: '#026FBD',
                                    padding: '15px', width: '100%',
                                    marginBottom: '20px',
                                    progressAlignment: 'center',
                                    progressWidth: '60%'
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
        </Card >
    )
}
export default PasswordUpdate