import { TableBody, TableCell, TableRow } from '@mui/material'
import * as React from 'react'
import styles from '../../styles.module.css'
import { useAppSelector } from '@/redux/hooks'
import useCustomMethods from '@/app/hooks/useCustomMethods'
import { FiberManualRecord } from '@mui/icons-material'

const Data = () => {
    const bookings = useAppSelector(state => state.bookingsReducer.bookings)
    const useMethods = useCustomMethods()
    return (
        <TableBody>
            {bookings.map((booking, i) => (
                <TableRow key={booking.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell className={styles.tcell} align='right'>{i + 1}</TableCell>
                    <TableCell className={styles.tcell} align='right'>{booking.name}</TableCell>
                    <TableCell className={styles.tcell} align='right'>{useMethods.dateConterter(`${booking.date}`, 'll')}</TableCell>
                    <TableCell className={styles.tcell} align='right'>{booking.slots.length}</TableCell>
                    <TableCell className={styles.tcell} align='right'>
                        {booking.need_assist ? 'Yes' : 'No'}
                    </TableCell>
                    <TableCell className={styles.tcell} align='right'>
                        {booking.status === 1 ? (
                            <FiberManualRecord fontSize='small' sx={{ color: '#f1c40f', fontSize: '12px' }} />
                        ) : booking.status === 2 ? (
                            <FiberManualRecord fontSize='small' sx={{ color: '#07bc0c', fontSize: '12px' }} />
                        ) : booking.status === 3 ? (
                            <FiberManualRecord fontSize='small' sx={{ color: '#e74c3c', fontSize: '12px' }} />
                        ) : null}
                    </TableCell>
                    <TableCell className={styles.tcell} align='right'>{useMethods.dateConterter(`${booking.updated_at}`, 'll')}</TableCell>
                    <TableCell align='right'>
                        {/* <Activity id={day.id} /> */}
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}
export default Data