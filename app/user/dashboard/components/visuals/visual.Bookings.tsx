import PieChart from '@/app/utils/components/Chart/PieChart'
import * as React from 'react'

interface GraphicalData {
    closed_bookings: number,
    approved_bookings: number
    pending_bookings: number
}


const GraphicalRepresentationForBookings: React.FC<GraphicalData> = ({ closed_bookings, approved_bookings, pending_bookings }) => {
    return (
        <PieChart
            data={{
                labels: ['Pending bookings', 'Approved bookings', 'Closed bookings'],
                datasets: [
                    {
                        label: 'Total',
                        data: [pending_bookings, approved_bookings, closed_bookings],
                        backgroundColor: [
                            '#CCCCFF',
                            '#6495ED',
                            '#ff2d55'
                        ],
                        borderColor: [
                            '#CCCCFF',
                            '#6495ED',
                            '#ff2d55'
                        ],
                        borderWidth: 1
                    }
                ]
            }}
        />
    )
}
export default GraphicalRepresentationForBookings