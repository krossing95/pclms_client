'use client'

import * as React from 'react'
import SuspenseLoader from '@/app/components/Loader'

const DashboardLoader = () => {
    return (
        <React.Fragment>
            <SuspenseLoader text='Loading Dashboard' issueOptionalHeight />
        </React.Fragment>
    )
}

export default DashboardLoader