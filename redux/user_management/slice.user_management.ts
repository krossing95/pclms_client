import type { User } from "@/app/types/type.users"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type UserDataState = {
    users: User[]
}
const initialState = { users: [] } as UserDataState

export const users = createSlice({
    name: "users",
    initialState,
    reducers: {
        FetchUsers: (state, action: PayloadAction<User[]>) => {
            state.users = [...action.payload]
        },
        UpdateUser: (state, action: PayloadAction<User>) => {
            const copiedList = [...state.users]
            const targetIndex = copiedList.findIndex(user => user.id === action.payload.id)
            copiedList[targetIndex] = {
                ...copiedList[targetIndex],
                firstname: action.payload.firstname,
                lastname: action.payload.lastname,
                email: action.payload.email,
                phone: action.payload.phone,
                usertype: action.payload.usertype,
                is_verified: action.payload.is_verified,
                updated_at: action.payload.updated_at
            }
            state.users = [...copiedList]
        }
    },
})

export const { FetchUsers, UpdateUser } = users.actions
export default users.reducer