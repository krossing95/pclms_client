import moment from 'moment'
import { DateSelectionTypes } from '../types/type.handleDateSelection'

const useCustomMethods = () => {
    const preventCopyPaste = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault()
        return false
    }

    const handleDateSelection = (date: string) => {
        const data: DateSelectionTypes = {
            status: false,
            message: ''
        }
        if (moment(date).isBefore(moment(new Date()))) return {
            ...data, message: 'Cannot select a past date'
        }
        const selectedDay = moment(date).day()
        if ((selectedDay === 6) || (selectedDay === 0)) return {
            ...data, message: 'Cannot select a weekend'
        }
        return { ...data, status: true }
    }

    return {
        preventCopyPaste, handleDateSelection
    }
}
export default useCustomMethods