import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import * as React from 'react'
import { CalendarMonthOutlined, AutoStoriesOutlined, BlockOutlined, AccountCircleOutlined, VpnKeyOutlined, AssessmentOutlined } from '@mui/icons-material'
import { useAppSelector } from '@/redux/hooks'
import useCustomMethods from '@/app/hooks/useCustomMethods'

const DataDisplay = () => {
    const equipment = useAppSelector(state => state.equipmentReducer.equipment)?.[0]
    const useMethods = useCustomMethods()
    return (
        <Box component='div' sx={{ pl: { xs: '0px', md: '10px' }, mt: { xs: '20px', sm: '0px' } }}>
            <List>
                <ListItem disablePadding sx={{ pb: 2 }}>
                    <ListItemIcon>
                        <AccountCircleOutlined fontSize='small' />
                    </ListItemIcon>
                    <ListItemText secondary={`Created by ${equipment?.firstname || 'Anonymous'} ${equipment?.lastname || 'Anonymous'}`} />
                </ListItem>
                <ListItem disablePadding sx={{ pb: 2 }}>
                    <ListItemIcon>
                        <CalendarMonthOutlined fontSize='small' />
                    </ListItemIcon>
                    <ListItemText secondary={`Created on ${useMethods.dateConterter(`${equipment.created_at}`, 'll')}`} />
                </ListItem>
                <ListItem disablePadding sx={{ pb: 2 }}>
                    <ListItemIcon>
                        <CalendarMonthOutlined fontSize='small' />
                    </ListItemIcon>
                    <ListItemText secondary={`Last updated on ${useMethods.dateConterter(`${equipment.updated_at}`, 'll')}`} />
                </ListItem>
                <ListItem disablePadding sx={{ pb: 2 }}>
                    <ListItemIcon>
                        {equipment.functionality_status ? (
                            <AutoStoriesOutlined fontSize='small' />
                        ) : (
                            <BlockOutlined fontSize='small' />
                        )}
                    </ListItemIcon>
                    <ListItemText secondary={equipment.functionality_status ? 'Equipment is well functioning' : 'Equipment is not functioning'} />
                </ListItem>
                <ListItem disablePadding sx={{ pb: 2 }}>
                    <ListItemIcon>
                        {equipment.availability_status ? (
                            <AutoStoriesOutlined fontSize='small' />
                        ) : (
                            <BlockOutlined fontSize='small' />
                        )}
                    </ListItemIcon>
                    <ListItemText secondary={equipment.availability_status ? 'Equipment is available for booking' : 'Equipment is unavailable'} />
                </ListItem>
            </List>
        </Box>
    )
}
export default DataDisplay