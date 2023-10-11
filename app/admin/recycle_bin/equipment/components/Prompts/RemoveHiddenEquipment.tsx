import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material'
import * as React from 'react'
import styles from '@/app/admin/equipment/styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { SaveEquipmentPageState } from '@/redux/app/slice.app'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import MessageBox from '@/app/utils/components/MessageBox'
import InputField from '@/app/components/Input'
import remove_hidden_equipment from '@/app/actions/recycle_bin/bin.remove_equipment'
import { FetchEquipment } from '@/redux/equipment/slice.equipment'

interface EquipmentDeleteStates {
    name: string
    open: boolean
    message: string
    isErrorFree: boolean
    loading: boolean
}


interface HiddenEquipmentRemoveProps {
    paginate: (page: number, totalItem: number, totalPages: number) => void
}

const Remove: React.FC<HiddenEquipmentRemoveProps> = ({ paginate }) => {
    const app = useAppSelector(state => state.appReducer.equipment)
    const equipment = useAppSelector(state => state.equipmentReducer.equipment).filter(item => item.id === app.selectedEquipmentId)?.[0]
    const dispatch = useAppDispatch()
    const confirmStatement: string = `sudo delete ${equipment.name.trim().toLowerCase()}`
    const [states, setStates] = React.useState<EquipmentDeleteStates>({ name: '', open: false, message: '', isErrorFree: false, loading: false })
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveEquipmentPageState({ ...app, hasOpenedDeleteEquipmentPrompt: false }))
    }
    const removeHandler = async () => {
        setStates(prev => ({ ...prev, open: false, message: '', isErrorFree: false }))
        if (confirmStatement !== states.name.trim().toLowerCase()) return false
        setStates(prev => ({ ...prev, loading: true, name: '' }))
        try {
            const remove = await remove_hidden_equipment({ id: equipment.id })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(remove.data?.code) !== 200) return setStates(prev => ({ ...prev, message: remove.data?.message, open: true, isErrorFree: false }))
            const collection = remove.data?.data
            dispatch(FetchEquipment([...collection?.equipment]))
            const page_data = collection?.page_data
            dispatch(SaveEquipmentPageState({
                ...app,
                isSearchResultDisplayed: false,
                hasOpenedDeleteEquipmentPrompt: false
            }))
            paginate(page_data?.currentPage, page_data?.totalCount, page_data?.totalPages)
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
        }
    }
    return (
        <Dialog open={app.hasOpenedDeleteEquipmentPrompt} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <DialogTitle className={styles.text} style={{ cursor: 'move' }} id="draggable-dialog-title">Remove equipment</DialogTitle>
            <MessageBox
                open={states.open}
                message={states.message}
                isErrorFree={states.isErrorFree}
            />
            <DialogContent>
                <Typography gutterBottom variant='body2'>{"Are you sure you want to remove this item?"}</Typography>
                <Typography gutterBottom variant='body2'>{'To confirm the action, enter '}<strong style={{ color: '#026FBD' }}>{`sudo delete ${equipment.name.toLowerCase()}`}</strong></Typography>
                <Grid container spacing={1}>
                    <Grid item xs={12} className={styles.input_container}>
                        <InputField
                            value={states.name} type='text'
                            onChange={(e: React.SyntheticEvent<EventTarget>) => setStates(prev => ({ ...prev, name: (e.target as HTMLInputElement).value }))}
                            classes={styles.input}
                            disabled={states.loading}
                            placeholder=''
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button className={styles.dashedBoaderBtn} autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                <Button disabled={confirmStatement === states.name.trim().toLowerCase() ? false : true} className={styles.dashedBoaderBtn} onClick={removeHandler}>
                    {states.loading ? (
                        <CircularProgress color='inherit' size={15} />
                    ) : 'remove'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default Remove