'use client'

import { Technical_Assistance } from "../../statics"
import { FormControlLabel, Radio } from "@mui/material"

const TechnicalAssistanceSelector = () => {
    const styling = {
        color: '#026FBD',
        '&.Mui-checked': {
            color: '#026FBD'
        }
    }
    return (
        Technical_Assistance.map((assistance, i) => (
            <FormControlLabel
                key={i + 1}
                value={assistance.value}
                control={<Radio sx={{ ...styling }} />}
                label={assistance.name}
            />
        ))
    )
}
export default TechnicalAssistanceSelector