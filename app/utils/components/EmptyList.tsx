import { Box } from '@mui/material'
import { motion } from 'framer-motion'

export default function EmptyList() {
    return (
        <Box component='div' sx={{ display: 'flex', height: 'calc(100vh - 400px)', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <motion.img src='/images/nodata.svg' alt='No records found' width='250'
                initial={{ scale: 0.7, opacity: 0 }} animate={{
                    scale: 1, opacity: 1, transition: { duration: 1 }
                }} whileHover={{
                    scale: 0.7, transition: { duration: 1 }
                }}
            />
        </Box>
    )
}