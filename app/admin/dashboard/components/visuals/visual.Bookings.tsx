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
                            '#CCCCFF',
                            '#6495ED'
                        ],
                        borderColor: [
                            '#CCCCFF',
                            '#6495ED'
                        ],
                        borderWidth: 1
                    }
                ]
            }}
        />
    )
}
export default GraphicalRepresentationForBookings