'use client'

import * as React from 'react'
import useCustomMethods from '../hooks/useCustomMethods'

interface InputFieldProps {
    value: string
    type?: 'text' | 'password' | 'email'
    onChange: (e: React.FormEvent<HTMLInputElement>) => void
    classes: string
    placeholder: string
    disabled: boolean
    preventCopyPaste?: (e: React.FormEvent<HTMLInputElement>) => boolean
}

const InputField: React.FC<InputFieldProps> = ({ value, type, onChange, classes,
    placeholder, disabled, preventCopyPaste }) => {
    return (
        <input
            value={value} type={type}
            onChange={onChange}
            className={classes}
            placeholder={placeholder}
            disabled={disabled}
            onPaste={preventCopyPaste}
            onCopy={preventCopyPaste}
        />
    )
}
export default InputField