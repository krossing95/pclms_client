import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import * as React from 'react'
import styles from '../../../styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { SaveEquipmentPageState } from '@/redux/app/slice.app'
import MessageBox from '@/app/utils/components/MessageBox'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import { FetchEquipment } from '@/redux/equipment/slice.equipment'
import { SelectableFilesToBase64 } from '@/app/utils/statics'
import upload_equipment_file from '@/app/actions/equipment/equipment.upload'

interface EquipmentPhotoUploadStates {
    message: string
    loading: boolean
    open: boolean
    isErrorFree: boolean
}

const Preview = () => {
    const equipment = useAppSelector(state => state.equipmentReducer.equipment)?.[0]
    const app = useAppSelector(state => state.appReducer.equipment)
    const dispatch = useAppDispatch()
    const [states, setStates] = React.useState<EquipmentPhotoUploadStates>({ loading: false, message: '', open: false, isErrorFree: false })
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveEquipmentPageState({ ...app, hasOpenedEquipmentPhotoPreview: false, selectedEquipmentFile: undefined }))
    }
    const uploadHandler = async () => {
        setStates(prev => ({ ...prev, open: false, message: '', isErrorFree: false }))
        if (app.selectedEquipmentFile === '') return handleClose()
        const check = app.selectedEquipmentFile.split(',', 2)?.[0]
        if (!SelectableFilesToBase64.includes(check)) return setStates(prev => ({ ...prev, message: 'Type error: Image photo of types; png, jpg or jpeg required', open: true, isErrorFree: false }))
        setStates(prev => ({ ...prev, loading: true }))
        try {
            const upload = await upload_equipment_file({ img_url: app.selectedEquipmentFile, id: equipment.id })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(upload.data?.code) !== 200) return setStates(prev => ({ ...prev, message: upload.data?.message, open: true, isErrorFree: false }))
            dispatch(FetchEquipment([{ ...equipment, photo_url: upload.data?.data?.cloud_photo }]))
            setStates(prev => ({ ...prev, message: upload.data?.message, open: true, isErrorFree: true }))
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
        }
    }
    return (
        <Dialog fullScreen open={app.hasOpenedEquipmentPhotoPreview} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <DialogTitle className={styles.text} style={{ cursor: 'move' }} id="draggable-dialog-title">Photo preview</DialogTitle>
            <MessageBox
                open={states.open}
                message={states.message}
                isErrorFree={states.isErrorFree}
            />
            <DialogContent>
                <Box component='div' sx={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={app.selectedEquipmentFile} alt='Photo Preview' width='350' />
                </Box>
                <Typography sx={{ textAlign: 'center' }}>{equipment.name}</Typography>
            </DialogContent>
            <DialogActions>
                <Button className={styles.dashedBoaderBtn} autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                <Button disabled={states.loading} className={styles.dashedBoaderBtn} onClick={uploadHandler}>
                    {states.loading ? (
                        <CircularProgress color='inherit' size={15} />
                    ) : 'save'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default Preview