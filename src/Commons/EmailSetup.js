import React from 'react'

function EmailSetup() {
    return (
        <>
            <div className='card'>
                <div className='card-header'>
                    <h5 className='card-title'>Email Setup</h5>
                </div>
                <div className='card-body'>
                    <p className='text-muted'>
                        <b><i className='fa fa-info-circle mr-1'></i>What is this for?</b><br></br>
                        <span className='ml-4'>This email address would be used to send emails from this system for different purposes like on adding new employee, on staff account creation or when you would send any Email from this system. You cannot access the email features until you setup your email with the system.</span>
                    </p>

                    <div>
                        <div className='form-group'>
                            <label>Email Address</label>
                            <input type='email' className='form-control' placeholder='Enter Email Address'></input>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EmailSetup
