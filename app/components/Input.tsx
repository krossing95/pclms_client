'use client'

import * as React from 'react'

interface InputFieldProps {
    value: string
    type?: 'text' | 'password' | 'email' | 'date'
    onChange: (e: React.FormEvent<HTMLInputElement>) => void
    classes: string
    placeholder: string
    disabled: boolean
    preventCopyPaste?: (e: React.FormEvent<HTMLInputElement>) => boolean
    readOnly?: boolean
}

const InputField: React.FC<InputFieldProps> = ({ value, type, onChange, classes,
    placeholder, disabled, preventCopyPaste, readOnly }) => {
    return (
        <input
            value={value} type={type}
            onChange={onChange}
            className={classes}
            placeholder={placeholder}
            disabled={disabled}
            onPaste={preventCopyPaste}
            onCopy={preventCopyPaste}
            readOnly={readOnly}
        />
    )
}
export default InputField