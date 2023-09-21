import type { Comment } from "@/app/types/type.comments"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type EquipmentCommentsDataState = {
    comments: Comment[]
}
const initialState = { comments: [] } as EquipmentCommentsDataState

export const comments = createSlice({
    name: "comments",
    initialState,
    reducers: {
        FetchComments: (state, action: PayloadAction<Comment[]>) => {
            state.comments = [...action.payload]
        },
        SaveComment: (state, action: PayloadAction<Comment>) => {
            state.comments = [action.payload, ...state.comments]
        },
        UpdateComment: (state, action: PayloadAction<Comment>) => {
            const copiedList = [...state.comments]
            const targetIndex = copiedList.findIndex(comment => comment.id === action.payload.id)
            copiedList[targetIndex] = { ...action.payload }
            state.comments = [...copiedList]
        }
    },
})

export const { FetchComments, SaveComment, UpdateComment } = comments.actions
export default comments.reducer