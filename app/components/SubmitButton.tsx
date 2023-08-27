'use client'

import { Button, LinearProgress } from '@mui/material'
import { SubmitButtonClasses } from './types'
import * as React from 'react'

interface SubmitButtonProps {
    loading: boolean
    handleSubmit: () => void
    classes: SubmitButtonClasses
    icon: () => React.ReactElement
    design?: 'contained' | 'outlined' | 'text'
    text: string
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
    loading, handleSubmit, classes, icon: Icon, design, text
}) => {
    return (
        <Button
            onClick={handleSubmit} disabled={loading}
            variant={design}
            sx={{
                ...classes,
                background: classes.background,
                color: classes.color,
                padding: classes.padding,
                width: classes.width,
                marginBottom: classes.marginBottom,
                "&:hover": { background: classes.hoverBackground }
            }}
            startIcon={!loading ? <Icon /> : null}>
            {loading ? (
                <LinearProgress
                    color='inherit'
                    sx={{
                        width: classes.progressWidth,
                        alignItems: classes.progressAlignment
                    }}
                />
            ) : text}
        </Button>
    )
}
export default SubmitButton