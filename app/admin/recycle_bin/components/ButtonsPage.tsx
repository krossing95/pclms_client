'use client'

import * as React from "react"
import { Box, Button, Typography } from "@mui/material"
import { useRouter } from "next/navigation"

const FolderButtonPage = () => {
    const router = useRouter()
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', mr: '30px' }}>
                <Button onClick={() => router.push('/admin/recycle_bin/equipment')}>
                    <img src='/images/folder.webp' alt='Folder graphics' width={50} height={50} />
                </Button>
                <Typography variant="body2">{"Equipment"}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <Button onClick={() => router.push('/admin/recycle_bin/bookings')}>
                    <img src='/images/folder.webp' alt='Folder graphics' width={50} height={50} />
                </Button>
                <Typography variant="body2">{"Bookings"}</Typography>
            </Box>
        </Box>
    )
}
export default FolderButtonPage