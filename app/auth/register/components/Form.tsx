'use client'

import * as React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { LoginOutlined, Link as LinkIcon } from '@mui/icons-material'
import styles from '../styles.module.css'
import MessageBox from '@/app/utils/components/MessageBox'
import useCustomMethods from '@/app/hooks/useCustomMethods'
import InputField from '@/app/components/Input'
import SubmitButton from '@/app/components/SubmitButton'
import Link from 'next/link'
import useValidations from '@/app/hooks/useValidations'
import register from '@/app/actions/authentication/auth.register'
import { useRouter } from 'next/navigation'
import set_cookie from '@/app/actions/cookies/cookie.set'
import { SubmitButtonClasses } from '@/app/components/types'

type RegisterStates = {
    firstname: string
    lastname: string
    email: string
    phone: string
    password: string
    password_confirmation: string
    loading: boolean
    open: boolean
    isErrorFree: boolean
    message: string
}
interface MappableObject {
    firstname: string
    lastname: string
    phone: string
    email: string
    password: string
    password_confirmation: string
}

const Form = () => {
    let btnClasses: SubmitButtonClasses = {}
    const { validateRegistration } = useValidations()
    const [states, setStates] = React.useState<RegisterStates>({
        firstname: '', lastname: '', email: '', phone: '', password: '', password_confirmation: '',
        loading: false, open: false, isErrorFree: false, message: ''
    })
    const { preventCopyPaste } = useCustomMethods()
    const navigate = useRouter()
    const handleSubmit = async () => {
        setStates(prev => ({ ...prev, isErrorFree: false, message: '', open: false }))
        const takeOutPassword = () => setStates(prev => ({ ...prev, password: '', password_confirmation: '' }))
        const params = {
            data: {
                firstname: states.firstname, lastname: states.lastname, phone: states.phone, email: states.email, password: states.password, password_confirmation: states.password_confirmation
            },
            takeOutPassword: () => takeOutPassword(),
            next: async () => {
                const emptinessCheckerObject: MappableObject = {
                    firstname: states.firstname,
                    lastname: states.lastname,
                    phone: states.phone,
                    email: states.email,
                    password: states.password,
                    password_confirmation: states.password_confirmation
                }
                let isNull = false
                for (const key in emptinessCheckerObject) {
                    if (emptinessCheckerObject[key as keyof MappableObject].toString().trim().length === 0) isNull = true
                }
                if (isNull) return false
                setStates(prev => ({ ...prev, loading: true }))
            }
        }
        const validate = validateRegistration({ ...params })
        if (validate?.error !== undefined) return setStates(prev => ({ ...prev, message: validate?.error, open: true, isErrorFree: false }))
        try {
            const create = await register({ ...params.data })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(create.data?.code) !== 201) return setStates(prev => ({ ...prev, isErrorFree: false, message: create?.data?.message, open: true }))
            const expiration = 600
            await set_cookie({ name: '__requesting_verification', value: JSON.stringify({ ...create.data?.data }), options: { maxAge: expiration } })
            setStates(prev => ({ ...prev, isErrorFree: true, message: create?.data?.message, open: true }))
            return navigate.push('/auth/register/verify')
        } catch (error) {
            console.log('REGISTER_ERROR')
        }
    }

    return (
        <Box component='div'>
            <MessageBox
                open={states.open} isErrorFree={states.isErrorFree} message={states.message}
            />
            <Grid container spacing={3}>
                <React.Fragment>
                    <Grid item xs={12} sm={6} className={styles.input_container} >
                        <InputField
                            value={states.firstname} type='text'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, firstname: (e.target as HTMLInputElement).value }))}
                            classes={styles.login_input}
                            disabled={states.loading}
                            placeholder='Enter your firstname'
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} className={styles.input_container} >
                        <InputField
                            value={states.lastname} type='text'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, lastname: (e.target as HTMLInputElement).value }))}
                            classes={styles.login_input}
                            disabled={states.loading}
                            placeholder='Enter your lastname'
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} className={styles.input_container}>
                        <InputField
                            value={states.email} type='email'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, email: (e.target as HTMLInputElement).value }))}
                            classes={styles.login_input}
                            disabled={states.loading}
                            placeholder='Enter your email address'
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} className={styles.input_container}>
                        <InputField
                            value={states.phone} type='text'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, phone: (e.target as HTMLInputElement).value }))}
                            classes={styles.login_input}
                            disabled={states.loading}
                            placeholder='Enter your phone number'
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} className={styles.input_container}>
                        <InputField
                            value={states.password} type='password'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, password: (e.target as HTMLInputElement).value }))}
                            classes={styles.login_input}
                            disabled={states.loading}
                            placeholder='Enter a secure password'
                            preventCopyPaste={(e) => preventCopyPaste(e)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} className={styles.input_container}>
                        <InputField
                            value={states.password_confirmation} type='password'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, password_confirmation: (e.target as HTMLInputElement).value }))}
                            classes={styles.login_input}
                            disabled={states.loading}
                            placeholder='Confirm your password'
                            preventCopyPaste={(e) => preventCopyPaste(e)}
                        />
                    </Grid>
                    <Grid item xs={12} className={styles.input_container} >
                        <SubmitButton
                            text='sign up' icon={() => <LoginOutlined />}
                            loading={states.loading}
                            design='contained'
                            handleSubmit={handleSubmit}
                            classes={{
                                ...btnClasses,
                                background: '#026FBD',
                                color: '#ffffff',
                                hoverBackground: '#026FBD',
                                padding: '20px', width: '100%',
                                marginBottom: '20px',
                                progressAlignment: 'center',
                                progressWidth: '60%'
                            }}
                        />
                    </Grid>
                    <Grid item xs>
                        <Typography gutterBottom variant='body2' color='GrayText'>By clicking on the create button above, you have accepted all our terms and conditions</Typography>
                    </Grid>
                    <Grid item xs>
                        <Link href="/auth/login" as={"/auth/login"} className={styles.ahref}>I already have an account <LinkIcon /></Link>
                    </Grid>
                </React.Fragment>
            </Grid>
        </Box>
    )
}
export default Form