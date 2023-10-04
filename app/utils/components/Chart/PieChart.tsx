import * as React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto'
import type { ChartDataType } from '@/app/types/type.chart_data'

interface PieChartProp {
    data: ChartDataType
}

const PieChart: React.FC<PieChartProp> = ({ data }) => {
    ChartJS.register(ArcElement, Tooltip, Legend)
    return (
        <Doughnut data={data} width={240}
            height={240}
            options={{ maintainAspectRatio: false }}
        />
    )
}
export default PieChart