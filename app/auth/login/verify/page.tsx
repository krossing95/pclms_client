'use client'

import TopSmImage from '@/app/auth/components/TopSmImage'
import React from 'react'
import { Box } from '@mui/material'
import AuthLayer from '../../components/AuthLayer'
import VerificationForm from '../../register/verify/components/VerificationForm'

const Verify = () => {
    return (
        <AuthLayer
            img='/images/hero_img.png' alt='Application logo'
            header='User Verification'
        >
            <TopSmImage
                width='80vw' xs_display='block' md_display='none'
            />
            <Box sx={{ mb: 2 }} />
            <VerificationForm page='sign-in' />
        </AuthLayer>
    )
}

export default Verify