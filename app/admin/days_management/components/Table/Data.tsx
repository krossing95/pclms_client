import { TableBody, TableCell, TableRow } from '@mui/material'
import * as React from 'react'
import styles from '../../styles.module.css'
import Activity from './Activity'
import { useAppSelector } from '@/redux/hooks'
import useCustomMethods from '@/app/hooks/useCustomMethods'

const Data = () => {
    const blockedDays = useAppSelector(state => state.daysReducer.blocked_days)
    const useMethods = useCustomMethods()
    return (
        <TableBody>
            {blockedDays.map((day, i) => (
                <TableRow key={day.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell className={styles.tcell} align='right'>{i + 1}</TableCell>
                    <TableCell className={styles.tcell} align='right'>{day.name}</TableCell>
                    <TableCell className={styles.tcell} align='right'>{useMethods.dateConterter(`${day.date}`, 'LL')}</TableCell>
                    <TableCell className={styles.tcell} align='right'>{useMethods.dateConterter(`${day.created_at}`, 'll')}</TableCell>
                    <TableCell className={styles.tcell} align='right'>{useMethods.dateConterter(`${day.updated_at}`, 'll')}</TableCell>
                    <TableCell align='right'>
                        <Activity id={day.id} />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}
export default Data