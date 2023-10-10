import { DeleteForeverOutlined, RestoreFromTrashOutlined } from '@mui/icons-material'
import { Box, Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton, Tooltip, Typography } from '@mui/material'
import * as React from 'react'
import styles from '@/app/admin/equipment/styles.module.css'
import { Equipment } from '@/app/types/type.equipment'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { SaveEquipmentPageState } from '@/redux/app/slice.app'

interface HiddenEquipmentItemProps {
    equipment: Equipment
}

const Item: React.FC<HiddenEquipmentItemProps> = ({ equipment }) => {
    const app = useAppSelector(state => state.appReducer.equipment)
    const dispatch = useAppDispatch()
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
                <Box component='div' className={styles.toolbar}>
                    <Tooltip title='Restore equipment'>
                        <IconButton onClick={() => dispatch(SaveEquipmentPageState({ ...app, hasOpenedRetrieveHiddenEquipmentPrompt: true, selectedEquipmentId: equipment.id }))}>
                            <RestoreFromTrashOutlined sx={{ fontSize: '18px' }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Delete equipment'>
                        <IconButton>
                            <DeleteForeverOutlined sx={{ fontSize: '18px' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardActions>
        </Card>
    )
}
export default Item