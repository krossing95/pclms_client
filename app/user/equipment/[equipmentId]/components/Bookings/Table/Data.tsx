import { TableBody, TableCell, TableRow } from '@mui/material'
import * as React from 'react'
import useCustomMethods from '@/app/hooks/useCustomMethods'
import type { UnavailableDays } from '@/app/types/type.unavailable_days'
import styles from '../styles.module.css'

interface UnavailableDaysDataProps {
    unavailable_days: UnavailableDays[]
}

const Data: React.FC<UnavailableDaysDataProps> = ({ unavailable_days }) => {
    const useMethods = useCustomMethods()
    return (
        <TableBody>
            {unavailable_days.map((day, i) => (
                <TableRow key={day.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell className={styles.tcell} align='right'>{i + 1}</TableCell>
                    <TableCell className={styles.tcell} align='right'>{useMethods.dateConterter(`${day.date}`, 'll')}</TableCell>
                    <TableCell className={styles.tcell} align='right'>{day.name}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}
export default Data