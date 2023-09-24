import * as React from 'react'
import { Autocomplete, Box, Grid, RadioGroup, TextField } from '@mui/material'
import styles from './styles.module.css'
import { useParams } from 'next/navigation'
import InputField from '@/app/components/Input'
import useCustomMethods from '@/app/hooks/useCustomMethods'
import type { UnavailableDays } from '@/app/types/type.unavailable_days'
import MessageBox from '@/app/utils/components/MessageBox'
import { SuspenseLoader } from '../../exports'
import get_slots from '@/app/actions/bookings/booking.get_slots'
import { Slots_Array } from '@/app/utils/statics'
import TechnicalAssistanceSelector from '@/app/utils/components/Selectors/TechnicalAssistanceSelector'

type Slot = {
    id: number
    slot: string
}

interface BookingSystemStates {
    date: string
    slots: Slot[]
    availableSlots: Slot[]
    need_assist: string | number
    loading: boolean
    open: boolean
    message: string
    isErrorFree: boolean
    fetching_slots: boolean
}

interface BookingPageProps {
    unavailable_days: UnavailableDays[]
    shouldSubmit: boolean
    setButtonLoader: (progress: boolean) => void
}

const BookingSystem: React.FC<BookingPageProps> = ({ unavailable_days, shouldSubmit, setButtonLoader }) => {
    const { equipmentId } = useParams()
    const methodHooks = useCustomMethods()
    const [states, setStates] = React.useState<BookingSystemStates>({
        date: '', slots: [], need_assist: '', fetching_slots: false,
        loading: false, open: false, isErrorFree: false, message: '',
        availableSlots: []
    })

    const handleDateSelection = (date: string) => {
        const { status, message } = methodHooks.handleDateSelection(date)
        if (!status) return setStates(prev => ({ ...prev, message, open: true, isErrorFree: false, date: '', fetching_slots: false }))
        const datelist = unavailable_days.map(date => date.date)
        const checkDateExistenceInUnavailableDays = methodHooks.dateInclusiveChecker(date, datelist)
        if (checkDateExistenceInUnavailableDays) return setStates(prev => ({ ...prev, message: 'Selected date cannot be booked', open: true, isErrorFree: false, date: '' }))
        setStates(prev => ({ ...prev, date, fetching_slots: true, message: '', open: false, isErrorFree: false }))
    }

    const getSlots = async () => {
        try {
            const getSlots = await get_slots({ date: states.date, equipment_id: equipmentId })
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
        const takeSlots = () => {
            if (states.fetching_slots && states.date !== '') return getSlots()
        }
        takeSlots() // eslint-disable-next-line
    }, [states.date, states.fetching_slots])

    const handleBooking = async () => {
        console.log('form submiited');
        setButtonLoader(false)
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
            <Box component='div' className={styles.loadmoreContainer}>
                <Grid container spacing={1}>
                    <Grid item xs={12} className={styles.input_container}>
                        <InputField
                            value={states.date} type='date'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => handleDateSelection((e.target as HTMLInputElement).value)}
                            classes={styles.input}
                            disabled={states.loading}
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
                                    <Grid item xs={12} sm={6} md={12} sx={{ mt: 2, mb: 2 }}>
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
export default BookingSystem