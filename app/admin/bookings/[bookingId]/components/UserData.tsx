import Title from '@/app/utils/components/Title'
import { useAppSelector } from '@/redux/hooks'
import { AccountCircleOutlined, EmailOutlined, PhoneAndroidOutlined } from '@mui/icons-material'
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { useParams } from 'next/navigation'
import * as React from 'react'

const UserData = () => {
    const { bookingId } = useParams()
    const booking = useAppSelector(state => state.bookingsReducer.bookings).filter(booking => booking.id === (bookingId as string))?.[0]
    return (
        <React.Fragment>
            <Title text='User' variant_switch={true} />
            <List>
                <ListItem disablePadding sx={{ pb: 2 }}>
                    <ListItemIcon sx={{ pr: 2 }}>
                        <AccountCircleOutlined fontSize='small' />
                    </ListItemIcon>
                    <ListItemText secondary={`${booking.firstname} ${booking.lastname}`} />
                </ListItem>
                <ListItem disablePadding sx={{ pb: 2 }}>
                    <ListItemIcon sx={{ pr: 2 }}>
                        <EmailOutlined fontSize='small' />
                    </ListItemIcon>
                    <ListItemText secondary={booking.email} />
                </ListItem>
                <ListItem disablePadding sx={{ pb: 2 }}>
                    <ListItemIcon sx={{ pr: 2 }}>
                        <PhoneAndroidOutlined fontSize='small' />
                    </ListItemIcon>
                    <ListItemText secondary={booking.phone} />
                </ListItem>
            </List>
        </React.Fragment>
    )
}
export default UserData