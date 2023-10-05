'use client'

import { Box, Button, Grid, Typography } from '@mui/material'
import { LoginOutlined, SendOutlined } from '@mui/icons-material'
import * as React from 'react'
import styles from '../../styles.module.css'
import MessageBox from '@/app/utils/components/MessageBox'
import useCustomMethods from '@/app/hooks/useCustomMethods'
import Cookies from 'js-cookie'
import SubmitButton from '@/app/components/SubmitButton'
import { SubmitButtonClasses } from '@/app/components/types'
import useValidations from '@/app/hooks/useValidations'
import verify from '@/app/actions/authentication/auth.verify'
import resend_otp from '@/app/actions/authentication/auth.resend_otp'
import { useRouter } from 'next/navigation'
import set_cookie from '@/app/actions/cookies/cookie.set'
import remove_cookie from '@/app/actions/cookies/cookie.delete'

type VerificationStates = {
    user_id: string
    verification_code: string[]
    loading: boolean
    open: boolean
    isErrorFree: boolean
    formSwitcher: boolean
    message: string
}
type CookieState = {
    cookie: any
}

interface VerificationFormProps {
    page: 'sign-in' | 'sign-up'
}

const VerificationForm: React.FC<VerificationFormProps> = ({ page }) => {
    let btnClasses: SubmitButtonClasses = {}
    const { validateOTP, validateResendOTP } = useValidations()
    const navigate = useRouter()
    // const handleSetCookie = (name: string, value: string, expires: any) => Cookies.set(name, value, { expires: expires })
    const [cookieState, setCookieState] = React.useState<CookieState>({ cookie: null })
    const [states, setStates] = React.useState<VerificationStates>({
        loading: false, open: false, isErrorFree: false, message: '', formSwitcher: false,
        user_id: !cookieState.cookie ? '' : cookieState.cookie?.id, verification_code: new Array(6).fill('')
    })
    const { preventCopyPaste } = useCustomMethods()
    React.useEffect(() => {
        const getCookie = () => {
            const cookieObj = Cookies.get('__requesting_verification') || '{}'
            const cookie = typeof Cookies.get('__requesting_verification') === 'undefined' ? null : JSON.parse(cookieObj)
            return setCookieState(prev => ({ ...prev, cookie }))
        }
        getCookie()
    }, [])
    React.useEffect(() => {
        const autoFocus = () => {
            const firstBox: HTMLElement | null = document.querySelector('#box-0')
            firstBox?.focus()
        }
        autoFocus() // eslint-disable-next-line
    }, [])
    const handleCodeInput = (element: HTMLInputElement | null, index: number) => {
        const inputValue = !element ? '' : element?.value
        if (isNaN(parseInt(inputValue))) return false
        setStates(prev => ({ ...prev, verification_code: [...prev.verification_code.map((otp, idx) => idx === index ? inputValue : otp)] }))
        if (element?.nextSibling) {
            (element?.nextSibling as HTMLElement)?.focus()
        }
    }
    const toggleResend = () => setStates(prev => ({ ...prev, formSwitcher: !states.formSwitcher, isErrorFree: false, message: '', open: false }))
    const handleResend = async () => {
        setStates(prev => ({ ...prev, isErrorFree: false, message: '', open: false }))
        const params = {
            data: {
                user_id: !cookieState.cookie ? '' : cookieState.cookie?.id, tk_value: !cookieState.cookie ? '' : cookieState.cookie?.resend_otp_token
            },
            next: () => setStates(prev => ({ ...prev, loading: true }))
        }
        const validate = validateResendOTP({ ...params })
        if (validate?.error !== undefined) return setStates(prev => ({ ...prev, message: validate?.error, open: true, isErrorFree: false }))
        try {
            const resendOTP = await resend_otp({ user_id: params.data.user_id, tk_value: params.data.tk_value })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(resendOTP.data?.code) !== 200) return setStates(prev => ({ ...prev, isErrorFree: false, message: resendOTP?.data?.message, open: true }))
            setStates(prev => ({ ...prev, isErrorFree: true, message: resendOTP?.data?.message, open: true }))
            return setTimeout(() => toggleResend(), 1000)
        } catch (error) {
            console.log('VERIFICATION_ERROR')
        }
    }
    const handleSubmit = async () => {
        setStates(prev => ({ ...prev, isErrorFree: false, message: '', open: false }))
        const params = {
            data: {
                user_id: !cookieState.cookie ? '' : cookieState.cookie?.id, verification_code: states.verification_code.join(''), page
            },
            next: () => setStates(prev => ({ ...prev, loading: true }))
        }
        const validate = validateOTP({ ...params })
        if (validate?.error !== undefined) return setStates(prev => ({ ...prev, message: validate?.error, open: true, isErrorFree: false }))
        try {
            const userVerification = await verify({ user_id: params.data.user_id, verification_code: states.verification_code.join(''), page })
            setStates(prev => ({ ...prev, loading: false, verification_code: prev.verification_code.map(() => '') }))
            if (parseInt(userVerification.data?.code) !== 200) return setStates(prev => ({ ...prev, message: userVerification.data?.message, open: true, isErrorFree: false }))
            const expiration = 7200
            await remove_cookie({ cookie_name: '__requesting_verification' })
            await set_cookie({ name: '__signedInUserObj', value: JSON.stringify({ ...userVerification.data?.data, __app: 'right' }), options: { maxAge: expiration } })
            const usertype = userVerification.data?.data?.user?.usertype
            setStates(prev => ({ ...prev, isErrorFree: true, message: userVerification?.data?.message, open: true }))
            return navigate.push(parseInt(usertype) === 2 ? '/admin/dashboard' : '/user/dashboard')
        } catch (error) {
            console.log('VERIFICATION_ERROR')
        }
    }
    return (
        <Box component='div'>
            <Typography
                variant='body2'
                paragraph
                gutterBottom
                sx={{ pb: 2, lineHeight: '30px' }}
            >
                {
                    !states.formSwitcher ? "Kindly input the verification code that has been transmitted to your designated phone number in order to successfully complete the verification process." :
                        "Please click the button provided below to initiate the process of requesting a new verification code in the event that you have not successfully received it."
                }
            </Typography>
            <MessageBox
                open={states.open} isErrorFree={states.isErrorFree} message={states.message}
            />
            <Grid container spacing={3}>
                <React.Fragment>
                    {
                        !states.formSwitcher ? (
                            <React.Fragment>
                                <Grid item xs={12} className={styles.otpBox_container}>
                                    {states.verification_code.map((otp, i) => (
                                        <input style={{ fontSize: '30px', fontWeight: '100' }} id={`box-${i}`} value={otp} maxLength={1} className={styles.otpBox}
                                            onCopy={preventCopyPaste} onPaste={preventCopyPaste}
                                            type='text' key={i + 1}
                                            onChange={(e: React.SyntheticEvent<EventTarget>) => handleCodeInput((e.target as HTMLInputElement), i)}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    ))}
                                </Grid>
                                <Grid item xs={12} sx={{ mt: 3 }} className={styles.input_container}>
                                    <SubmitButton
                                        text={'verify'} icon={() => <LoginOutlined />}
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
                        ) : (
                            <Grid item xs={12} sx={{ mt: 3 }} className={styles.input_container}>
                                <SubmitButton
                                    text='resend otp' icon={() => <SendOutlined />}
                                    loading={states.loading}
                                    design='contained'
                                    handleSubmit={handleResend}
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
                        )
                    }
                </React.Fragment>
            </Grid>
            <Grid container>
                <Grid item xs>
                    <Button onClick={toggleResend} className={styles.ahref}>
                        {!states.formSwitcher ? "resend otp" : "have received otp"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}
export default VerificationForm