import moment from 'moment-timezone'
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

    const dateConterter = (date: string, format: string) => {
        const timezone = moment.tz('Africa/Accra').zoneAbbr()
        const convertedDate = moment.tz(date, timezone)
        const formattedDate = convertedDate.format(format)
        return formattedDate
    }

    const dateInclusiveChecker = (dateToCheck: string, dateArray: string[]) => {
        const dateToCheckString = (new Date(dateToCheck)).toISOString().split('T')[0]
        for (const date of dateArray) {
            const dateArrayItemString = (new Date(date)).toISOString().split('T')[0]
            if (dateArrayItemString === dateToCheckString) return true
        }
        return false
    }

    return {
        preventCopyPaste, handleDateSelection, dateConterter, dateInclusiveChecker
    }
}
export default useCustomMethods