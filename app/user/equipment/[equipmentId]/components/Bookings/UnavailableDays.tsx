import type { UnavailableDays } from '@/app/types/type.unavailable_days'
import { Box, TableContainer, Table, Typography } from '@mui/material'
import * as React from 'react'
import { motion } from 'framer-motion'
import Head from './Table/Head'
import Data from './Table/Data'
import { EmptyList } from '../../../exports'
import styles from './styles.module.css'

interface UnavailableDaysPageProps {
    unavailable_days: UnavailableDays[]
}

const UnavailableDaysPage: React.FC<UnavailableDaysPageProps> = ({ unavailable_days }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{
                opacity: 1, transition: { duration: 1 }
            }}
        >
            {unavailable_days.length > 0 ? (
                <React.Fragment>
                    <Typography gutterBottom>{"The following dates cannot be booked"}</Typography>
                    <TableContainer component='div'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <Head />
                            <Data unavailable_days={unavailable_days} />
                        </Table>
                    </TableContainer>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Box component='div' sx={{ display: { xs: 'none', md: 'block' } }}>
                        <EmptyList />
                    </Box>
                    <Box component='div' className={styles.loadmoreContainer} sx={{ mt: 1 }}>
                        <Typography variant='overline' gutterBottom>{"Unavailable days appear here"}</Typography>
                    </Box>
                </React.Fragment>
            )}
        </motion.div>
    )
}
export default UnavailableDaysPage