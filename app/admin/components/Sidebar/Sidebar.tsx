'use client'

import { Drawer } from '@mui/material'
import * as React from 'react'
import SideBarDrawer from './Drawer'
import Cookies from 'js-cookie'

interface SidebarProps {
    status?: boolean
    close_request: () => void
}

const Sidebar = React.forwardRef<() => void, SidebarProps>((props, ref) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)
    const pos = !cookie ? 'right' : cookie?.__app
    return (
        <Drawer anchor={pos}
            variant="temporary" open={props?.status}
            onClose={props.close_request} ModalProps={{
                keepMounted: true
            }}
            sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 } }}
        >
            <SideBarDrawer
                auto_close={props.close_request}
                ref={props.close_request}
                {...props}
            />
        </Drawer>
    )
})
Sidebar.displayName = 'Sidebar'
export default Sidebar