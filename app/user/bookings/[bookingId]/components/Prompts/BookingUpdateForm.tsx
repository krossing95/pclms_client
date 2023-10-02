import * as React from 'react'
import { Autocomplete, Box, Grid, RadioGroup, TextField } from '@mui/material'
import { useParams } from 'next/navigation'
import InputField from '@/app/components/Input'
import useCustomMethods from '@/app/hooks/useCustomMethods'
import type { UnavailableDays } from '@/app/types/type.unavailable_days'
import MessageBox from '@/app/utils/components/MessageBox'
import get_slots from '@/app/actions/bookings/booking.get_slots'
import { Slots_Array } from '@/app/utils/statics'
import TechnicalAssistanceSelector from '@/app/utils/components/Selectors/TechnicalAssistanceSelector'
import { toast } from 'react-toastify'
import useValidations from '@/app/hooks/useValidations'
import moment from 'moment'
import { useAppSelector } from '@/redux/hooks'
import { SuspenseLoader } from '../../../exports'
import styles from '../../../styles.module.css'

type Slot = {
    id: number
    slot: string
}

interface BookingSystemStates {
    date: string
    slots: Slot[]
    availableSlots: Slot[]
    need_assist: string | number
    open: boolean
    message: string
    isErrorFree: boolean
    fetching_slots: boolean
}

interface BookingPageProps {
    unavailable_days: UnavailableDays[]
    daylist: UnavailableDays[]
    shouldSubmit: boolean
    setButtonLoader: (progress: boolean) => void
}

const BookingUpdateSystem: React.FC<BookingPageProps> = ({ unavailable_days, shouldSubmit, setButtonLoader, daylist }) => {
    const { bookingId } = useParams()
    const booking = useAppSelector(state => state.bookingsReducer.bookings).filter(booking => booking.id === bookingId)?.[0]
    const methodHooks = useCustomMethods()
    const validations = useValidations()
    const createSlotArray = (array: string[]) => {
        let slotArray: Slot[] = []
        Slots_Array.map(slot => {
            if (array.includes(slot.slot)) {
                slotArray = [...slotArray, { ...slot }]
            }
        })
        return slotArray
    }
    const [states, setStates] = React.useState<BookingSystemStates>({
        date: booking.date || '', slots: createSlotArray([...booking.slots]), need_assist: booking.need_assist ? '2' : '1', fetching_slots: false,
        open: false, isErrorFree: false, message: '',
        availableSlots: []
    })

    const handleDateSelection = (date: string) => {
        if (date.length === 0) return false
        const { status, message } = methodHooks.handleDateSelection(date)
        if (!status) return setStates(prev => ({ ...prev, message, open: true, isErrorFree: false, date: '', fetching_slots: false }))
        const datelist = daylist.map(date => date.date)
        const checkDateExistenceInUnavailableDays = methodHooks.dateInclusiveChecker(date, datelist)
        const correspondingUnavailableDay = daylist.filter(day => moment(day.date).isSame(moment(date)))?.[0]
        if (checkDateExistenceInUnavailableDays) return setStates(prev => ({ ...prev, message: `${correspondingUnavailableDay.name} is selected`, open: true, isErrorFree: false, date: '' }))
        setStates(prev => ({ ...prev, date, fetching_slots: true, message: '', open: false, isErrorFree: false }))
    }

    const getSlots = async () => {
        try {
            const getSlots = await get_slots({ date: states.date, equipment_id: booking.equipment_id })
            if (parseInt(getSlots.data?.code) !== 200) return setStates(prev => ({
                ...prev, date: '', fetching_slots: false, message: getSlots.data?.message,
                open: true, isErrorFree: false
            }))
            const unavailable_slots: string[] = getSlots.data?.data?.unavailable_slots
            const available_slots = Slots_Array.filter(value => !unavailable_slots.includes(value.slot))
            return setStates(prev => ({ ...prev, fetching_slots: false, availableSlots: [...available_slots] }))
        } catch (error) {
            return setStates(prev => ({
                ...prev,
                date: '',
                fetching_slots: false,
                message: 'Something went wrong', open: false,
                isErrorFree: false
            }))
        }
    }

    React.useEffect(() => {
        const speakWelcome = () => toast('Welcome to Our Booking Service')
        speakWelcome() // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        const takeSlots = () => {
            if (states.fetching_slots && states.date !== '') return getSlots()
        }
        takeSlots() // eslint-disable-next-line
    }, [states.date, states.fetching_slots])

    const handleBooking = async () => {
        // const data = {
        //     equipment_id: booking.equipment_id,
        //     date: states.date,
        //     need_assist: Number(states.need_assist),
        //     slots: states.slots.map(i => i.slot)
        // }
        // const params = {
        //     data,
        //     next: () => setButtonLoader(true)
        // }
        // const validate = validations.validateBooking({ ...params })
        // if (validate?.error !== undefined) return setStates(prev => ({ ...prev, message: validate?.error, open: true, isErrorFree: false }))
        // try {
        //     const book = await book_equipment({
        //         ...data,
        //         need_assist: data.need_assist === 2 ? true : false
        //     })
        //     setButtonLoader(false)
        //     if (parseInt(book.data?.code) !== 201) return setStates(prev => ({ ...prev, message: book.data?.message, open: true, isErrorFree: false }))
        //     return setStates(prev => ({ ...prev, message: book.data?.message, open: true, isErrorFree: true }))
        // } catch (error) {
        //     return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
        // }
    }

    React.useEffect(() => {
        const submitData = () => {
            if (!shouldSubmit) return false
            handleBooking()
        }
        submitData() // eslint-disable-next-line
    }, [shouldSubmit])

    return (
        <React.Fragment>
            <MessageBox
                open={states.open}
                message={states.message}
                isErrorFree={states.isErrorFree}
            />
            <Box component='div' sx={{ mt: 2 }} className={styles.loadmoreContainer}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} md={12} className={styles.input_container}>
                        <InputField
                            value={states.date} type='date'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => handleDateSelection((e.target as HTMLInputElement).value)}
                            classes={styles.input}
                            disabled={shouldSubmit}
                            placeholder='Select a date'
                        />
                    </Grid>
                    {states.fetching_slots ? (
                        <Grid item xs={12} className={styles.input_container}>
                            <SuspenseLoader
                                text='Loading available slots'
                                ignoreOptionalHeight
                            />
                        </Grid>
                    ) : (
                        <React.Fragment>
                            {states.date.length > 0 ? (
                                <React.Fragment>
                                    <Grid item xs={12} sm={6} md={12} sx={{ mt: 2 }}>
                                        <Autocomplete
                                            multiple
                                            value={states.slots}
                                            limitTags={1}
                                            onChange={(e, v) => setStates(prev => ({ ...prev, slots: v }))}
                                            id="multiple-limit-tags"
                                            options={states.availableSlots}
                                            getOptionLabel={(option) => option.slot}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Pick Slot" placeholder="Slots" />
                                            )}
                                            sx={{
                                                width: { xs: 260, sm: 285, md: 260 },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
                                        <RadioGroup value={states.need_assist} onChange={(e) => setStates(prev => ({ ...prev, need_assist: e.target.value }))} aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group" row>{<TechnicalAssistanceSelector />}</RadioGroup>
                                    </Grid>
                                </React.Fragment>
                            ) : null}
                        </React.Fragment>
                    )}
                </Grid>
            </Box>
        </React.Fragment>
    )
}
export default BookingUpdateSystem