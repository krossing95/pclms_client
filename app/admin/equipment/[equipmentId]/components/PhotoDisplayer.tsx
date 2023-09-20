import * as React from 'react'
import { Box } from '@mui/material'
import styles from '../../styles.module.css'
import type { Equipment } from '@/app/types/type.equipment'

interface PhotoDisplayerProps {
    equipment: Equipment
}

const PhotoDisplayer: React.FC<PhotoDisplayerProps> = ({ equipment }) => {
    return (
        <React.Fragment>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <img
                    className={styles.image}
                    src={equipment.photo_url ?
                        equipment.photo_url :
                        '/images/noimage.webp'}
                    alt={equipment.name}
                    style={{ width: '40vw' }}
                />
            </Box>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <img
                    className={styles.image}
                    src={equipment.photo_url ?
                        equipment.photo_url :
                        '/images/noimage.webp'}
                    alt={equipment.name}
                    style={{ width: '90vw' }}
                />
            </Box>
        </React.Fragment>
    )
}
export default PhotoDisplayer