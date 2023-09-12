import * as React from 'react'
import { Grid, Typography } from '@mui/material'
import { useAppSelector } from '@/redux/hooks'
import Title from '@/app/utils/components/Title'

const Texts = () => {
    const equipment = useAppSelector(state => state.equipmentReducer.equipment)?.[0]
    const checkErrorLength = equipment.system_error?.trim()?.length || 0
    return (
        <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={12} md={checkErrorLength > 0 ? 6 : 12}>
                <Title text='Description' variant_switch={true} />
                <Typography variant='body2' sx={{ lineHeight: '37px', textAlign: 'justify' }}>{equipment.description}</Typography>
            </Grid>
            {checkErrorLength > 0 ? (
                <Grid item xs={12} sm={12} md={checkErrorLength ? 6 : 12}>
                    <Title text='System errors' variant_switch={true} />
                    <Typography variant='body2' sx={{ lineHeight: '37px', textAlign: 'justify' }}>{equipment.system_error}</Typography>
                </Grid>
            ) : null}
        </Grid>
    )
}
export default Texts