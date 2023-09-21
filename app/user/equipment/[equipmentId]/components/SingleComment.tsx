import * as React from 'react'
import { styled } from '@mui/material/styles'
import { Avatar, Card, CardHeader, CardContent, CardActions, Collapse, IconButton, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import moment from 'moment'
import { DeleteSweepOutlined, ModeEditOutlineOutlined } from '@mui/icons-material'
import type { Comment } from '@/app/types/type.comments'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import styles from '../../styles.module.css'
import Cookies from 'js-cookie'
import { SaveEquipmentPageState } from '@/redux/app/slice.app'

interface SingleCommentProps {
    comment: Comment
}

interface SingleCommentStates {
    expanded: boolean
}

const SingleComment: React.FC<SingleCommentProps> = ({ comment }) => {
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const ExpandMore = styled((props: any) => {
        const { expand, ...other } = props
        return <IconButton {...other} />
    })(({ theme, expand }) => ({
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)', marginLeft: 'auto',
        transition: theme.transitions.create('transform', { duration: theme.transitions.duration.shortest, })
    }))
    const dispatch = useAppDispatch()
    const app = useAppSelector(state => state.appReducer.equipment)
    const [states, setStates] = React.useState<SingleCommentStates>({ expanded: false })

    const handleExpandClick = () => setStates(prev => ({ ...prev, expanded: !prev.expanded }))
    return (
        <Card>
            <CardHeader avatar={<Avatar sx={{ bgcolor: '#026FBD' }} aria-label="equipment_review">
                {comment.firstname[0] || 'U'}
            </Avatar>}
                title={`${comment.firstname} ${comment.lastname}`}
                subheader={moment(comment.updated_at?.split('T')?.[0]).format('ll')}
            />
            {!states.expanded ? (
                <CardContent>
                    <Typography sx={{ lineHeight: '33px' }} variant="body2" color="text.secondary">{comment.comment.length > 50 ? `${comment.comment.slice(0, 50)}...` : comment.comment}</Typography>
                </CardContent>
            ) : null}
            <CardActions disableSpacing>
                {(cookie?.usertype === Number(process.env.NEXT_PUBLIC_APP_ADMIN) || cookie?.user_id === comment.id) ? (
                    <IconButton className={styles.activity_remove} onClick={() => dispatch(SaveEquipmentPageState({ ...app, hasOpenedCommentDeletePrompt: true, selectedCommentId: comment.id }))}>
                        <DeleteSweepOutlined />
                    </IconButton>
                ) : null}
                {cookie?.user_id === comment.id ? (
                    <IconButton className={styles.activity_edit} onClick={() => dispatch(SaveEquipmentPageState({ ...app, hasOpenedCommentEditPrompt: true, selectedCommentId: comment.id }))}>
                        <ModeEditOutlineOutlined />
                    </IconButton>
                ) : null}
                {comment.comment.length > 50 ? (
                    <ExpandMore expand={states.expanded} onClick={handleExpandClick} aria-expanded={states.expanded} aria-label="show more">
                        <ExpandMoreIcon />
                    </ExpandMore>
                ) : null}
            </CardActions>
            <Collapse in={states.expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography sx={{ lineHeight: '37px' }} color="text.secondary" variant="body2" paragraph>{comment.comment}</Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
}
export default SingleComment