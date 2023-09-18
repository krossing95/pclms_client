import { configureStore } from "@reduxjs/toolkit"
import dashboardReducer from "./dashboard/slice.dashboard"
import appReducer from "./app/slice.app"
import daysReducer from "./days_management/slice.days_management"
import equipmentReducer from "./equipment/slice.equipment"
import usersReducer from "./user_management/slice.user_management"

export const store = configureStore({
    reducer: {
        dashboardReducer,
        appReducer,
        daysReducer,
        equipmentReducer,
        usersReducer
    },
    devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch