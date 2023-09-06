import { Equipment } from "@/app/types/type.equipment"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type EquipmentDataState = {
    equipment: Equipment[]
}
const initialState = { equipment: [] } as EquipmentDataState

export const equipment = createSlice({
    name: "equipment",
    initialState,
    reducers: {
        FetchEquipment: (state, action: PayloadAction<Equipment[]>) => {
            state.equipment = [...action.payload]
        },
        SaveEquipment: (state, action: PayloadAction<Equipment>) => {
            state.equipment = [action.payload, ...state.equipment]
        },
        UpdateEquipment: (state, action: PayloadAction<Equipment>) => {
            const copiedList = [...state.equipment]
            const targetIndex = copiedList.findIndex(equipment => equipment.id === action.payload.id)
            copiedList[targetIndex] = { ...action.payload }
            state.equipment = [...copiedList]
        }
    },
})

export const { FetchEquipment, SaveEquipment, UpdateEquipment } = equipment.actions
export default equipment.reducer