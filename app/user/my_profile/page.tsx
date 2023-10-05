'use client'

import { Box, Button, CircularProgress, Grid } from '@mui/material'
import * as React from 'react'
import SuspenseLoader from '@/app/components/Loader'
import ErrorLoading from './components/Error'
import { toast } from 'react-toastify'
import get_authed_user from '@/app/actions/users/user.authed'
import { FetchUsers } from '@/redux/user_management/slice.user_management'
import { useAppDispatch } from '@/redux/hooks'

interface ProfilePageStates {
    loading: boolean
    loaded: boolean
    trying: boolean
}

const ProfilePage = () => {
    const dispatch = useAppDispatch()
    const [states, setStates] = React.useState<ProfilePageStates>({
        loading: true,
        loaded: false,
        trying: false
    })
    const getUser = async () => {
        try {
            const getUser = await get_authed_user()
            setStates(prev => ({ ...prev, trying: false }))
            if (parseInt(getUser.data?.code) !== 200) return setStates(prev => ({ ...prev, loaded: false, loading: false }))
            dispatch(FetchUsers([{ ...getUser.data?.data }]))
            return setStates(prev => ({ ...prev, loaded: true, loading: false }))
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    const retryLoading = () => {
        setStates(prev => ({ ...prev, trying: true }))
        getUser()
    }
    React.useEffect(() => {
        getUser() // eslint-disable-next-line
    }, [])
    return (
        <Box component='div'>
            {states.loading ? (
                <SuspenseLoader text='Loading Profile' ignoreOptionalHeight={true} />
            ) : (
                <React.Fragment>
                    {!states.loaded ? (
                        <ErrorLoading>
                            <Button onClick={retryLoading} sx={{ mt: 2, p: 2 }} variant='contained'>
                                {states.trying ? (
                                    <CircularProgress color='inherit' size={20} />
                                ) : 'try again'}
                            </Button>
                        </ErrorLoading>
                    ) : (
                        <Grid container spacing={2}>
                            {/* <Grid item xs={12} sm={6} md={4}>
                                <ProfileCard />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Edit />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Password />
                            </Grid> */}
                        </Grid>
                    )}
                </React.Fragment>
            )}
        </Box>
    )
}
export default ProfilePage