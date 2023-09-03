import { Day } from "@/app/types/type.days"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type DaysDataState = {
    blocked_days: Day[]
}
const initialState = { blocked_days: [] } as DaysDataState

export const blocked_days = createSlice({
    name: "blocked_days",
    initialState,
    reducers: {
        FetchDays: (state, action: PayloadAction<Day[]>) => {
            state.blocked_days = [...action.payload]
        },
        UpdateDay: (state, action: PayloadAction<Day>) => {
            const copiedList = [...state.blocked_days]
            const targetIndex = copiedList.findIndex(day => day.id === action.payload.id)
            copiedList[targetIndex] = { ...copiedList[targetIndex], name: action.payload.name, date: action.payload.date, updated_at: action.payload.updated_at }
            state.blocked_days = [...copiedList]
        }
    },
})

export const { FetchDays, UpdateDay } = blocked_days.actions
export default blocked_days.reducer