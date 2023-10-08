'use client'

import { Box } from '@mui/material'
import AuthLayer from '../components/AuthLayer'
import TopSmImage from '../components/TopSmImage'
import Form from './components/Form'

const PasswordResetPage = () => {
    return (
        <AuthLayer
            img='/images/hero_img.png' alt='Application logo'
            header='Forgot password'
        >
            <TopSmImage
                width='80vw' xs_display='block' md_display='none'
            />
            <Box sx={{ mb: 2 }} />
            <Form />
        </AuthLayer>
    )
}
export default PasswordResetPage