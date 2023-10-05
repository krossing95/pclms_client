import * as React from 'react'
import { Box, Card, CardContent, Grid, LinearProgress, Button, Typography } from '@mui/material'
import styles from './styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import useValidations from '@/app/hooks/useValidations'
import update_self from '@/app/actions/users/user.update_self'
import { FetchUsers } from '@/redux/user_management/slice.user_management'
import { toast } from 'react-toastify'
import remove_cookie from '@/app/actions/cookies/cookie.delete'
import { useRouter } from 'next/navigation'
import MessageBox from '@/app/utils/components/MessageBox'
import InputField from '@/app/components/Input'
import SubmitButton from '@/app/components/SubmitButton'
import type { SubmitButtonClasses } from '@/app/components/types'
import { SaveOutlined } from '@mui/icons-material'

interface ProfileUpdateStates {
    loading: boolean
    open: boolean
    message: string
    isErrorFree: boolean
    firstname: string
    lastname: string
    email: string
    phone: string
}

const ProfileUpdate = () => {
    const user = useAppSelector(state => state.usersReducer.users)?.[0]
    const [states, setStates] = React.useState<ProfileUpdateStates>({
        loading: false,
        open: false,
        message: '',
        isErrorFree: false,
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        phone: user.phone || ''
    })
    const router = useRouter()
    let btnClasses: SubmitButtonClasses = {}
    const validations = useValidations()
    const dispatch = useAppDispatch()
    const handleSubmit = async () => {
        setStates(prev => ({ ...prev, message: '', open: false, isErrorFree: false }))
        const params = {
            data: {
                id: user.id,
                firstname: states.firstname,
                lastname: states.lastname,
                email: states.email,
                phone: states.phone,
                user_status: user.usertype
            },
            next: () => setStates(prev => ({ ...prev, loading: true }))
        }
        const validate = validations.validateUserUpdate({ ...params })
        if (validate !== undefined) return setStates(prev => ({ ...prev, message: validate?.error, open: true, isErrorFree: false }))
        try {
            const update = await update_self({
                firstname: params.data.firstname,
                lastname: params.data.lastname,
                email: params.data.email,
                phone: params.data.phone
            })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(update.data?.code) !== 200) return setStates(prev => ({ ...prev, message: update.data?.message, open: true, isErrorFree: false }))
            const data = update.data?.data
            if (data?.phone !== user.phone || data?.email !== user.email) {
                setTimeout(async () => {
                    await remove_cookie({ cookie_name: '__signedInUserObj' })
                    return router.refresh()
                }, 2000)
                return toast('Contact details updated. System is automatically logging out for session update')
            }
            dispatch(FetchUsers([{
                ...user,
                firstname: data?.firstname,
                lastname: data?.lastname,
                email: data?.email,
                phone: data?.phone
            }]))
            return setStates(prev => ({ ...prev, message: 'Profile update was successful', open: true, isErrorFree: true }))
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
                    <Typography variant='h6' sx={{ textTransform: 'uppercase' }} className={styles.text}>{"profile update"}</Typography>
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
                        <Grid item xs={12} className={styles.input_container}>
                            <InputField
                                value={states.email} type='text'
                                onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, email: (e.target as HTMLInputElement).value }))}
                                classes={styles.input}
                                disabled={states.loading}
                                placeholder='Enter your email address'
                            />
                        </Grid>
                        <Grid item xs={12} className={styles.input_container}>
                            <InputField
                                value={states.phone} type='text'
                                onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, phone: (e.target as HTMLInputElement).value }))}
                                classes={styles.input}
                                disabled={states.loading}
                                placeholder='Enter your phone number'
                            />
                        </Grid>
                        <Grid item xs={12} className={styles.input_container}>
                            <SubmitButton
                                text='update profile' icon={() => <SaveOutlined />}
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
export default ProfileUpdate