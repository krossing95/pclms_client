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
    hasOpenedPermanentDeletePrompt: boolean
    hasOpenedRetrieveHiddenEquipmentPrompt: boolean
}

export type FavoriteListInterfaceStateManagement = {
    isSearchResultDisplayed: boolean
    hasOpenedSearchBoxPrompt: boolean
    hasOpenedFavoritesFilter: boolean
    isFilteredResultDispayed: boolean
    selectedFavoriteId: string
    favoriteSearchQuery: string
    favoriteFilters: {
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

export type BookingListManagementInterfaceStateManagement = {
    isBookingSearchResultDisplayed: boolean
    hasOpenedSearchBoxPrompt: boolean
    hasOpenedDeleteBookingPrompt: boolean
    hasOpenedEditBookingPrompt: boolean
    hasOpenedCreateBookingPrompt: boolean
    selectedBookingId: string
    bookingSearchQuery: string
    hasOpenedBookingApprovalPrompt: boolean
    hasOpenedBookingCancelPrompt: boolean
    hasOpenedBookingEditPrompt: boolean
    hasOpenedBookingFilterPrompt: boolean
    isFilteredResultDispayed: boolean
    bookingFilters: {
        to: string,
        from: string
        status: number | null
    }
}