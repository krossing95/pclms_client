import { Box, Button, Typography } from '@mui/material'
import * as React from 'react'

const RecycleBinPage = () => {
    return (
        <Box component='div' sx={{ display: 'flex', height: 'calc(100vh - 400px)', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Box component='div' sx={{ mb: 2 }}>
                <Typography
                    gutterBottom
                    variant='h6'
                    className='text'
                    sx={{ textAlign: 'center' }}
                >
                    {'Select a folder below to view corresponding hidden items'}
                </Typography>
            </Box>
            <Box>
                <Button>folder</Button>
                <Button>folder</Button>
            </Box>
        </Box>
    )
}
export default RecycleBinPage