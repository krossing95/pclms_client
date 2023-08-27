'use client'

import { Box } from '@mui/material'
import * as React from 'react'
import { motion } from 'framer-motion'

interface TopSmImageProps {
    width: string
    xs_display: string
    md_display: string
}

const TopSmImage: React.FC<TopSmImageProps> = ({ width, xs_display, md_display }) => {
    return (
        <Box component='div' sx={{ display: { xs: xs_display, md: md_display } }}>
            <motion.img src='/images/hero_img.png' style={{ width: width, height: 'auto', margin: 'auto', display: 'block' }}
                alt='Application Register Graphics'
                initial={{ scale: 0.7, opacity: 0 }} animate={{
                    scale: 1, opacity: 1, transition: { duration: 1 }
                }} whileHover={{
                    scale: 0.7, transition: { duration: 1 }
                }}
            />
        </Box>
    )
}
export default TopSmImage