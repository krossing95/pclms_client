import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type DashboardDataState = {
    statistics: {}
}

const initialState = {
    statistics: {},
} as DashboardDataState

export const dashboard = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        SaveDashboardData: (state, action: PayloadAction<{}>) => {
            state.statistics = { ...action.payload }
        }
    },
})

export const {
    SaveDashboardData,
} = dashboard.actions
export default dashboard.reducer
