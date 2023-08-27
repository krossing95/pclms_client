'use client'

import * as React from 'react'
import { Box, Typography, Container } from '@mui/material'
import { motion } from 'framer-motion'
import styles from '../styles.module.css'

interface AuthLayerProps {
    children: React.ReactNode
    header: string
    img: string
    alt: string
}

const AuthLayer: React.FC<AuthLayerProps> = ({ children, header, img, alt }) => {
    return (
        <React.Fragment>
            <Container sx={{ mb: '100px' }}>
                <Box component='div' sx={{ mt: '30px', pb: { xs: '50px', sm: '40px', md: '30px' } }}>
                    <img src='/images/logo.png' alt='App logo' width='90' style={{ cursor: 'pointer' }} />
                </Box>
                <Box component='div' sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                    <Box component='div' sx={{ mb: 2, maxWidth: { xs: '100%', md: '420px' } }}>
                        <Typography className={styles.login_header} gutterBottom sx={{ pb: 2 }} variant='h4'>{header}</Typography>
                        {children}
                    </Box>
                    <Box component='div' sx={{ display: { xs: 'none', md: 'block' } }}>
                        <motion.img style={{ width: '40vw' }} src={img} alt={alt}
                            initial={{ scale: 0.7, opacity: 0 }} animate={{
                                scale: 1, opacity: 1, transition: { duration: 1 }
                            }} whileHover={{
                                scale: 0.7, transition: { duration: 1 }
                            }}
                        />
                    </Box>
                </Box>
            </Container>
            {/* <Footer /> */}
        </React.Fragment>
    )
}
export default AuthLayer