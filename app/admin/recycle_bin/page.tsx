import { Box, Button, Tooltip, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import * as React from 'react'

const RecycleBinPage = () => {
    const router = useRouter()
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
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Button onClick={() => router.push('/recycle_bin/equipment')}>
                        <img src='/images/folder.webp' alt='Folder graphics' width={50} height={50} />
                    </Button>
                    <Typography>{"Equipment folder"}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Button onClick={() => router.push('/recycle_bin/bookings')}>
                        <img src='/images/folder.webp' alt='Folder graphics' width={50} height={50} />
                    </Button>
                    <Typography>{"Bookings folder"}</Typography>
                </Box>
            </Box>
        </Box>
    )
}
export default RecycleBinPage