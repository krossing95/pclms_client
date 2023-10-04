import PieChart from '@/app/utils/components/Chart/PieChart'
import * as React from 'react'

interface GraphicalData {
    available_equipment: number,
    unavailable_equipment: number
}

const GraphicalRepresentationForEquipment: React.FC<GraphicalData> = ({ available_equipment, unavailable_equipment }) => {
    return (
        <PieChart
            data={{
                labels: ['Available equipment', 'Unavailable equipment'],
                datasets: [
                    {
                        label: 'Total',
                        data: [available_equipment, unavailable_equipment],
                        backgroundColor: [
                            '#BAB2B0',
                            '#4D9DFF'
                        ],
                        borderColor: [
                            '#BAB2B0',
                            '#4D9DFF'
                        ],
                        borderWidth: 1
                    }
                ]
            }}
        />
    )
}
export default GraphicalRepresentationForEquipment