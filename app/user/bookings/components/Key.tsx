import * as React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import { FiberManualRecord } from '@mui/icons-material'
import styles from '../styles.module.css'


interface KeyItemProps {
    name: string
    styling?: string
}

export const KeyContainer = styled(Box)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
}))

export const KeyItem: React.FC<KeyItemProps> = ({ name, styling }) => (
    <React.Fragment>
        <FiberManualRecord
            fontSize='small'
            sx={{ fontSize: '12px', pr: 0.5 }}
            className={styling}
        />
        <Typography variant='body2'>{name}</Typography>
    </React.Fragment>
)

export default function BookingKeyRepresentation() {
    return (
        <Box component='div'>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
            >
                <KeyContainer>
                    <KeyItem name='Pending' styling={styles.pending} />
                </KeyContainer>
                <KeyContainer>
                    <KeyItem name='Approved' styling={styles.accepted} />
                </KeyContainer>
                <KeyContainer>
                    <KeyItem name='Closed' styling={styles.closed} />
                </KeyContainer>
            </Stack>
        </Box>
    )
}