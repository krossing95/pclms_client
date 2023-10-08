export type UserDashboard = {
    available_equipment: number
    unavailable_equipment: number
    closed_bookings: number
    approved_bookings: number
    pending_bookings: number
    saved_equipment: number
    unsaved_equipment: number
}

export type AdminDashboard = {
    available_equipment: number
    unavailable_equipment: number
    recyclable_equipment: number
    pending_bookings: number
    approved_bookings: number
    administrators: number
    non_administrators: number
    blocked_users: number
}