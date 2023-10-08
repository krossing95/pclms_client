import PieChart from '@/app/utils/components/Chart/PieChart'
import * as React from 'react'

interface GraphicalData {
    available_equipment: number
    unavailable_equipment: number
    hidden_equipment: number
}

const GraphicalRepresentationForEquipment: React.FC<GraphicalData> = ({ available_equipment, unavailable_equipment, hidden_equipment }) => {
    return (
        <PieChart
            data={{
                labels: ['Available equipment', 'Unavailable equipment', 'Hidden equipment'],
                datasets: [
                    {
                        label: 'Total',
                        data: [available_equipment, unavailable_equipment, hidden_equipment],
                        backgroundColor: [
                            '#BAB2B0',
                            '#4D9DFF',
                            '#BB86FC'
                        ],
                        borderColor: [
                            '#BAB2B0',
                            '#4D9DFF',
                            '#BB86FC'
                        ],
                        borderWidth: 1
                    }
                ]
            }}
        />
    )
}
export default GraphicalRepresentationForEquipment