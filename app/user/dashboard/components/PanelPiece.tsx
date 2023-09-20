import * as React from 'react'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import styles from '../styles.module.css'

interface DashboardPanelProps {
    name: string
    figure: number
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({ figure, name }) => {
    return (
        <Grid item xs={12} sm={6} md={3}>
            <Card>
                <CardContent>
                    <Typography className={styles.text} gutterBottom variant='h6'>
                        {name}
                    </Typography>
                    <Typography color='text.secondary'>{figure}</Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}
export default DashboardPanel