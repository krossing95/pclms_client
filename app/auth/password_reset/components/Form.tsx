import { Box, Button, Grid, LinearProgress } from '@mui/material'
import * as React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import styles from '../Register/Register.module.css'
import useCustomMethods from '@/app/hooks/useCustomMethods'
import MessageBox from '@/app/utils/components/MessageBox'
import InputField from '@/app/components/Input'
import type { SubmitButtonClasses } from '@/app/components/types'
import SubmitButton from '@/app/components/SubmitButton'
import { PasswordOutlined } from '@mui/icons-material'
import Link from 'next/link'
import useValidations from '@/app/hooks/useValidations'
import { useRouter, useSearchParams } from 'next/navigation'
import reset_password from '@/app/actions/authentication/auth.reset_password'

const Recaptcha_SiteKey = process.env.NEXT_PUBLIC_RECAPTCHA

interface PasswordRestStates {
    password: string
    password_confirmation: string
    captcha: string
    loading: boolean
    message: string
    isErrorFree: boolean
    open: boolean
    code: string
    user: string
}


export type MappableObject = {
    password: string
    password_confirmation: string
    captcha: string
    code: string
    user: string
}


const Form = () => {
    const methodHooks = useCustomMethods()
    const urlParams = useSearchParams()
    const [states, setStates] = React.useState<PasswordRestStates>({
        password: '',
        password_confirmation: '',
        captcha: '',
        loading: false,
        message: '',
        isErrorFree: false,
        open: false,
        code: urlParams.get('code') || '',
        user: urlParams.get('user') || ''
    })
    const { validatePasswordReset } = useValidations()
    let btnClasses: SubmitButtonClasses = {}
    const captchaRef = React.useRef<ReCAPTCHA>(null)
    const router = useRouter()
    const handleSubmit = async () => {
        setStates(prev => ({ ...prev, isErrorFree: false, message: '', open: false }))
        const takeOutPassword = () => setStates(prev => ({ ...prev, password: '', password_confirmation: '' }))
        const params = {
            data: {
                password: states.password, password_confirmation: states.password_confirmation, captcha: states.captcha,
                user: states.user, code: states.code
            },
            next: async () => {
                const emptinessCheckerObject: MappableObject = {
                    password: states.password,
                    password_confirmation: states.password_confirmation,
                    captcha: states.captcha,
                    code: states.code,
                    user: states.user
                }
                let isNull = false
                for (const key in emptinessCheckerObject) {
                    if (emptinessCheckerObject[key as keyof MappableObject].toString().trim().length === 0) isNull = true
                }
                if (isNull) return false
                setStates(prev => ({ ...prev, loading: true }))
            },
            takeOutPassword: () => takeOutPassword()
        }
        const validate = validatePasswordReset({ ...params })
        captchaRef.current?.reset()
        if (validate?.error !== undefined) return setStates(prev => ({ ...prev, message: validate?.error, open: true, isErrorFree: false, captcha: '' }))
        try {
            const submit = await reset_password({
                password: params.data.password,
                password_confirmation: params.data.password_confirmation,
                captcha: params.data.captcha, code: params.data.code, user: params.data.user
            })
            setStates(prev => ({ ...prev, loading: false, captcha: '' }))
            if (parseInt(submit.data?.code) !== 200) return setStates(prev => ({ ...prev, isErrorFree: false, message: submit?.data?.message, open: true }))
            setTimeout(() => {
                return router.push('/auth/login')
            }, 2000)
            return setStates(prev => ({ ...prev, isErrorFree: true, message: submit?.data?.message, open: true }))
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
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
                            value={states.password} type='password'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, password: (e.target as HTMLInputElement).value }))}
                            classes={styles.input}
                            disabled={states.loading}
                            preventCopyPaste={(e) => methodHooks.preventCopyPaste(e)}
                            placeholder='Enter your new password'
                        />
                    </Grid>
                    <Grid item xs={12} className={styles.input_container}>
                        <InputField
                            value={states.password_confirmation} type='password'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, password_confirmation: (e.target as HTMLInputElement).value }))}
                            classes={styles.input}
                            disabled={states.loading}
                            preventCopyPaste={(e) => methodHooks.preventCopyPaste(e)}
                            placeholder='Repeat the password'
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ justifyContent: { xs: 'center', sm: 'flex-start', md: 'flex-start' } }} className={styles.input_container} >
                        <ReCAPTCHA ref={captchaRef} sitekey={Recaptcha_SiteKey || ''} onChange={(e) => setStates(prev => ({ ...prev, captcha: e || '' }))} />
                    </Grid>
                    <Grid item xs={12} className={styles.input_container}>
                        <SubmitButton
                            text='submit' icon={() => <PasswordOutlined />}
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
                </React.Fragment>
            </Grid>
            <Grid container>
                <Grid item xs>
                    <Link href="/auth/login" as={"/auth/login"} className={styles.ahref}>{"Click here to sign in"}</Link>
                </Grid>
            </Grid>
        </Box>
    )
}
export default Form