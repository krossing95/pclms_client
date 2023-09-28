export const register_meta = {
    title: 'Register | PCLMS - Laboratory Management System',
    description: 'Sign up to the platform to elevate your research career'
}
export const login_meta = {
    title: 'Login | PCLMS - Laboratory Management System',
    description: 'Sign into the platform to elevate your research career'
}
export const verify_meta = {
    title: 'User Verification | PCLMS - Laboratory Management System',
    description: 'Sign up to the platform to elevate your research career'
}
export const dashboard_meta = {
    title: 'Dashboard | PCLMS - Laboratory Management System',
    description: 'Sign up to the platform to elevate your research career'
}
export const days_mgt_meta = {
    title: 'Blocked Days Management | PCLMS - Laboratory Management System',
    description: 'Sign up to the platform to elevate your research career'
}
export const equipment_meta = {
    title: 'Lab Equipment | PCLMS - Laboratory Management System',
    description: 'Sign up to the platform to elevate your research career'
}
export const accounts_meta = {
    title: 'User Management | PCLMS - Laboratory Management System',
    description: 'Sign up to the platform to elevate your research career'
}
export const bookings_meta = {
    title: 'Bookings | PCLMS - Laboratory Management System',
    description: 'Sign up to the platform to elevate your research career'
}
export const Regex = {
    PASSWORD: new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,100}$/), //eslint-disable-line
    ALPHANUMERIC: new RegExp(/^([a-zA-Z0-9 _-]+)$/), //eslint-disable-line
    EMAIL: new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/), //eslint-disable-line
    NUMERIC: new RegExp(/^[0-9]+$/), //eslint-disable-line
    MONGODB: new RegExp(/^[0-9a-fA-F]{24}$/), //eslint-disable-line
    ALPHA: new RegExp(/^[a-zA-Z ]*$/), //eslint-disable-line
    SPECIALCHARS: new RegExp(/\W|_/g), //eslint-disable-line
    CSVDOT_HYPHEN: /^[a-zA-Z0-9 .,-]{0,150}$/ //eslint-disable-line
}
export const Functionality_Status = [
    { value: 1, name: 'Malfunctioning' },
    { value: 2, name: 'Functioning' }
]
export const Availability_Status = [
    { value: 1, name: 'Unavailable' },
    { value: 2, name: 'Available' }
]
export const User_Status = [
    { value: 1, name: 'Customer' },
    { value: 2, name: 'Admin' },
    { value: 3, name: 'Blocked' }
]
export const Technical_Assistance = [
    { value: 1, name: 'I do not need technical assistance' },
    { value: 2, name: 'I need technical assistance' }
]
export const Slots_Array = [
    { id: 1, slot: '8:00am-8:30am' }, { id: 2, slot: '8:30am-9:00am' },
    { id: 3, slot: '9:00am-9:30am' }, { id: 4, slot: '9:30am-10:00am' },
    { id: 5, slot: '10:00am-10:30am' }, { id: 6, slot: '10:30am-11:00am' },
    { id: 7, slot: '11:00am-11:30am' }, { id: 8, slot: '11:30am-12:00pm' },
    { id: 9, slot: '12:00pm-12:30pm' }, { id: 10, slot: '12:30pm-1:00pm' },
    { id: 11, slot: '1:00pm-1:30pm' }, { id: 12, slot: '1:30pm-2:00pm' },
    { id: 13, slot: '2:00pm-2:30pm' }, { id: 14, slot: '2:30pm-3:00pm' },
    { id: 15, slot: '3:00pm-3:30pm' }, { id: 16, slot: '3:30pm-4:00pm' },
    { id: 17, slot: '4:00pm-4:30pm' }, { id: 18, slot: '4:30pm-5:00pm' }
]
export const SelectableFiles = ['image/jpg', 'image/png', 'image/jpeg', 'image/webp']
export const SelectableFilesToBase64 = ['data:image/png;base64', 'data:image/jpeg;base64', 'data:image/jpg;base64', 'data:image/webp;base64']