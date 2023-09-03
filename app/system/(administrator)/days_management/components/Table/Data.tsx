import { TableBody, TableCell, TableRow } from '@mui/material'
import * as React from 'react'
import moment from 'moment'
import styles from '../../styles.module.css'
import Activity from './Activity'
import { useAppSelector } from '@/redux/hooks'

const Data = () => {
    const blockedDays = useAppSelector(state => state.daysReducer.blocked_days)
    return (
        <TableBody>
            {blockedDays.map((day, i) => (
                <TableRow key={day.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell className={styles.tcell} align='right'>{i + 1}</TableCell>
                    <TableCell className={styles.tcell} align='right'>{day.name}</TableCell>
                    <TableCell className={styles.tcell} align='right'>{moment(day.date?.split('T')?.[0]).format('LL')}</TableCell>
                    <TableCell className={styles.tcell} align='right'>{moment(day.created_at?.split('T')?.[0]).format('ll')}</TableCell>
                    <TableCell className={styles.tcell} align='right'>{moment(day.updated_at?.split('T')?.[0]).format('ll')}</TableCell>
                    <TableCell align='right'>
                        <Activity id={day.id} />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}
export default Data