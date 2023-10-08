import BookingData from '@/app/user/bookings/[bookingId]/components/BookingData'
import Requirement from '@/app/user/bookings/[bookingId]/components/Requirement'
import { Grid } from '@mui/material'
import * as React from 'react'
import UserData from './UserData'

const DataRepresentation = () => {
    return (
        <Grid sx={{ mt: 2 }} container spacing={3}>
            <Grid item xs={12} md={4}>
                <UserData />
            </Grid>
            <Grid item xs={12} md={4}>
                <BookingData />
            </Grid>
            <Grid item xs={12} md={4}>
                <Requirement />
            </Grid>
        </Grid>
    )
}
export default DataRepresentation