'use client'

import { Box, Pagination, Typography } from '@mui/material'
import * as React from 'react'
import styles from '../../styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { SuspenseLoader } from '../exports'
import get_comments from '@/app/actions/equipment/equipment.get_comments'
import { useParams } from 'next/navigation'
import { FetchComments } from '@/redux/equipment/comments/slice.comments'
import CommentList from './CommentList'
import CommentUpdate from './Prompts/CommentUpdate'
import CommentDelete from './Prompts/CommentDelete'
import Comment from './Prompts/Comment'

type EquipmentCommentsPageStates = {
    loading: boolean
    currentPage: number
    totalCount: number
    totalPages: number
}

const Comments = () => {
    const { equipmentId } = useParams()
    const dispatch = useAppDispatch()
    const comments = useAppSelector(state => state.commentsReducer.comments)
    const app = useAppSelector(state => state.appReducer.equipment)
    const [states, setStates] = React.useState<EquipmentCommentsPageStates>({
        currentPage: 1, totalPages: 0, totalCount: 0, loading: true
    })
    const getComments = async (page: number) => {
        try {
            const getComments = await get_comments({ page, equipment_id: equipmentId })
            if (parseInt(getComments.data?.code) !== 200) return false
            setStates(prev => ({ ...prev, loading: false }))
            const data = getComments.data?.data
            setStates(prev => ({
                ...prev,
                currentPage: data?.page_data?.currentPage,
                totalCount: data?.page_data?.totalCount,
                totalPages: data?.page_data?.totalPages
            }))
            dispatch(FetchComments([...data?.comments]))
        } catch (error) {
            console.log('Comments failed to load')
        }
    }
    React.useEffect(() => {
        getComments(states.currentPage) //eslint-disable-next-line
    }, [states.currentPage])
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setStates(prev => ({ ...prev, currentPage: value, loading: prev.currentPage !== value ? true : false }))
    }
    return (
        <Box component='div' sx={{ mt: 4 }}>
            <Box component='div'>
                {states.loading ? (
                    <SuspenseLoader text='Loading comments' ignoreOptionalHeight />
                ) : (
                    <React.Fragment>
                        {comments.length === 0 ? (
                            <Box component='div' className={styles.loadmoreContainer} sx={{ mt: 4 }}>
                                <Typography variant='body2' sx={{ fontWeight: 'bold' }}>No comments found</Typography>
                            </Box>
                        ) : (
                            <CommentList />
                        )}
                    </React.Fragment>
                )}
                <Box component='div' className={styles.loadmoreContainer} sx={{ mt: 4 }}>
                    {(!states.loading && comments.length > 0) ? (
                        <Pagination
                            count={states.totalPages}
                            page={states.currentPage}
                            onChange={handleChange}
                            sx={{ marginTop: '30px' }}
                        />
                    ) : null}
                </Box>
            </Box>
            {app.hasOpenedCommentEditPrompt ? (
                <CommentUpdate />
            ) : app.hasOpenedCommentDeletePrompt ? (
                <CommentDelete
                    paginate={(page: number, totalItem: number, totalPages: number) => setStates(prev => ({
                        ...prev,
                        currentPage: page,
                        totalCount: totalItem,
                        totalPages: totalPages
                    }))}
                />
            ) : app.hasOpenedEquipmentComment ? (
                <Comment
                    paginate={(page: number, totalItem: number, totalPages: number) => setStates(prev => ({
                        ...prev,
                        currentPage: page,
                        totalCount: totalItem,
                        totalPages: totalPages
                    }))}
                />
            ) : null}
        </Box>
    )
}
export default Comments