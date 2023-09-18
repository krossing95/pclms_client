'use client'

import { User_Status } from "../../statics"
import { FormControlLabel, Radio } from "@mui/material"

const UserStatusSelector = () => {
    const styling = {
        color: '#026FBD',
        '&.Mui-checked': {
            color: '#026FBD'
        }
    }
    return (
        User_Status.map((status, i) => (
            <FormControlLabel
                key={i + 1}
                value={status.value}
                control={<Radio sx={{ ...styling }} />}
                label={status.name}
            />
        ))
    )
}
export default UserStatusSelector