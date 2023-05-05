import React from 'react'
import { useNavigate } from 'react-router-dom'

function GoBack() {

    const navigate = useNavigate();

    return (
        <button className='btn btn-link py-0 text-cyan btn-sm' onClick={() => navigate(-1)} style={{ zIndex: '100', color: '#17a2b8', display: 'flex', alignItems: 'center' }} >
            <i className='fa fa-arrow-left mr-2' style={{ background: '#17a2b8', color: 'whitesmoke', height: '22px', width: '22px', borderRadius: '50%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}></i>
            <h5 className='d-xs-none d-sm-none d-md-inline d-lg-inline d-none m-0' style={{ color: '#17a2b8' }}>Back</h5>
        </button>
    )
}

export default GoBack
