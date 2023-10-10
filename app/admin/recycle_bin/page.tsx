import * as React from 'react'
import { Box, Typography } from '@mui/material'
import FolderButtonPage from './components/ButtonsPage'

const RecycleBinPage = () => {
    return (
        <Box component='div' sx={{ display: 'flex', height: 'calc(100vh - 400px)', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Box component='div' sx={{ mb: '40px' }}>
                <Typography
                    gutterBottom
                    variant='h6'
                    className='text'
                    sx={{ textAlign: 'center' }}
                >
                    {'Select a folder below to view corresponding hidden items'}
                </Typography>
            </Box>
            <FolderButtonPage />
        </Box>
    )
}
export default RecycleBinPage