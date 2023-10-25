import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import { DateRangeOutlined } from "@mui/icons-material"
import { useParams } from "next/navigation"
import { useAppSelector } from "@/redux/hooks"
import useCustomMethods from "@/app/hooks/useCustomMethods"

export default function Requirement() {
    const { bookingId } = useParams()
    const useMethods = useCustomMethods()
    const booking = useAppSelector(state => state.bookingsReducer.bookings).filter(booking => booking.id === (bookingId as string))?.[0]
    return (
        <Box component='div'>
            <List sx={{ mt: 4 }}>
                <ListItem disablePadding sx={{ pb: 2 }}>
                    <ListItemIcon sx={{ pr: 2 }}>
                        <DateRangeOutlined fontSize='small' />
                    </ListItemIcon>
                    <ListItemText secondary={`Booked on ${useMethods.dateConterter(`${booking?.created_at}`, 'll')}`} />
                </ListItem>
                <ListItem disablePadding sx={{ pb: 2 }}>
                    <ListItemIcon sx={{ pr: 2 }}>
                        <DateRangeOutlined fontSize='small' />
                    </ListItemIcon>
                    <ListItemText secondary={`Updated on ${useMethods.dateConterter(`${booking?.updated_at}`, 'll')}`} />
                </ListItem>
                <ListItem disablePadding sx={{ pb: 2 }}>
                    <ListItemText secondary={`Technical assistance is ${booking.need_assist === true ? 'required' : 'not required'}`} />
                </ListItem>
            </List>
        </Box>
    )
}