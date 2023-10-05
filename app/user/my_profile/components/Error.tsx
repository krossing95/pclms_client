import { Box, Typography } from '@mui/material'
import * as React from 'react'
import styles from '../styles.module.css'

interface ErrorLoadingProp {
    children: React.ReactNode
}

const ErrorLoading: React.FC<ErrorLoadingProp> = ({ children }) => {
    return (
        <Box component='div' className={styles.profileLoadingErr}>
            <img src='/images/nf.png' width='100' alt='Error loading page' />
            <Typography paragraph variant='body2' gutterBottom>
                {`Something went wrong. Page could not be setup. Kindly click on the
                button below to retry`}
            </Typography>
            {children}
        </Box>
    )
}
export default ErrorLoading