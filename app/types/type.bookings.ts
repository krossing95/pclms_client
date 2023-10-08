export type Booking = {
    id: string
    date: string
    slots: string[]
    need_assist: boolean
    status: number
    created_at?: string
    updated_at?: string
    firstname: string
    lastname: string
    email: string
    phone: string
    user_id: string
    name: string
    equipment_id: string
    photo_url?: string
    update_count: number
}