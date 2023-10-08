import PieChart from '@/app/utils/components/Chart/PieChart'
import * as React from 'react'

interface GraphicalData {
    approved_bookings: number
    pending_bookings: number
}


const GraphicalRepresentationForBookings: React.FC<GraphicalData> = ({ approved_bookings, pending_bookings }) => {
    return (
        <PieChart
            data={{
                labels: ['Pending bookings', 'Approved bookings'],
                datasets: [
                    {
                        label: 'Total',
                        data: [pending_bookings, approved_bookings],
                        backgroundColor: [
                            '#4cd964',
                            '#ff2d55'
                        ],
                        borderColor: [
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