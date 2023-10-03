import moment from 'moment-timezone'
import { DateSelectionTypes } from '../types/type.handleDateSelection'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const useCustomMethods = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

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

    const appendQueryParameter = (str: string, param_name: string) => {
        const existingQuery = new URLSearchParams(Array.from(searchParams.entries()))
        existingQuery.set(param_name, str)
        const queriesToString = existingQuery.toString()
        const query = queriesToString ? `?${queriesToString}` : ""
        router.replace(`${pathname}${query}`, { shallow: true })
    }

    const removeQueryParameter = (param_name: string) => {
        const existingQuery = new URLSearchParams(Array.from(searchParams.entries()))
        existingQuery.delete(param_name)
        router.replace(pathname, { shallow: true })
    }

    const checkQueryParameterExistence = (param_name: string) => {
        const existingQuery = new URLSearchParams(Array.from(searchParams.entries()))
        const value = existingQuery.get(param_name)
        if (!value) return false
        return true
    }

    const reArrangeItems = (array: string[]) => {
        const arrayObjects = array.map((value, index) => ({ value, index }))
        arrayObjects.sort((a, b) => a.value.localeCompare(b.value))
        const rearrangedArray = arrayObjects.map(item => item.value)
        return rearrangedArray
    }

    return {
        preventCopyPaste, handleDateSelection, dateConterter, dateInclusiveChecker,
        appendQueryParameter, removeQueryParameter, checkQueryParameterExistence,
        reArrangeItems
    }
}
export default useCustomMethods