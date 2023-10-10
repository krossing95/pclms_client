import { DeleteForeverOutlined, RestoreFromTrashOutlined } from '@mui/icons-material'
import { Box, Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton, Typography } from '@mui/material'
import * as React from 'react'
import styles from '@/app/admin/equipment/styles.module.css'
import { Equipment } from '@/app/types/type.equipment'

interface HiddenEquipmentItemProps {
    equipment: Equipment
}

const Item: React.FC<HiddenEquipmentItemProps> = ({ equipment }) => {
    const name_styling = {
        fontSize: '17px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    }
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
                <Box component='div' sx={{ flexGrow: 1 }}>
                    <IconButton>
                        <RestoreFromTrashOutlined sx={{ fontSize: '15px' }} />
                    </IconButton>
                    <IconButton>
                        <DeleteForeverOutlined sx={{ fontSize: '15px' }} />
                    </IconButton>
                </Box>
            </CardActions>
        </Card>
    )
}
export default Item