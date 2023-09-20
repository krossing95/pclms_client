// import { useAppDispatch, useAppSelector } from '@/redux/hooks'
// import { FavoriteBorderOutlined, FavoriteOutlined } from '@mui/icons-material'
// import { CircularProgress, IconButton, Tooltip } from '@mui/material'
// import * as React from 'react'
// import { toast } from 'react-toastify'

// interface SaveState{
//     loading: boolean
// }

// const Save = () => {
//     const equipment = useAppSelector(state => state.equipmentReducer.equipment)?.[0]
//     const dispatch = useAppDispatch()
//     const [states, setStates] = React.useState<SaveState>({ loading: false })
//     const handleStorage = async () => {
//         setStates(prev => ({ ...prev, loading: true }))
//         try {
            
//         } catch (error) {
            
//         }
//         const save = await addFavorite({ equipment_id: equipment.equipment_id })
//         setStates(prev => ({ ...prev, loading: false }))
//         if (save.status !== 200) return toast(save.data)
//         dispatch(FetchEquipment([{ ...equipment, saved: save.data?.data?.is_favorite }]))
//         return toast(save.data?.message)
//     }
//     return (
//         <Tooltip title={equipment.saved ? 'Remove from favorites' : 'Add to favorites'}>
//             <span>
//                 <IconButton disabled={states.loading} onClick={handleStorage}>
//                     {states.loading ? (
//                         <CircularProgress color='inherit' size={22} />
//                     ) : (
//                         <React.Fragment>
//                             {equipment.saved ? (
//                                 <FavoriteOutlined />
//                             ) : (
//                                 <FavoriteBorderOutlined />
//                             )}
//                         </React.Fragment>
//                     )}
//                 </IconButton>
//             </span>
//         </Tooltip>
//     )
// }
// export default Save