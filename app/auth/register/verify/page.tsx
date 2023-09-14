'use client'

import TopSmImage from '@/app/auth/components/TopSmImage'
import React from 'react'
import { Box } from '@mui/material'
import VerificationForm from './components/VerificationForm'
import AuthLayer from '../../components/AuthLayer'

const Verify = () => {
    return (
        <AuthLayer
            img='/images/hero_img.png' alt='Application logo'
            header='Account Verification'
        >
            <TopSmImage
                width='80vw' xs_display='block' md_display='none'
            />
            <Box sx={{ mb: 2 }} />
            <VerificationForm page='sign-up' />
        </AuthLayer>
    )
}

export default Verify