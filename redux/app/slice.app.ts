import type { BlockDaysInterfaceStateManagement, EquipmentInterfaceStateManagement, UserManagementInterfaceStateManagement } from "@/app/types/type.app_management"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type AppDataState = {
    app: BlockDaysInterfaceStateManagement,
    equipment: EquipmentInterfaceStateManagement,
    users: UserManagementInterfaceStateManagement
}

const initialState = {
    app: {},
    equipment: {},
    users: {}
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
        }
    },
})

export const { SaveAppData, SaveEquipmentPageState, SaveUsersPageState } = app.actions
export default app.reducer