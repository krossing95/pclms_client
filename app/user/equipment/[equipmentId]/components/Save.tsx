import save_as_favourite from '@/app/actions/equipment/equipment.save_favourite'
import { FetchEquipment } from '@/redux/equipment/slice.equipment'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { FavoriteBorderOutlined, FavoriteOutlined } from '@mui/icons-material'
import { CircularProgress, IconButton, Tooltip } from '@mui/material'
import * as React from 'react'
import { toast } from 'react-toastify'

interface SaveState {
    loading: boolean
}

const Save = () => {
    const equipment = useAppSelector(state => state.equipmentReducer.equipment)?.[0]
    const dispatch = useAppDispatch()
    const [states, setStates] = React.useState<SaveState>({ loading: false })
    const handleStorage = async () => {
        setStates(prev => ({ ...prev, loading: true }))
        try {
            const save = await save_as_favourite({ id: equipment.id })
            setStates(prev => ({ ...prev, loading: false }))
            if (parseInt(save.data?.code) !== 200) return toast(save.data?.message)
            dispatch(FetchEquipment([{ ...equipment, saved: save.data?.data?.is_saved }]))
            return toast(save.data?.message)
        } catch (error) {
            return toast('Something went wrong')
        }
    }
    return (
        <Tooltip title={equipment.saved ? 'Remove from favorites' : 'Add to favorites'}>
            <span>
                <IconButton disabled={states.loading} onClick={handleStorage}>
                    {states.loading ? (
                        <CircularProgress color='inherit' size={22} />
                    ) : (
                        <React.Fragment>
                            {equipment.saved ? (
                                <FavoriteOutlined />
                            ) : (
                                <FavoriteBorderOutlined />
                            )}
                        </React.Fragment>
                    )}
                </IconButton>
            </span>
        </Tooltip>
    )
}
export default Save