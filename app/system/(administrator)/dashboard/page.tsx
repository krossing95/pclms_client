'use client'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import fetch_stats from '@/app/actions/dashboard/dashboard.fetch_statistics'
import * as React from 'react'
import { toast } from 'react-toastify'
import { SaveDashboardData } from '@/redux/dashboard/slice.dashboard'
import SuspenseLoader from '@/app/components/Loader'
import { Box } from '@mui/material'
import EmptyList from '@/app/utils/components/EmptyList'

type DashboardStates = {
    loading: boolean
}

const DashboardPage = () => {
    const statistics = useAppSelector(state => state.dashboardReducer.statistics)
    const [states, setStates] = React.useState<DashboardStates>({ loading: true })
    const dispatch = useAppDispatch()
    React.useEffect(() => {
        const getData = async () => {
            try {
                const result = await fetch_stats()
                setStates(prev => ({ ...prev, loading: false }))
                if (parseInt(result.data?.code) !== 200) return toast(result.data?.message)
                return dispatch(SaveDashboardData({ ...result.data.statistics }))
            } catch (error) {
                console.log('STATS_ERROR')
            }
        }
        getData()
    }, [])

    return (
        <Box component='div'>
            {states.loading ? (
                <SuspenseLoader text='Loading statistics' issueOptionalHeight={true} />
            ) : (
                <React.Fragment>
                    {Object.keys(statistics).length === 0 ? (
                        <EmptyList />
                    ) : (
                        <React.Fragment>
                            {/* <TopData />
                            <Grid sx={{ mt: 3 }} container spacing={3}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <AccountVisuals />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <EquipmentVisual />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <BookingsVisual />
                                </Grid>
                            </Grid>
                            <Settings />
                            <DefaultSettings /> */}
                        </React.Fragment>
                    )}
                </React.Fragment>
            )}
            {/* {app?.dashboard_create ? (
                <Create />
            ) : null} */}
        </Box>
    )
}
export default DashboardPage