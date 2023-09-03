'use client'

import { Paper } from '@mui/material'
import * as React from 'react'
import Draggable from 'react-draggable'

export default function MovablePrompt(props: any) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    )
}