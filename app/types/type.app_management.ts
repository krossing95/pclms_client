export type EquipmentInterfaceStateManagement = {
    isSearchResultDisplayed: boolean
    hasOpenedSearchBoxPrompt: boolean
    hasOpenedDeleteEquipmentPrompt: boolean
    hasOpenedEditEquipmentPrompt: boolean
    hasOpenedCreateEquipmentPrompt: boolean
    hasOpenedEquipmentFilter: boolean
    isFilteredResultDispayed: boolean
    hasOpenedEquipmentComment: boolean
    hasOpenedEquipmentPhotoPreview: boolean
    selectedEquipmentId: string
    selectedEquipmentFile: string
    equipmentSearchQuery: string
    equipmentFilters: {
        functionality_status: boolean | null,
        availability_status: boolean | null
    }
    hasOpenedCommentDeletePrompt: boolean
    hasOpenedCommentEditPrompt: boolean
    selectedCommentId: string
    hasOpenedBookingPrompt: boolean
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

export type BookingListManagementInterfaceStateManagement = {
    isBookingSearchResultDisplayed: boolean
    hasOpenedSearchBoxPrompt: boolean
    hasOpenedDeleteBookingPrompt: boolean
    hasOpenedEditBookingPrompt: boolean
    hasOpenedCreateBookingPrompt: boolean
    selectedBookingId: string
    bookingSearchQuery: string
}