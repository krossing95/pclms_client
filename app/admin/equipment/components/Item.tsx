import { FiberManualRecord, FiberManualRecordOutlined, LaunchOutlined } from '@mui/icons-material'
import { Box, Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton, Typography } from '@mui/material'
import * as React from 'react'
import styles from '../styles.module.css'
import { useRouter } from 'next/navigation'
import { Equipment } from '@/app/types/type.equipment'
import Cookies from 'js-cookie'

interface EquipmentItemProps {
    equipment: Equipment
}

const EquipmentItem: React.FC<EquipmentItemProps> = ({ equipment }) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const usertype: number = cookie?.usertype || 0
    const navigate = useRouter()
    const name_styling = {
        fontSize: '17px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    }
    const AvailabilityDisplayer = () => (
        <IconButton className={equipment.availability_status ? styles.isTrue : styles.isFalse}>
            <FiberManualRecordOutlined fontSize='small' />
        </IconButton>
    )
    return (
        <Card>
            <CardActionArea>
                <CardMedia component='img' height="140" image={!equipment.photo_url ? '/images/noimage.webp' : equipment.photo_url}
                    alt={equipment.name}
                />
                <CardContent>
                    <Typography
                        className={styles.text}
                        sx={{ ...name_styling }}
                        gutterBottom
                        variant='h6'>
                        {equipment.name}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <IconButton onClick={() => navigate.push(`/${usertype === 2 ? 'admin' : usertype === 1 ? 'user' : ''}/equipment/${equipment.id}`)}>
                    <LaunchOutlined fontSize='small' />
                </IconButton>
                <Box component='div'>
                    {usertype === Number(process.env.NEXT_PUBLIC_APP_USER) ? (
                        <AvailabilityDisplayer />
                    ) : usertype === Number(process.env.NEXT_PUBLIC_APP_ADMIN) ? (
                        <React.Fragment>
                            <IconButton className={equipment.functionality_status ? styles.isTrue : styles.isFalse}>
                                <FiberManualRecord fontSize='small' />
                            </IconButton>
                            <AvailabilityDisplayer />
                        </React.Fragment>
                    ) : null}
                </Box>
            </CardActions>
        </Card>
    )
}
export default EquipmentItem