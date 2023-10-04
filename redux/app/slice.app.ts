import type { BlockDaysInterfaceStateManagement, BookingListManagementInterfaceStateManagement, EquipmentInterfaceStateManagement, FavoriteListInterfaceStateManagement, UserManagementInterfaceStateManagement } from "@/app/types/type.app_management"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type AppDataState = {
    app: BlockDaysInterfaceStateManagement,
    equipment: EquipmentInterfaceStateManagement,
    users: UserManagementInterfaceStateManagement,
    bookings: BookingListManagementInterfaceStateManagement,
    favorites: FavoriteListInterfaceStateManagement
}

const initialState = {
    app: {},
    equipment: {},
    users: {},
    bookings: {},
    favorites: {}
} as AppDataState

export const app = createSlice({
    name: "app",
    initialState,
    reducers: {
        SaveAppData: (state, action: PayloadAction<{}>) => {
            state.app = { ...state.app, ...action.payload }
        },
        SaveEquipmentPageState: (state, action: PayloadAction<{}>) => {
            state.equipment = { ...state.equipment, ...action.payload }
        },
        SaveUsersPageState: (state, action: PayloadAction<{}>) => {
            state.users = { ...state.users, ...action.payload }
        },
        SaveBookingsPageState: (state, action: PayloadAction<{}>) => {
            state.bookings = { ...state.bookings, ...action.payload }
        },
        SaveFavoritesPageState: (state, action: PayloadAction<{}>) => {
            state.favorites = { ...state.favorites, ...action.payload }
        }
    },
})

export const { SaveAppData, SaveEquipmentPageState, SaveUsersPageState, SaveBookingsPageState, SaveFavoritesPageState } = app.actions
export default app.reducer