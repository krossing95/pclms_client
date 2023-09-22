import fetch_stats from "@/app/actions/dashboard/dashboard.fetch_statistics"
import { Box, Grid } from '@mui/material'
import SuspenseLoader from "@/app/components/Loader"
import type { UserDashboard } from "@/app/types/type.dashboard"
import { dashboard_meta } from "@/app/utils/statics"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import * as React from "react"
import DashboardPanel from "./components/PanelPiece"

export const metadata = { ...dashboard_meta }

const getData = async () => {
    const cookieStore = cookies()
    const obj = cookieStore.get('__signedInUserObj')?.value || '{}'
    const cookieObj = JSON.parse(obj)?.user
    const token = cookieObj?.token
    const { data } = await fetch_stats({ token })
    let fetching_state = {
        loaded: false,
        data: {}
    }
    if (parseInt(data.code) !== 200) return fetching_state
    return {
        ...fetching_state,
        loaded: true,
        data: {
            ...data.data
        }
    }
}

const UserDashboardPage = async () => {
    let dataLoaded = false
    const fetchedData: UserDashboard = {
        available_equipment: 0,
        unavailable_equipment: 0,
        bookings: 0,
        favorites: 0
    }
    try {
        const { loaded, data } = await getData()
        dataLoaded = loaded
        fetchedData.available_equipment = data.available_equipment
        fetchedData.unavailable_equipment = data.unavailable_equipment
    } catch (error) {
        revalidatePath('/user/dashboard')
    }

    return (
        <React.Suspense fallback={<SuspenseLoader text="Loading Data" issueOptionalHeight />}>
            <Box component='div'>
                <Grid container spacing={1}>
                    <DashboardPanel name="Available Equipment" figure={fetchedData.available_equipment} />
                    <DashboardPanel name="Unavailable Equipment" figure={fetchedData.unavailable_equipment} />
                </Grid>
            </Box>
        </React.Suspense>
    )
}
export default UserDashboardPage