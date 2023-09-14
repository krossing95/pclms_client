'use client'

import { Box } from '@mui/material'
import Form from "./components/Form"
import AuthLayer from '../components/AuthLayer'
import TopSmImage from '../components/TopSmImage'

const RegisterForm = () => {
    return (
        <AuthLayer
            img='/images/hero_img.png' alt='Application logo'
            header='Sign up'
        >
            <TopSmImage
                width='80vw' xs_display='block' md_display='none'
            />
            <Box sx={{ mb: 2 }} />
            <Form />
        </AuthLayer>
    )
}
export default RegisterForm