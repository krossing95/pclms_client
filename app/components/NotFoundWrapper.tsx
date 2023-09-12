import * as React from "react"
import { Box, Typography } from "@mui/material"

interface NotFoundWrapperProps {
    children: React.ReactNode
}

const NotFoundWrapper: React.FC<NotFoundWrapperProps> = ({ children }) => {
    return (
        <Box component='div' sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: '100vh'
        }}>
            <img
                width={250}
                src="/images/page_nf.webp"
                alt="not found"
            />
            <br />
            <Typography sx={{ pb: 2 }} gutterBottom>{'Sorry, the requested resource could not be found'}</Typography>
            {children}
        </Box>
    )
}
export default NotFoundWrapper