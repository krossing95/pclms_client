'use client'

import { Availability_Status } from "../../statics"
import { FormControlLabel, Radio } from "@mui/material"

const AvailabilitySelector = () => {
    const styling = {
        color: '#026FBD',
        '&.Mui-checked': {
            color: '#026FBD'
        }
    }
    return (
        Availability_Status.map((avail, i) => (
            <FormControlLabel
                key={i + 1}
                value={avail.value}
                control={<Radio sx={{ ...styling }} />}
                label={avail.name}
            />
        ))
    )
}
export default AvailabilitySelector