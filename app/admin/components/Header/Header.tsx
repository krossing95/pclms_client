'use client'

import * as React from 'react'
import { MenuOutlined } from '@mui/icons-material'
import { AppBar, Box, Container, IconButton, Toolbar } from '@mui/material'
import styles from './styles.module.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Sidebar from '../Sidebar/Sidebar'
import Footer from '@/app/components/Footer/Footer'

interface AppHeaderProps {
    children: React.ReactNode
}
type AppHeaderControllerStates = {
    openBar: boolean
}

const AppHeader: React.FC<AppHeaderProps> = ({ children }) => {
    const [states, setStates] = React.useState<AppHeaderControllerStates>({ openBar: false })
    const handleBarToggling = () => setStates(prev => ({ ...prev, openBar: !prev.openBar }))
    const pathname = usePathname()
    return (
        <React.Fragment>
            <AppBar className={styles.topbar} elevation={1}>
                <Box component='div' className={styles.topItemHolder}>
                    <Link className='ahref' href={pathname} as={pathname}>
                        <img src="/images/logo.png" alt="System logo" width='75' />
                    </Link>
                    <IconButton onClick={handleBarToggling} className={styles.menuButton}>
                        <MenuOutlined />
                    </IconButton>
                </Box>
                <Sidebar
                    status={states.openBar}
                    close_request={handleBarToggling}
                    ref={handleBarToggling}
                />
            </AppBar>
            <Toolbar />
            <Container sx={{ mb: '100px', mt: { xs: '60px', md: '40px' } }}>
                {children}
            </Container>
            <Footer />
        </React.Fragment>
    )
}
export default AppHeader