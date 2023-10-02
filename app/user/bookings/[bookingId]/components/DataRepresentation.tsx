import { Grid } from '@mui/material'
import * as React from 'react'
import BookingData from './BookingData'
import Requirement from './Requirement'

const DataRepresentation = () => {
    return (
        <Grid sx={{ mt: 2 }} container spacing={3}>
            <Grid item xs={12} md={6}>
                <BookingData />
            </Grid>
            <Grid item xs={12} md={6}>
                <Requirement />
            </Grid>
        </Grid>
    )
}
export default DataRepresentation