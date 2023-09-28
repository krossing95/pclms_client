import React from "react"
import { KeyContainer, KeyItem, KeyItemProps } from "../bookings/components/Key"
import styles from "./styles.module.css"
import { Stack, Typography, Box } from "@mui/material"
import { FiberManualRecordOutlined } from "@mui/icons-material"

interface TextfulItemProps {
    styling?: string
    leftText?: string
    rightText?: string
}

export const TextfulItem: React.FC<TextfulItemProps> = ({ styling, leftText, rightText }) => (
    <React.Fragment>
        <Typography variant='body2' className={styling}>{leftText}</Typography>
        <Typography variant='body2'>{rightText}</Typography>
    </React.Fragment>
)

export const AvailabilityKeyItem: React.FC<KeyItemProps> = ({ name, styling }) => (
    <React.Fragment>
        <FiberManualRecordOutlined
            fontSize='small'
            sx={{ fontSize: '12px', pr: 0.5 }}
            className={styling}
        />
        <Typography variant='body2'>{name}</Typography>
    </React.Fragment>
)

export default function EquipmentKeyRepresentation() {
    return (
        <Box component='div'>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
            >
                <KeyContainer>
                    <KeyItem name='Functionality status' />
                </KeyContainer>
                <KeyContainer>
                    <AvailabilityKeyItem
                        name="Availability status"
                    />
                </KeyContainer>
            </Stack>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
            >
                <KeyContainer>
                    <TextfulItem
                        styling={styles.isTrue}
                        leftText="Green"
                        rightText="Operational or available"
                    />
                </KeyContainer>
                <KeyContainer>
                    <TextfulItem
                        styling={styles.isFalse}
                        leftText="Blue"
                        rightText="Inoperable or Unavailable"
                    />
                </KeyContainer>
            </Stack>
        </Box>
    )
}