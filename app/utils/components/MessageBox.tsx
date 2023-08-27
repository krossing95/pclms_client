'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Alert } from '@mui/material'

interface MessageBoxProps {
    open: boolean
    isErrorFree: boolean
    message: string
}

const MessageBox: React.FC<MessageBoxProps> = ({ open, isErrorFree, message }) => (
    <React.Fragment>
        {open ? (
            <motion.div style={{ paddingBottom: '20px', zIndex: 99999 }} initial={{ opacity: 0.1 }} animate={{ opacity: 1 }}>
                <Alert color={!isErrorFree ? 'error' : 'success'}>{message}</Alert>
            </motion.div>
        ) : null}
    </React.Fragment>
)
export default MessageBox