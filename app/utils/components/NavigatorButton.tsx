import { NavigationOutlined, ArrowCircleLeftOutlined, ArrowCircleRightOutlined } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import * as React from 'react'


interface NavigatorButtonProps {
    destination: string
    direction: 'forward' | 'backward' | undefined
    reason?: string
    styling?: {
        backgroundColor: '#000000',
        color: '#F9FAFB',
        mt: 2,
        "&:hover": {
            backgroundColor: '#026FBD !important'
        }
    }
}

const NavigatorButton: React.FC<NavigatorButtonProps> = ({ destination, direction, styling, reason }) => {
    const router = useRouter()
    return (
        <Box component='div' sx={{ mt: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {typeof reason !== 'undefined' ? (
                <Typography gutterBottom paragraph>{reason}</Typography>
            ) : null}
            <IconButton sx={{ ...styling }} onClick={() => router.push(destination)}>
                {direction === 'forward' ? (
                    <ArrowCircleRightOutlined />
                ) : direction === 'backward' ? (
                    <ArrowCircleLeftOutlined />
                ) : (
                    <NavigationOutlined />
                )}
            </IconButton>
        </Box>
    )
}
export default NavigatorButton