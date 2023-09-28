import { Booking } from "@/app/types/type.bookings"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type BookingsDataState = {
    bookings: Booking[]
}
const initialState = { bookings: [] } as BookingsDataState

export const bookings = createSlice({
    name: "bookings",
    initialState,
    reducers: {
        FetchBookings: (state, action: PayloadAction<Booking[]>) => {
            state.bookings = [...action.payload]
        },
        SaveBooking: (state, action: PayloadAction<Booking>) => {
            state.bookings = [action.payload, ...state.bookings]
        },
        UpdateBooking: (state, action: PayloadAction<Booking>) => {
            const copiedList = [...state.bookings]
            const targetIndex = copiedList.findIndex(day => day.id === action.payload.id)
            copiedList[targetIndex] = { ...copiedList[targetIndex], date: action.payload.date, slots: action.payload.slots, need_assist: action.payload.need_assist, updated_at: action.payload.updated_at, status: action.payload.status }
            state.bookings = [...copiedList]
        }
    },
})

export const { FetchBookings, SaveBooking, UpdateBooking } = bookings.actions
export default bookings.reducer