import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material'
import * as React from 'react'
import styles from '@/app/admin/equipment/styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { SaveEquipmentPageState } from '@/redux/app/slice.app'
import MovablePrompt from '@/app/utils/components/MovablePrompt'
import MessageBox from '@/app/utils/components/MessageBox'
import retrieve_hidden_equipment from '@/app/actions/recycle_bin/bin.retrieve_equipment'
import { FetchEquipment } from '@/redux/equipment/slice.equipment'

interface RetrieveHiddenEquipmentStates {
    open: boolean
    message: string
    isErrorFree: boolean
    loading: boolean
}

interface HiddenEquipmentRetrieveProps {
    paginate: (page: number, totalItem: number, totalPages: number) => void
}

const RetrieveHiddenEquipment: React.FC<HiddenEquipmentRetrieveProps> = ({ paginate }) => {
    const app = useAppSelector(state => state.appReducer.equipment)
    const dispatch = useAppDispatch()
    const [states, setStates] = React.useState<RetrieveHiddenEquipmentStates>({
        open: false,
        message: '',
        isErrorFree: false,
        loading: false
    })
    const handleClose = () => {
        if (states.loading) return false
        dispatch(SaveEquipmentPageState({
            ...app,
            hasOpenedRetrieveHiddenEquipmentPrompt: false,
            selectedEquipmentId: undefined
        }))
    }
    const retrieveHandler = async () => {
        setStates(prev => ({ ...prev, loading: true, name: '' }))
        try {
            const retrieve = await retrieve_hidden_equipment({ id: app.selectedEquipmentId })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(retrieve.data?.code) !== 200) return setStates(prev => ({ ...prev, message: retrieve.data?.message, open: true, isErrorFree: false }))
            const collection = retrieve.data?.data
            dispatch(FetchEquipment([...collection?.equipment]))
            const page_data = collection?.page_data
            dispatch(SaveEquipmentPageState({
                ...app,
                isSearchResultDisplayed: false,
                hasOpenedRetrieveHiddenEquipmentPrompt: false
            }))
            paginate(page_data?.currentPage, page_data?.totalCount, page_data?.totalPages)
        } catch (error) {
            return setStates(prev => ({ ...prev, message: 'Something went wrong', open: true, isErrorFree: false }))
        }
    }
    return (
        <Dialog open={app.hasOpenedRetrieveHiddenEquipmentPrompt} PaperComponent={MovablePrompt} aria-labelledby="draggable-dialog-title">
            <DialogTitle className={styles.text} style={{ cursor: 'move' }} id="draggable-dialog-title">{"Clear items"}</DialogTitle>
            <MessageBox
                open={states.open}
                message={states.message}
                isErrorFree={states.isErrorFree}
            />
            <DialogContent>
                <Typography gutterBottom variant='body2'>{"Are you sure you want to retrieve the selected hidden equipment?"}</Typography>
            </DialogContent>
            <DialogActions>
                <Button className={styles.dashedBoaderBtn} autoFocus onClick={handleClose}>
                    {"Cancel"}
                </Button>
                <Button disabled={states.loading} className={styles.dashedBoaderBtn} onClick={retrieveHandler}>
                    {states.loading ? (
                        <CircularProgress color='inherit' size={15} />
                    ) : 'retrieve'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default RetrieveHiddenEquipment