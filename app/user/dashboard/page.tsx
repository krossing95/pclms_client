import fetch_stats from "@/app/actions/dashboard/dashboard.fetch_statistics"
import { Box, Grid } from '@mui/material'
import SuspenseLoader from "@/app/components/Loader"
import type { UserDashboard } from "@/app/types/type.dashboard"
import { dashboard_meta } from "@/app/utils/statics"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import * as React from "react"
import DashboardPanel from "./components/PanelPiece"
import GraphicalRepresentationForEquipment from "./components/visuals/visual.Equipment"
import GraphicalRepresentationForBookings from "./components/visuals/visual.Bookings"
import GraphicalRepresentationForFavorites from "./components/visuals/visual.Favorites"

export const metadata = { ...dashboard_meta }
export const dynamic = 'force-dynamic'

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
        closed_bookings: 0,
        approved_bookings: 0,
        pending_bookings: 0,
        saved_equipment: 0,
        unsaved_equipment: 0,
    }
    try {
        const { loaded, data } = await getData()
        dataLoaded = loaded
        fetchedData.available_equipment = data.available_equipment
        fetchedData.unavailable_equipment = data.unavailable_equipment
        fetchedData.closed_bookings = data.closed_bookings
        fetchedData.approved_bookings = data.approved_bookings
        fetchedData.pending_bookings = data.pending_bookings
        fetchedData.saved_equipment = data.saved_equipment
        fetchedData.unsaved_equipment = data.unsaved_equipment
    } catch (error) {
        revalidatePath('/user/dashboard')
    }

    return (
        <React.Suspense fallback={<SuspenseLoader text="Loading Data" ignoreOptionalHeight />}>
            <Box component='div'>
                <Grid container spacing={1}>
                    <DashboardPanel name="Available Equipment" figure={fetchedData.available_equipment} />
                    <DashboardPanel name="Unavailable Equipment" figure={fetchedData.unavailable_equipment} />
                    <DashboardPanel name="Favorite List" figure={fetchedData.saved_equipment} />
                    <DashboardPanel name="Approved Bookings" figure={fetchedData.approved_bookings} />
                </Grid>
                <Grid sx={{ mt: 3 }} container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <GraphicalRepresentationForEquipment
                            unavailable_equipment={fetchedData.unavailable_equipment}
                            available_equipment={fetchedData.available_equipment}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <GraphicalRepresentationForBookings
                            pending_bookings={fetchedData.pending_bookings}
                            approved_bookings={fetchedData.approved_bookings}
                            closed_bookings={fetchedData.closed_bookings}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <GraphicalRepresentationForFavorites
                            unsaved_equipment={fetchedData.unsaved_equipment}
                            saved_equipment={fetchedData.saved_equipment}
                        />
                    </Grid>
                </Grid>
            </Box>
        </React.Suspense>
    )
}
export default UserDashboardPage