import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type AppDataState = {
    app: {
        isDaysSearchResultDisplayed: boolean
        hasOpenedSearchBoxPrompt: boolean
        hasOpenedDeleteDayPrompt: boolean
        hasOpenedEditDayPrompt: boolean
        hasOpenedCreateDayPrompt: boolean
    }
}

const initialState = {
    app: {},
} as AppDataState

export const app = createSlice({
    name: "app",
    initialState,
    reducers: {
        SaveAppData: (state, action: PayloadAction<{}>) => {
            state.app = { ...state.app, ...action.payload }
        }
    },
})

export const { SaveAppData } = app.actions
export default app.reducer