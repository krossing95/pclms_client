import { useAppSelector } from '@/redux/hooks'
import { DateRangeOutlined, FiberManualRecord, QueryBuilderOutlined } from '@mui/icons-material'
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { useParams } from 'next/navigation'
import * as React from 'react'
import { Title } from '../../exports'
import useCustomMethods from '@/app/hooks/useCustomMethods'

const BookingData = () => {
    const { bookingId } = useParams()
    const booking = useAppSelector(state => state.bookingsReducer.bookings).filter(booking => booking.id === bookingId)?.[0]
    const useMethods = useCustomMethods()
    return (
        <React.Fragment>
            <Title text='Booking' variant_switch={false} />
            <List>
                <ListItem disablePadding sx={{ pb: 2 }}>
                    <ListItemIcon sx={{ pr: 2 }}>
                        <DateRangeOutlined fontSize='small' />
                    </ListItemIcon>
                    <ListItemText secondary={useMethods.dateConterter(booking.date, 'll')} />
                </ListItem>
                {booking.slots.map((slot, i) => (
                    <ListItem key={i + 1} disablePadding sx={{ pb: 2 }}>
                        <ListItemIcon sx={{ pr: 2 }}>
                            <QueryBuilderOutlined fontSize='small' />
                        </ListItemIcon>
                        <ListItemText secondary={slot} />
                    </ListItem>
                ))}
                <ListItem disablePadding sx={{ pb: 2 }}>
                    <ListItemIcon sx={{ pr: 2 }}>
                        {booking.status === 1 ? (
                            <FiberManualRecord sx={{ color: '#f1c40f', fontSize: '14px' }} />
                        ) : booking.status === 2 ? (
                            <FiberManualRecord sx={{ color: '#07bc0c', fontSize: '14px' }} />
                        ) : booking.status === 3 ? (
                            <FiberManualRecord sx={{ color: '#e74c3c', fontSize: '14px' }} />
                        ) : null}
                    </ListItemIcon>
                    <ListItemText secondary={booking.status === 1 ? 'Pending' : booking.status === 2 ? 'Approved' : booking.status === 3 ? 'Closed' : null} />
                </ListItem>
            </List>
        </React.Fragment>
    )
}
export default BookingData