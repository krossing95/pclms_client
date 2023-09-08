'use client'

import { Equipment } from '@/app/types/type.equipment'
import * as React from 'react'
import { Box, Grid } from '@mui/material'
import styles from '../../styles.module.css'

interface Props {
    equipment: Equipment
}

const EquipmentPage: React.FC<Props> = ({ equipment }) => {
    return (
        <React.Fragment>
            <Box component='div' className={styles.header}>
                <h1>{equipment.name}</h1>
                {/* <Title text={equipment.name} variant_switch={true} /> */}
                {/* <Box component='div' className={styles.toolbar}>
                        {cookies?.__signedInUserObj?.usertype === Number(import.meta.env.VITE_ELIGIBLE_ADMIN) ? (
                            <React.Fragment>
                                <IconButton onClick={() => dispatch(SetAppState({ ...app, equipment_edit: true }))}>
                                    <ModeEditOutlined />
                                </IconButton>
                                <IconButton onClick={() => fileRef.current.click()}>
                                    <UploadFileOutlined />
                                </IconButton>
                                <IconButton onClick={() => dispatch(SetAppState({ ...app, equipment_remove: true }))}>
                                    <DeleteSweepOutlined />
                                </IconButton>
                            </React.Fragment>
                        ) : cookies?.__signedInUserObj?.usertype === Number(import.meta.env.VITE_ELIGIBLE_USER) ? (
                            <React.Fragment>
                                <Save />
                                <Tooltip title='Review and Comment'>
                                    <IconButton onClick={() => dispatch(SetAppState({ ...app, equipment_review: true }))}>
                                        <StarBorderPurple500Outlined />
                                    </IconButton>
                                </Tooltip>
                                {equipment.availability_status ? (
                                    <Tooltip title='Make Reservation'>
                                        <IconButton onClick={() => dispatch(SetAppState({ ...app, equipment_book: true }))}>
                                            <BookmarksOutlined />
                                        </IconButton>
                                    </Tooltip>
                                ) : null}
                            </React.Fragment>
                        ) : null}
                    </Box> */}
            </Box>
            <Box component='div'>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <img className={styles.image} src={equipment.photo_url ? equipment.photo_url : '/images/'} alt={equipment.name} style={{ width: '40vw' }} />
                        </Box>
                        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <img className={styles.image} src={equipment.photo_url ? equipment.photo_url : '/images/noimage.webp'} alt={equipment.name} style={{ width: '90vw' }} />
                        </Box>
                    </Grid>
                    sdfdasdas
                    {/* <Grid item xs={12} sm={6}>
                            <DataDisplay />
                        </Grid> */}
                </Grid>
                {/* <Texts />
                    <EquipmentReviews /> */}
            </Box>
        </React.Fragment>
    )
}
export default EquipmentPage