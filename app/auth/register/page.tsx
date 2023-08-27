'use client'

import TopSmImage from "../auth/components/TopSmImage"
import AuthLayer from "../auth/layout"
import { Box } from '@mui/material'
import Form from "./components/Form"

const RegisterForm = () => {
    return (
        <AuthLayer
            img='/images/hero_img.png' alt='Application logo'
            header='Join the community'
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