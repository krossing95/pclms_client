import { Box, Grid } from '@mui/material'
import * as React from 'react'
import { motion } from 'framer-motion'
import EmptyList from '@/app/utils/components/EmptyList'
import { useAppSelector } from '@/redux/hooks'
import EquipmentItem from './Item'

const EquipmentList = () => {
    const equipment = useAppSelector(state => state.equipmentReducer.equipment)
    return (
        <Box component='div'>
            {equipment.length === 0 ? (
                <EmptyList />
            ) : (
                <React.Fragment>
                    {/* <KeyRepresentation /> */}
                    <Grid container sx={{ mt: 2 }} spacing={1}>
                        {equipment.map((item, i) => (
                            <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{
                                        opacity: 1, transition: { duration: 1 }
                                    }}
                                >
                                    <EquipmentItem equipment={item} />
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </React.Fragment>
            )}
        </Box>
    )
}
export default EquipmentList