import { useAppSelector } from '@/redux/hooks'
import { AccountCircleOutlined, EmailOutlined, PhoneOutlined, VerifiedOutlined } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import * as React from 'react'

interface ToolsProp {
    handleClick: (title: string) => void
}

const Tools: React.FC<ToolsProp> = ({ handleClick }) => {
    const user = useAppSelector(state => state.usersReducer.users)?.[0]
    return (
        <React.Fragment>
            <IconButton onClick={() => handleClick(user.email)}>
                <EmailOutlined />
            </IconButton>
            <IconButton onClick={() => handleClick(`Phone number is ${user.phone}`)}>
                <PhoneOutlined />
            </IconButton>
            <IconButton onClick={() => handleClick(user.verified === 2 ? "You're a verified LMS user" : 'LMS account is not verified')}>
                <VerifiedOutlined />
            </IconButton>
            <IconButton onClick={() => handleClick(user.usertype === 2 ? 'You are an administrator' : 'You are a normal system user')}>
                <AccountCircleOutlined />
            </IconButton>
        </React.Fragment>
    )
}
export default Tools