'use client'

import { Box, Grid, Typography } from '@mui/material'
import { LoginOutlined, Link as LinkIcon } from '@mui/icons-material'
import styles from '../../register/styles.module.css'
import { SubmitButtonClasses } from '@/app/components/types'
import useCustomMethods from '@/app/hooks/useCustomMethods'
import useValidations from '@/app/hooks/useValidations'
import MessageBox from '@/app/utils/components/MessageBox'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import InputField from '@/app/components/Input'
import SubmitButton from '@/app/components/SubmitButton'
import Link from 'next/link'
import ReCAPTCHA from 'react-google-recaptcha'
import login from '@/app/actions/authentication/auth.login'
import set_cookie from '@/app/actions/cookies/cookie.set'

const Recaptcha_SiteKey = process.env.NEXT_PUBLIC_RECAPTCHA

type LoginStates = {
    captcha: string
    phone: string
    password: string
    loading: boolean
    open: boolean
    isErrorFree: boolean
    message: string
}

interface MappableObject {
    captcha: string
    phone: string
    password: string
}

const LoginForm = () => {
    let btnClasses: SubmitButtonClasses = {}
    const captchaRef = React.useRef<ReCAPTCHA>(null)
    const { validateLogin } = useValidations()
    const [states, setStates] = React.useState<LoginStates>({
        captcha: '', phone: '', password: '', loading: false, open: false, isErrorFree: false, message: ''
    })
    const { preventCopyPaste } = useCustomMethods()
    const navigate = useRouter()
    const handleSubmit = async () => {
        setStates(prev => ({ ...prev, isErrorFree: false, message: '', open: false }))
        const takeOutPassword = () => setStates(prev => ({ ...prev, password: '' }))
        const params = {
            data: {
                phone: states.phone, password: states.password, captcha: states.captcha
            },
            takeOutPassword: () => takeOutPassword(),
            next: async () => {
                const emptinessCheckerObject: MappableObject = {
                    phone: states.phone,
                    password: states.password,
                    captcha: states.captcha
                }
                let isNull = false
                for (const key in emptinessCheckerObject) {
                    if (emptinessCheckerObject[key as keyof MappableObject].toString().trim().length === 0) isNull = true
                }
                if (isNull) return false
                setStates(prev => ({ ...prev, loading: true }))
            }
        }
        const validate = validateLogin({ ...params })
        captchaRef.current?.reset()
        if (validate?.error !== undefined) return setStates(prev => ({ ...prev, message: validate?.error, open: true, isErrorFree: false, captcha: '' }))
        try {
            const app_login = await login({ ...params.data })
            setStates(prev => ({ ...prev, loading: false, captcha: '' }))
            if (parseInt(app_login.data?.code) !== 200) return setStates(prev => ({ ...prev, isErrorFree: false, message: app_login?.data?.message, open: true }))
            const expiration = new Date()
            expiration.setTime(expiration.getTime() + 10 * 60 * 1000)
            await set_cookie({ name: '__requesting_verification', value: JSON.stringify({ ...app_login.data?.data }), options: { expires: expiration } })
            setStates(prev => ({ ...prev, isErrorFree: true, message: app_login?.data?.message, open: true }))
            return navigate.push('/auth/login/verify')
        } catch (error) {
            console.log('LOGIN_ERROR')
        }
    }

    return (
        <Box component='div'>
            <MessageBox
                open={states.open} isErrorFree={states.isErrorFree} message={states.message}
            />
            <Grid container spacing={3}>
                <React.Fragment>
                    <Grid item xs={12} className={styles.input_container}>
                        <InputField
                            value={states.phone} type='text'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, phone: (e.target as HTMLInputElement).value }))}
                            classes={styles.login_input}
                            disabled={states.loading}
                            placeholder='Enter your phone number'
                        />
                    </Grid>
                    <Grid item xs={12} className={styles.input_container}>
                        <InputField
                            value={states.password} type='password'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, password: (e.target as HTMLInputElement).value }))}
                            classes={styles.login_input}
                            disabled={states.loading}
                            placeholder='Enter your password'
                            preventCopyPaste={(e) => preventCopyPaste(e)}
                        />
                    </Grid>
                    <Grid item xs={12} className={styles.input_container}>
                        <ReCAPTCHA ref={captchaRef} sitekey={Recaptcha_SiteKey || ''} onChange={(e) => setStates(prev => ({ ...prev, captcha: e || '' }))} />
                    </Grid>
                    <Grid item xs={12} className={styles.input_container} >
                        <SubmitButton
                            text='sign in' icon={() => <LoginOutlined />}
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
                        <Link href="/auth/register" as={"/auth/register"} className={styles.ahref}>Don&apos;t have an account? Click here<LinkIcon /></Link>
                    </Grid>
                </React.Fragment>
            </Grid>
        </Box>
    )
}

export default LoginForm