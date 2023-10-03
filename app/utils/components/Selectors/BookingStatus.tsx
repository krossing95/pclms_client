'use client'

import { Booking_Status } from "../../statics"
import { FormControlLabel, Radio } from "@mui/material"

const BookingStatusSelector = () => {
    const styling = {
        color: '#026FBD',
        '&.Mui-checked': {
            color: '#026FBD'
        }
    }
    return (
        Booking_Status.map((status, i) => (
            <FormControlLabel
                key={i + 1}
                value={status.value}
                control={<Radio sx={{ ...styling }} />}
                label={status.name}
            />
        ))
    )
}
export default BookingStatusSelector