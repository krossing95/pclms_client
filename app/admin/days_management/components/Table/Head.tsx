import { TableCell, TableHead, TableRow } from '@mui/material'
import * as React from 'react'
import styles from '../../styles.module.css'

export default function Head() {
    const list = ['SNo', 'Title', 'Date', 'Created at', 'Updated at', 'Activity']
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