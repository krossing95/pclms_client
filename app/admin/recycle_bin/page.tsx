import { Box, Typography } from '@mui/material'
import * as React from 'react'

const RecycleBinPage = () => {
    return (
        <Box component='div' sx={{ display: 'flex', height: 'calc(100vh - 400px)', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Box component='div'>
                <Typography gutterBottom variant='h6'>{'Select a folder below to view corresponding hidden items'}</Typography>
            </Box>
        </Box>
    )
}
export default RecycleBinPage