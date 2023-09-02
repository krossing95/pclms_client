import { configureStore } from "@reduxjs/toolkit"
import dashboardReducer from "./dashboard/slice.dashboard"

export const store = configureStore({
    reducer: {
        dashboardReducer
    },
    devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch