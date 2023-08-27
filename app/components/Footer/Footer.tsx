import { Box, Typography } from '@mui/material'
import * as React from 'react'
import styles from './styles.module.css'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const Footer = () => {
    const location = usePathname()
    const year = (new Date()).getFullYear()
    return (
        <div className={styles.wrapper}>
            <Typography sx={{ pb: { xs: '15px', sm: '0px' } }} className='text' variant='body2'>Version 0.1.0-Beta</Typography>
            <Typography sx={{ pb: { xs: '15px', sm: '0px' } }} className='text' variant='body2'>&copy; {year} - All rights reserved</Typography>
            <Link className='ahref' href={location}>
                <img title="System logo" src='/images/logo.png' alt="System logo" width='75' />
            </Link>
            <Box sx={{ pt: { xs: '12px', sm: '0px' } }} component='a' title="See developer's page" className='ahref' target='_blank' href='https://xoese-kalenu.netlify.app/'>
                <img src='/images/devlogo.png' alt='Dev Graphic' width='120' />
            </Box>
        </div>
    )
}
export default Footer