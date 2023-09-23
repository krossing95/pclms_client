import type { UnavailableDays } from '@/app/types/type.unavailable_days'
import { TableContainer, Table } from '@mui/material'
import * as React from 'react'
import { motion } from 'framer-motion'
import Head from './Table/Head'
import Data from './Table/Data'

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
            <TableContainer component='div' sx={{ overflowX: '-moz-hidden-unscrollable' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <Head />
                    <Data unavailable_days={unavailable_days} />
                </Table>
            </TableContainer>
        </motion.div>
    )
}
export default UnavailableDaysPage