'use client'

import * as React from 'react'
import { Card, CardContent, Typography, Box, Alert } from '@mui/material'
import styles from '../styles.module.css'
import { motion } from 'framer-motion'
import { useAppSelector } from '@/redux/hooks'
import useCustomMethods from '@/app/hooks/useCustomMethods'
import Tools from './Tools'

interface ProfileCardStates {
    open: boolean
    title: string
}

const ProfileCard = () => {
    const methodHooks = useCustomMethods()
    const user = useAppSelector(state => state.usersReducer.users)?.[0]
    const [states, setStates] = React.useState<ProfileCardStates>({ open: false, title: '' })
    const handleClick = (title: string) => {
        setStates(prev => ({ ...prev, open: true, title }))
        window.scrollTo(0, 0)
    }
    return (
        <Card>
            {states.open ? (
                <motion.div
                    initial={{ opacity: 0 }} animate={{
                        opacity: 1, transition: { duration: 1 }
                    }}
                >
                    <Alert icon={false} onClose={() => setStates(prev => ({ ...prev, open: false, title: '' }))} severity="success">{states.title}</Alert>
                </motion.div>
            ) : null}
            <CardContent>
                <Box className={styles.container}>
                    <Box className={styles.userImage}>
                        <img src="/images/user.webp" alt="this image contains user-image" />
                    </Box>
                </Box>
                <Box component='div' className={styles.contentBox}>
                    <Typography gutterBottom className={styles.profilename} variant='h6'>{`${user.firstname} ${user.lastname}`}</Typography>
                    <Typography className={styles.profilename}>{`Became a member, since ${methodHooks.dateConterter(`${user?.created_at}`, 'll')}`}</Typography>
                </Box>
                <Box component='div' className={styles.toolbar}>
                    <Tools handleClick={handleClick} />
                </Box>
            </CardContent>
        </Card>
    )
}
export default ProfileCard