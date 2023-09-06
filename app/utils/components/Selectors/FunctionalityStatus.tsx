'use client'

import { Functionality_Status } from "../../statics"
import { FormControlLabel, Radio } from "@mui/material"

const FunctionalitySelector = () => {
    const styling = {
        color: '#026FBD',
        '&.Mui-checked': {
            color: '#026FBD'
        }
    }
    return (
        Functionality_Status.map((func, i) => (
            <FormControlLabel
                key={i + 1}
                value={func.value}
                control={<Radio sx={{ ...styling }} />}
                label={func.name}
            />
        ))
    )
}
export default FunctionalitySelector