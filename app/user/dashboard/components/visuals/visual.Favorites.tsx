import PieChart from '@/app/utils/components/Chart/PieChart'
import * as React from 'react'

interface GraphicalData {
    saved_equipment: number,
    unsaved_equipment: number
}

const GraphicalRepresentationForFavorites: React.FC<GraphicalData> = ({ saved_equipment, unsaved_equipment }) => {
    return (
        <PieChart
            data={{
                labels: ['Saved equipment', 'Unsaved equipment'],
                datasets: [
                    {
                        label: 'Total',
                        data: [saved_equipment, unsaved_equipment],
                        backgroundColor: [
                            '#13C966',
                            '#0079D0',
                        ],
                        borderColor: [
                            '#13C966',
                            '#0079D0',
                        ],
                        borderWidth: 1
                    },
                ]
            }}
        />
    )
}
export default GraphicalRepresentationForFavorites