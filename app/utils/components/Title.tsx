import { Box, Typography } from '@mui/material'
import * as React from 'react'
import { motion } from 'framer-motion'

interface TitleProps {
    text: string
    variant_switch: boolean
}

export default function Title({ text, variant_switch }: TitleProps) {
    return (
        <Box component='div' sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', mb: 4 }}>
            <Typography className='text' variant={variant_switch ? 'h6' : 'h4'}>{text}</Typography>
            <motion.div className='underliner'
                initial={{ width: '0px' }} animate={{ width: '50px', transition: { duration: 1 } }}
            />
        </Box>
    )
}