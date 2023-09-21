import * as React from "react"
import { Grid } from "@mui/material"
import { useAppSelector } from "@/redux/hooks"
import SingleComment from "./SingleComment"

const CommentList = () => {
    const comments = useAppSelector(state => state.commentsReducer.comments)
    return (
        <Grid container spacing={3}>
            {comments.map(comment => (
                <Grid key={comment.id} item xs={12} sm={6} md={4}>
                    <SingleComment comment={comment} />
                </Grid>
            ))}
        </Grid>
    )
}
export default CommentList