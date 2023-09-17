import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, RadioGroup } from '@mui/material'
import * as React from 'react'
import styles from '../../../styles.module.css'
import { CancelOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { SaveAppData, SaveEquipmentPageState } from '@/redux/app/slice.app'
import StringMethods from '@/helpers/helper.string_methods'
import useValidations from '@/app/hooks/useValidations'
import update_equipment from '@/app/actions/equipment/equipment.update'
import { FetchEquipment } from '@/redux/equipment/slice.equipment'
import { Equipment } from '@/app/types/type.equipment'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import MessageBox from '@/app/utils/components/MessageBox'
import InputField from '@/app/components/Input'
import FunctionalitySelector from '@/app/utils/components/Selectors/FunctionalityStatus'
import AvailabilitySelector from '@/app/utils/components/Selectors/AvailabilityStatus'

interface EquipmentUpdateStates {
    id: string
    name: string
    description: string
    system_error: string
    functionality_status: string | number
    availability_status: string | number
    open: boolean
    message: string
    isErrorFree: boolean
    loading: boolean
    fullscreen: boolean
}

const Update = () => {
    const app = useAppSelector(state => state.appReducer.equipment)
    const equipment = useAppSelector(state => state.equipmentReducer.equipment)?.[0]
    const dispatch = useAppDispatch()
    const { textProcessor } = StringMethods()
    const { validateEquipment } = useValidations()
    const [states, setStates] = React.useState<EquipmentUpdateStates>({
        id: equipment.id, name: equipment.name || '',
        description: equipment.description || '', system_error: equipment.system_error || '',
        functionality_status: equipment.functionality_status ? '2' : '1',
        availability_status: equipment.availability_status ? '2' : '1', open: false, message: '',
        isErrorFree: false, loading: false, fullscreen: false
    })

    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveEquipmentPageState({ ...app, hasOpenedEditEquipmentPrompt: false }))
    }
    const updateHandler = async () => {
        const { id, name, description, system_error, functionality_status, availability_status } = states
        const data = {
            id, name, description: textProcessor(description), system_error: textProcessor(system_error), functionality_status: Number(functionality_status), availability_status: Number(availability_status)
        }
        setStates(prev => ({ ...prev, open: false, message: '', isErrorFree: false }))
        const params = {
            data,
            next: () => setStates(prev => ({ ...prev, loading: true }))
        }
        const validate = validateEquipment({ ...params })
        if (validate?.error !== undefined) return setStates(prev => ({ ...prev, message: validate?.error, open: true, isErrorFree: false }))
        try {
            const update = await update_equipment({
                ...data,
                functionality_status: data.functionality_status === 2 ? true : false,
                availability_status: data.availability_status === 2 ? true : false
            })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(update.data?.code) !== 200) return setStates(prev => ({ ...prev, message: update.data?.message, open: true, isErrorFree: false }))
            setStates(prev => ({ ...prev, message: update.data?.message, open: true, isErrorFree: true }))
            const newData: Equipment = update.data?.data
            return dispatch(FetchEquipment([{
                ...equipment, name: newData.name,
                description: newData?.description, system_error: newData?.system_error, functionality_status: newData?.functionality_status,
                availability_status: newData?.availability_status, updated_at: newData?.updated_at
            }]))
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
        }
    }
    React.useEffect(() => {
        const selectAlgorithm = () => {
            if (Number(states.functionality_status) === 1) return setStates(prev => ({ ...prev, availability_status: Number(states.functionality_status) }))
            setStates(prev => ({ ...prev, availability_status: Number(states.availability_status) }))
        }
        selectAlgorithm() //eslint-disable-next-line
    }, [states.functionality_status, states.availability_status, setStates])
    return (
        <Dialog fullScreen={states.fullscreen} open={app.hasOpenedEditEquipmentPrompt} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <Box component='div' className={styles.header}>
                <DialogTitle className='text' style={{ cursor: 'move' }} id="draggable-dialog-title">Update equipment</DialogTitle>
                <Box component='div' className={styles.toolbar}>
                    <IconButton onClick={() => setStates(prev => ({ ...prev, fullscreen: !prev.fullscreen }))}>
                        {states.fullscreen ? (
                            <FullscreenExitOutlined />
                        ) : (
                            <FullscreenOutlined />
                        )}
                    </IconButton>
                    <IconButton onClick={handleClose}>
                        <CancelOutlined />
                    </IconButton>
                </Box>
            </Box>
            <MessageBox
                open={states.open}
                message={states.message}
                isErrorFree={states.isErrorFree}
            />
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid item xs={12} className={styles.input_container}>
                        <InputField
                            value={states.name} type='text'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, name: (e.target as HTMLInputElement).value }))}
                            classes={styles.input}
                            disabled={states.loading}
                            placeholder='Enter name of equipment'
                        />
                    </Grid>
                    <Grid item xs={12} className={styles.input_container} >
                        <textarea
                            style={{ fontSize: '15px' }}
                            rows={4} value={states.description}
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, description: (e.target as HTMLInputElement).value }))}
                            placeholder='Provide description for the equipment'
                            className={styles.input}>
                        </textarea>
                    </Grid>
                    {Number(states.functionality_status) === 1 ? (
                        <Grid item xs={12} className={styles.input_container} >
                            <textarea
                                style={{ fontSize: '15px' }}
                                rows={4}
                                value={states.system_error}
                                onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, system_error: (e.target as HTMLInputElement).value }))}
                                placeholder='Provide any associated system error for the equipment'
                                className={styles.input}>
                            </textarea>
                        </Grid>
                    ) : null}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <label className='text' htmlFor='func_status'>Functionality Status</label>
                        <RadioGroup
                            value={states.functionality_status}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStates(prev => ({ ...prev, functionality_status: (e.target as HTMLInputElement).value }))}
                            aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group" row>
                            {<FunctionalitySelector />}
                        </RadioGroup>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <label className='text' htmlFor='avail_status'>Availability Status</label>
                        <RadioGroup
                            value={states.availability_status}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStates(prev => ({ ...prev, availability_status: (e.target as HTMLInputElement).value }))}
                            aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group" row>
                            {<AvailabilitySelector />}
                        </RadioGroup>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button disabled={states.loading} className={styles.dashedBoaderBtn} onClick={updateHandler}>
                    {states.loading ? (
                        <CircularProgress color='inherit' size={15} />
                    ) : 'update'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default Update