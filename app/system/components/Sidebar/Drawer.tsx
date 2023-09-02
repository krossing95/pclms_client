import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import * as React from 'react'
import { AccountCircleOutlined, CalendarMonthOutlined, DashboardOutlined, FavoriteBorderOutlined, HomeRepairServiceOutlined, LogoutOutlined, MenuBookOutlined, PeopleAltOutlined } from '@mui/icons-material'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import get_cookie from '@/app/actions/cookies/cookie.get'
import remove_cookie from '@/app/actions/cookies/cookie.delete'
import Cookies from 'js-cookie'

interface DrawerProps {
    auto_close: () => void
}

const SideBarDrawer = React.forwardRef<() => void, DrawerProps>((props, ref) => {
    const router = useRouter()
    const pathname = usePathname()
    const cookies = Cookies.get('__signedInUserObj')
    const cookieOfInterest = cookies !== undefined ? cookies : '{}'
    const cookieObj = JSON.parse(cookieOfInterest)?.user

    const handleRoute = (route: string) => router.push(`/${route}`)
    const handleSignOut = async () => {
        await remove_cookie({ cookie_name: '__signedInUserObj' })
        return handleRoute('/auth/register')
    }
    React.useEffect(() => {
        props.auto_close() // eslint-disable-next-line
    }, [pathname])
    return (
        <div>
            <Box component='div' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1.1 }}>
                <Link className='ahref' href={pathname}>
                    <img src='/images/logo.png' alt='System logo' width='75' />
                </Link>
            </Box>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleRoute('dashboard')}>
                        <ListItemIcon>
                            <DashboardOutlined />
                        </ListItemIcon>
                        <ListItemText primary='Dashboard' />
                    </ListItemButton>
                </ListItem>
                {cookieObj?.usertype === Number(process.env.NEXT_PUBLIC_APP_ADMIN) ? (
                    <React.Fragment>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleRoute('users')}>
                                <ListItemIcon>
                                    <PeopleAltOutlined />
                                </ListItemIcon>
                                <ListItemText primary='Accounts' />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleRoute('days_management')}>
                                <ListItemIcon>
                                    <CalendarMonthOutlined />
                                </ListItemIcon>
                                <ListItemText primary='Days Management' />
                            </ListItemButton>
                        </ListItem>
                    </React.Fragment>
                ) : null}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleRoute(cookieObj?.usertype === Number(process.env.NEXT_PUBLIC_APP_ADMIN) ? 'equipment' : 'equipment-list')}>
                        <ListItemIcon>
                            <HomeRepairServiceOutlined />
                        </ListItemIcon>
                        <ListItemText primary='Equipment' />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleRoute(cookieObj?.usertype === Number(process.env.NEXT_PUBLIC_APP_ADMIN) ? 'a/bookings' : 'u/bookings')}>
                        <ListItemIcon>
                            <MenuBookOutlined />
                        </ListItemIcon>
                        <ListItemText primary='Bookings' />
                    </ListItemButton>
                </ListItem>
                {cookieObj?.usertype === Number(process.env.NEXT_PUBLIC_APP_USER) ? (
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleRoute('favorites')}>
                            <ListItemIcon>
                                <FavoriteBorderOutlined />
                            </ListItemIcon>
                            <ListItemText primary='Favorites' />
                        </ListItemButton>
                    </ListItem>
                ) : null}
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleRoute('my-profile')}>
                        <ListItemIcon>
                            <AccountCircleOutlined />
                        </ListItemIcon>
                        <ListItemText primary='Profile' />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleSignOut}>
                        <ListItemIcon>
                            <LogoutOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Sign Out'} />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    )
})
SideBarDrawer.displayName = 'SideBarDrawer'
export default SideBarDrawer