'use client'

import { Equipment } from '@/app/types/type.equipment'
import * as React from 'react'
import { Box, Grid, IconButton, Tooltip } from '@mui/material'
import styles from '../../styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { FetchEquipment } from '@/redux/equipment/slice.equipment'
import { BookmarksOutlined, StarBorderPurple500Outlined } from '@mui/icons-material'
import { SaveEquipmentPageState } from '@/redux/app/slice.app'
import { Title, SuspenseLoader, PhotoDisplayer, Texts, DataDisplay } from '../exports'

interface SingleEquipmentStates {
    file: string
    loading: boolean
}
interface SingleEquipmentPageProps {
    data: Equipment
}

const EquipmentPage: React.FC<SingleEquipmentPageProps> = ({ data }) => {
    const [states, setStates] = React.useState<SingleEquipmentStates>({
        file: '', loading: true
    })
    const dispatch = useAppDispatch()
    const app = useAppSelector(state => state.appReducer.equipment)
    const equipment = useAppSelector(state => state.equipmentReducer.equipment)?.[0]
    React.useEffect(() => {
        const getData = () => {
            dispatch(FetchEquipment([data]))
            setStates(prev => ({ ...prev, loading: false }))
        }
        getData() // eslint-disable-next-line
    }, [])

    return (
        <Box component='div'>
            <React.Fragment>
                {states.loading ? (
                    <SuspenseLoader text='Loading equipment' issueOptionalHeight={true} />
                ) : (
                    <React.Fragment>
                        {typeof equipment?.id !== 'undefined' ? (
                            <React.Fragment>
                                <Box component='div' className={styles.header}>
                                    <Title text={equipment.name} variant_switch={false} />
                                    <Box component='div' className={styles.toolbar}>
                                        <React.Fragment>
                                            {/* <Save /> */}
                                            <Tooltip title='Review and Comment'>
                                                <IconButton onClick={() => dispatch(SaveEquipmentPageState({ ...app, hasOpenedEquipmentReview: true }))}>
                                                    <StarBorderPurple500Outlined />
                                                </IconButton>
                                            </Tooltip>
                                            {equipment.availability_status ? (
                                                <Tooltip title='Make Reservation'>
                                                    <IconButton onClick={() => dispatch(SaveEquipmentPageState({ ...app, hasOpenedEquipmentBooking: true }))}>
                                                        <BookmarksOutlined />
                                                    </IconButton>
                                                </Tooltip>
                                            ) :
                                                null}
                                        </React.Fragment>
                                    </Box>
                                </Box>
                                <Box component='div'>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={6}>
                                            <PhotoDisplayer equipment={equipment} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <DataDisplay />
                                        </Grid>
                                    </Grid>
                                    <Texts />
                                    {/* <EquipmentReviews /> */}
                                </Box>
                            </React.Fragment>
                        ) : null}
                    </React.Fragment>
                )}
            </React.Fragment>
        </Box>
    )
}
export default EquipmentPage