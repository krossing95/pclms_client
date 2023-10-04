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
                labels: ['Pending', 'Approved', 'Closed'],
                datasets: [
                    {
                        label: 'Total',
                        data: [pending_bookings, approved_bookings, closed_bookings],
                        backgroundColor: [
                            '#bb86fc',
                            '#4cd964',
                            '#ff2d55'
                        ],
                        borderColor: [
                            '#bb86fc',
                            '#4cd964',
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