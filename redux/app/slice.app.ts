import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type AppDataState = {
    app: {
        isDaysSearchResultDisplayed: boolean
        hasOpenedSearchBoxPrompt: boolean
        hasOpenedDeleteDayPrompt: boolean
        hasOpenedEditDayPrompt: boolean
        hasOpenedCreateDayPrompt: boolean
        selectedDayId: string
    },
    equipment: {
        isSearchResultDisplayed: boolean
        hasOpenedSearchBoxPrompt: boolean
        hasOpenedDeleteEquipmentPrompt: boolean
        hasOpenedEditEquipmentPrompt: boolean
        hasOpenedCreateEquipmentPrompt: boolean
        hasOpenedEquipmentFilter: boolean
        isFilteredResultDispayed: boolean
        selectedEquipmentId: string
    }
}

const initialState = {
    app: {},
    equipment: {}
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
        }
    },
})

export const { SaveAppData, SaveEquipmentPageState } = app.actions
export default app.reducer