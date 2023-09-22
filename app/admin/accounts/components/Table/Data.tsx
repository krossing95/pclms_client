import { TableBody, TableCell, TableRow } from '@mui/material'
import * as React from 'react'
import moment from 'moment'
import styles from '../../styles.module.css'
import Activity from './Activity'
import { useAppSelector } from '@/redux/hooks'
import useCustomMethods from '@/app/hooks/useCustomMethods'

const Data = () => {
    const users = useAppSelector(state => state.usersReducer.users)
    const useMethods = useCustomMethods()
    return (
        <TableBody>
            {users.map((user, i) => (
                <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell className={styles.tcell} align='right'>{i + 1}</TableCell>
                    <TableCell className={styles.tcell} align='right'>{user.firstname}</TableCell>
                    <TableCell className={styles.tcell} align='right'>{user.lastname}</TableCell>
                    <TableCell className={styles.tcell} align='right'>{user.email}</TableCell>
                    <TableCell className={styles.tcell} align='right'>{user.phone}</TableCell>
                    <TableCell className={styles.tcell} align='right'>
                        {
                            user.usertype === 2 ? 'Administrator' :
                                user.usertype === 1 ? 'Customer' : '-'
                        }
                    </TableCell>
                    <TableCell className={styles.tcell} align='right'>
                        {
                            user.is_verified ? 'Verified' :
                                user.is_verified ? 'Not verified' : '-'
                        }
                    </TableCell>
                    <TableCell className={styles.tcell} align='right'>{useMethods.dateConterter(`${user.created_at}`, 'll')}</TableCell>
                    <TableCell align='right'>
                        <Activity id={user.id} />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}
export default Data