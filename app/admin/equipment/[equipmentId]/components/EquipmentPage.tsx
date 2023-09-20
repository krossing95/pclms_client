'use client'

import { Equipment } from '@/app/types/type.equipment'
import * as React from 'react'
import { Box, Grid, IconButton } from '@mui/material'
import styles from '../../styles.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { FetchEquipment } from '@/redux/equipment/slice.equipment'
import { toast } from 'react-toastify'
import { DeleteSweepOutlined, ModeEditOutlined, UploadFileOutlined } from '@mui/icons-material'
import { SaveEquipmentPageState } from '@/redux/app/slice.app'
import Cookies from 'js-cookie'
import useValidations from '@/app/hooks/useValidations'
import { Texts, DataDisplay, PhotoDisplayer, Remove, Preview, Update, Title, SuspenseLoader } from '../exports'

interface SingleEquipmentStates {
    file: string
    loading: boolean
}
interface SingleEquipmentPageProps {
    data: Equipment
}

const EquipmentPage: React.FC<SingleEquipmentPageProps> = ({ data }) => {
    const [states, setStates] = React.useState<SingleEquipmentStates>({
        file: '', loading: true
    })
    const dispatch = useAppDispatch()
    const app = useAppSelector(state => state.appReducer.equipment)
    const equipment = useAppSelector(state => state.equipmentReducer.equipment)?.[0]
    const cookieObj = Cookies.get('__signedInUserObj') || '{}'
    const cookie = JSON.parse(cookieObj)?.user
    const filePickerRef = React.useRef<HTMLInputElement | null>(null)
    const { fileValidator } = useValidations()
    React.useEffect(() => {
        const getData = () => {
            dispatch(FetchEquipment([data]))
            setStates(prev => ({ ...prev, loading: false }))
        }
        getData() // eslint-disable-next-line
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const File = e.target.files?.[0]
        if (File) {
            const params = {
                data: File
            }
            const validate = fileValidator({ ...params })
            if (validate?.error !== undefined) return toast(validate?.error)
            const fileReader = new FileReader()
            fileReader.readAsDataURL(File)
            fileReader.onload = () => {
                setStates(prev => ({ ...prev, file: '' }))
                return dispatch(SaveEquipmentPageState({ ...app, selectedEquipmentFile: fileReader.result, hasOpenedEquipmentPhotoPreview: true }))
            }
            return false
        }
    }
    return (
        <Box component='div'>
            <React.Fragment>
                {states.loading ? (
                    <SuspenseLoader text='Loading equipment' issueOptionalHeight={true} />
                ) : (
                    <React.Fragment>
                        {typeof equipment?.id !== 'undefined' ? (
                            <React.Fragment>
                                <Box component='div' className={styles.header}>
                                    <Title text={equipment.name} variant_switch={false} />
                                    <Box component='div' className={styles.toolbar}>
                                        <IconButton onClick={() => dispatch(SaveEquipmentPageState({ ...app, hasOpenedEditEquipmentPrompt: true }))}>
                                            <ModeEditOutlined />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => filePickerRef.current?.click()}
                                        >
                                            <UploadFileOutlined />
                                        </IconButton>
                                        <IconButton onClick={() => dispatch(SaveEquipmentPageState({ ...app, hasOpenedDeleteEquipmentPrompt: true }))}>
                                            <DeleteSweepOutlined />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Box component='div'>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={6}>
                                            <PhotoDisplayer equipment={equipment} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <DataDisplay />
                                        </Grid>
                                    </Grid>
                                    <Texts />
                                </Box>
                            </React.Fragment>
                        ) : null}
                    </React.Fragment>
                )}
            </React.Fragment>
            {cookie?.usertype === Number(process.env.NEXT_PUBLIC_APP_ADMIN) ? (
                <input
                    type="file"
                    ref={filePickerRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            ) : null}
            {app.hasOpenedEquipmentPhotoPreview ? (
                <Preview />
            ) : app.hasOpenedEditEquipmentPrompt ? (
                <Update />
            ) : app.hasOpenedDeleteEquipmentPrompt ? (
                <Remove />
            ) : null}
        </Box>
    )
}
export default EquipmentPage