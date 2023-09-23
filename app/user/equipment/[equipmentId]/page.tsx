import getone_equipment from '@/app/actions/equipment/equipment.get_one'
import SuspenseLoader from '@/app/components/Loader'
import { Equipment } from '@/app/types/type.equipment'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import * as React from 'react'
import EquipmentPage from './components/EquipmentPage'
import { cookies } from 'next/headers'

type Props = {
    params: { equipmentId: string }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    try {
        const getData = await getone_equipment({ equipment_id: params.equipmentId })
        if (parseInt(getData.data?.code) !== 200) {
            return {
                title: 'Single equipment | PCLMS - Laboratory Management System',
                description: 'This is description to the page'
            }
        }
        const equipment: Equipment = getData.data?.data
        return {
            title: `${equipment?.name} | PCLMS - Laboratory Management System`,
            description: equipment?.description
        }
    } catch (error) {
        notFound()
    }
}
export const dynamic = 'force-dynamic'

const getEquipment = async ({ params }: Props) => {
    const cookieStore = cookies()
    const obj = cookieStore.get('__signedInUserObj')?.value || '{}'
    const cookieObj = JSON.parse(obj)?.user
    const token: string = cookieObj?.token
    let equipment: Equipment
    try {
        const getData = await getone_equipment({ equipment_id: params.equipmentId, token })
        if (parseInt(getData.data?.code) !== 200) notFound()
        equipment = getData.data?.data
        return equipment
    } catch (error) {
        notFound()
    }
}

const SingleEquipmentPage = async ({ params }: Props) => {
    const equipment = await getEquipment({ params })
    return (
        <React.Suspense fallback={<SuspenseLoader text='Page is loading' ignoreOptionalHeight={false} />}>
            <EquipmentPage data={equipment} />
        </React.Suspense>
    )
}

export default SingleEquipmentPage