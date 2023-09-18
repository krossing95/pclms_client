export type EquipmentInterfaceStateManagement = {
    isSearchResultDisplayed: boolean
    hasOpenedSearchBoxPrompt: boolean
    hasOpenedDeleteEquipmentPrompt: boolean
    hasOpenedEditEquipmentPrompt: boolean
    hasOpenedCreateEquipmentPrompt: boolean
    hasOpenedEquipmentFilter: boolean
    isFilteredResultDispayed: boolean
    hasOpenedEquipmentReview: boolean
    hasOpenedEquipmentBooking: boolean
    hasOpenedEquipmentPhotoPreview: boolean
    selectedEquipmentId: string
    selectedEquipmentFile: string
    equipmentSearchQuery: string
    equipmentFilters: {
        functionality_status: boolean | null,
        availability_status: boolean | null
    }
}

export type BlockDaysInterfaceStateManagement = {
    isDaysSearchResultDisplayed: boolean
    hasOpenedSearchBoxPrompt: boolean
    hasOpenedDeleteDayPrompt: boolean
    hasOpenedEditDayPrompt: boolean
    hasOpenedCreateDayPrompt: boolean
    selectedDayId: string
    daySearchQuery: string
}

export type UserManagementInterfaceStateManagement = {
    isUserSearchResultDisplayed: boolean
    hasOpenedSearchBoxPrompt: boolean
    hasOpenedDeleteUserPrompt: boolean
    hasOpenedEditUserPrompt: boolean
    selectedUserId: string
    userSearchQuery: string
}