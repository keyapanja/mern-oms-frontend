import React, { useEffect } from 'react'

function SalaryType() {

    useEffect(() => {
        if (document.getElementById('salarytype-nav')) {
            document.getElementById('salarytype-nav').classList.add('active');
        }
        if (document.getElementById('settings-nav')) {
            document.getElementById('settings-nav').classList.add('active');
        }
        if (document.getElementById('settings-menu')) {
            document.getElementById('settings-menu').classList.add('menu-open');
        }
    })

    return (
        <>
            <h4>Salary Types</h4>
        </>
    )
}

export default SalaryType
