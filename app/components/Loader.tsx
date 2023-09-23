'use client'

import { Box, CircularProgress, Typography } from '@mui/material'
import * as React from 'react'

interface SuspenseLoaderProps {
    text: string
    ignoreOptionalHeight: boolean
}

const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({ text, ignoreOptionalHeight }) => {
    return (
        <Box component='div' sx={{ display: 'flex', height: `calc(100vh - ${ignoreOptionalHeight ? '400px' : '0px'})`, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress color='inherit' size={20} sx={{ mb: 2 }} />
            <Typography variant='body2'>{text}</Typography>
        </Box>
    )
}
export default SuspenseLoader