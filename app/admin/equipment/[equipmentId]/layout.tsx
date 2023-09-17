import * as React from 'react'

interface SingleEquipmentLayoutProps {
    children: React.ReactNode
}

const SingleEquipmentLayoutLayout: React.FC<SingleEquipmentLayoutProps> = async ({ children }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
export default SingleEquipmentLayoutLayout