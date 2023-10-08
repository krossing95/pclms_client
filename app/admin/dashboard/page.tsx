import fetch_stats from "@/app/actions/dashboard/dashboard.fetch_statistics"
import { Box, Grid } from '@mui/material'
import SuspenseLoader from "@/app/components/Loader"
import type { AdminDashboard } from "@/app/types/type.dashboard"
import { dashboard_meta } from "@/app/utils/statics"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import * as React from "react"
import DashboardPanel from "@/app/user/dashboard/components/PanelPiece"
import GraphicalRepresentationForBookings from "./components/visuals/visual.Bookings"
import GraphicalRepresentationForEquipment from "./components/visuals/visual.Equipment"
import GraphicalRepresentationForUsers from "./components/visuals/visual.Users"

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

const AdminDashboardPage = async () => {
    let dataLoaded = false
    const fetchedData: AdminDashboard = {
        available_equipment: 0,
        unavailable_equipment: 0,
        recyclable_equipment: 0,
        pending_bookings: 0,
        approved_bookings: 0,
        administrators: 0,
        non_administrators: 0,
        blocked_users: 0
    }
    try {
        const { loaded, data } = await getData()
        dataLoaded = loaded
        fetchedData.available_equipment = data.available_equipment
        fetchedData.unavailable_equipment = data.unavailable_equipment
        fetchedData.recyclable_equipment = data.recyclable_equipment
        fetchedData.approved_bookings = data.approved_bookings
        fetchedData.pending_bookings = data.pending_bookings
        fetchedData.administrators = data.administrators
        fetchedData.non_administrators = data.non_administrators
        fetchedData.blocked_users = data.blocked_users
    } catch (error) {
        revalidatePath('/admin/dashboard')
    }

    return (
        <React.Suspense fallback={<SuspenseLoader text="Loading Data" ignoreOptionalHeight />}>
            <Box component='div'>
                <Grid container spacing={1}>
                    <DashboardPanel name="System Users" figure={fetchedData.administrators + fetchedData.non_administrators + fetchedData.blocked_users} />
                    <DashboardPanel name="Total Equipment" figure={fetchedData.available_equipment + fetchedData.unavailable_equipment + fetchedData.recyclable_equipment} />
                    <DashboardPanel name="Available Equipment" figure={fetchedData.available_equipment} />
                    <DashboardPanel name="Pending Bookings" figure={fetchedData.pending_bookings} />
                </Grid>
                <Grid sx={{ mt: 3 }} container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <GraphicalRepresentationForEquipment
                            unavailable_equipment={fetchedData.unavailable_equipment}
                            available_equipment={fetchedData.available_equipment}
                            hidden_equipment={fetchedData.recyclable_equipment}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <GraphicalRepresentationForBookings
                            pending_bookings={fetchedData.pending_bookings}
                            approved_bookings={fetchedData.approved_bookings}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <GraphicalRepresentationForUsers
                            admins={fetchedData.administrators}
                            non_admins={fetchedData.non_administrators}
                            blocked_users={fetchedData.blocked_users}
                        />
                    </Grid>
                </Grid>
            </Box>
        </React.Suspense>
    )
}
export default AdminDashboardPage