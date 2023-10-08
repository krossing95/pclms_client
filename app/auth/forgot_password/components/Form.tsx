import { Box, Grid } from '@mui/material'
import { PasswordOutlined } from '@mui/icons-material'
import * as React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import styles from '../../register/styles.module.css'
import MessageBox from '@/app/utils/components/MessageBox'
import type { SubmitButtonClasses } from '@/app/components/types'
import SubmitButton from '@/app/components/SubmitButton'
import Link from 'next/link'
import InputField from '@/app/components/Input'
import useValidations from '@/app/hooks/useValidations'
import forgot_password from '@/app/actions/authentication/auth.forgot_password'

const Recaptcha_SiteKey = process.env.NEXT_PUBLIC_RECAPTCHA


interface ForgotPasswordStates {
    captcha: string
    phone: string
    loading: boolean
    open: boolean
    isErrorFree: boolean
    message: string
}

interface MappableObject {
    captcha: string
    phone: string
}


const Form = () => {
    const [states, setStates] = React.useState<ForgotPasswordStates>({
        phone: '',
        captcha: '',
        loading: false,
        message: '',
        open: false,
        isErrorFree: false
    })
    let btnClasses: SubmitButtonClasses = {}
    const captchaRef = React.useRef<ReCAPTCHA>(null)
    const { validateForgotPassword } = useValidations()
    const handleSubmit = async () => {
        setStates(prev => ({ ...prev, isErrorFree: false, message: '', open: false }))
        const params = {
            data: {
                phone: states.phone, captcha: states.captcha
            },
            next: async () => {
                const emptinessCheckerObject: MappableObject = {
                    phone: states.phone,
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
        const validate = validateForgotPassword({ ...params })
        captchaRef.current?.reset()
        if (validate?.error !== undefined) return setStates(prev => ({ ...prev, message: validate?.error, open: true, isErrorFree: false, captcha: '' }))
        try {
            const submit = await forgot_password({ phone: params.data.phone, captcha: params.data.captcha })
            setStates(prev => ({ ...prev, loading: false, captcha: '' }))
            const trueStatus = parseInt(submit.data?.code) === 200
            return setStates(prev => ({ ...prev, isErrorFree: trueStatus ? true : false, message: submit?.data?.message, open: true }))
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
                            value={states.phone} type='text'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, phone: (e.target as HTMLInputElement).value }))}
                            classes={styles.login_input}
                            disabled={states.loading}
                            placeholder='Enter your registered phone number'
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ justifyContent: { xs: 'center', sm: 'flex-start', md: 'flex-start' } }} className={styles.input_container}>
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
                    <Grid item xs>
                        <Link href="/auth/login" as={"/auth/login"} className={styles.ahref}>{"Click here to sign in"}</Link>
                    </Grid>
                    <Grid item xs>
                        <Link href="/auth/register" className={styles.ahref}>Don&apos;t have an account? <strong>Click here</strong></Link>
                    </Grid>
                </React.Fragment>
            </Grid>
        </Box>
    )
}
export default Form