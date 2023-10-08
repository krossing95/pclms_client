import PieChart from '@/app/utils/components/Chart/PieChart'
import * as React from 'react'

interface GraphicalData {
    admins: number
    non_admins: number
    blocked_users: number
}

const GraphicalRepresentationForUsers: React.FC<GraphicalData> = ({ admins, non_admins, blocked_users }) => {
    return (
        <PieChart
            data={{
                labels: ['Administrators', 'Customers', 'Blocked users'],
                datasets: [
                    {
                        label: 'Total',
                        data: [admins, non_admins, blocked_users],
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
export default GraphicalRepresentationForUsers