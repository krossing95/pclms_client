import { TableCell, TableHead, TableRow } from '@mui/material'
import * as React from 'react'
import styles from '../../styles.module.css'


export default function Head() {
    const list = ['SNo', 'Equipment', 'Date', 'Slots', 'Need assist?', 'Status', 'Has attended', 'Activity']
    return (
        <TableHead>
            <TableRow>
                {list.map((item, i) => (
                    <TableCell className={styles.thead} align='right' key={i + 1}>{item}</TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}