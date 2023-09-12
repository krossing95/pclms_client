import getone_equipment from '@/app/actions/equipment/equipment.get_one'
import SuspenseLoader from '@/app/components/Loader'
import { Equipment } from '@/app/types/type.equipment'
// import { Metadata, ResolvingMetadata } from 'next'
// import { redirect } from 'next/navigation'
import * as React from 'react'
import EquipmentPage from './components/EquipmentPage'

// type Props = {
//     params: { equipmentId: string }
//     searchParams: { [key: string]: string | string[] | undefined }
// }

// export async function generateMetadata(
//     { params, searchParams }: Props,
//     parent: ResolvingMetadata
// ): Promise<Metadata> {
//     const id = params.equipmentId
//     const getData = await getone_equipment({ equipment_id: id })
//     if (parseInt(getData.data?.code) !== 200) {
//         return {
//             title: 'Single equipment',
//             description: 'This is description to the page'
//         }
//     }
//     const equipment: Equipment = getData.data?.data
//     return {
//         title: equipment?.name,
//         description: equipment?.description
//     }
// }

const SingleEquipmentPage = () => {
    // const id = params.equipmentId
    // const getData = await getone_equipment({ equipment_id: id })
    // if (parseInt(getData.data?.code) !== 200) return redirect('/system/equipment')
    // const equipment: Equipment = getData.data?.data
    return (
        <React.Suspense fallback={<SuspenseLoader text='Page is loading' issueOptionalHeight={false} />}>
            <EquipmentPage />
        </React.Suspense>
    )
}

export default SingleEquipmentPage