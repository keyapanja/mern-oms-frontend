import { Skeleton } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import AttnList from '../../Commons/AttnList';
import GoBack from '../../Commons/GoBack'

function ViewAttn() {

    useEffect(() => {
        if (document.getElementById('attn-nav')) {
            document.getElementById('attn-nav').classList.add('active');
        }
    })

    //get staff id from url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const getStaffID = urlParams.get('staff_id')

    //Fetching staff data from database
    const [staffData, setStaffData] = useState(null);
    useEffect(() => {
        const getStaff = async () => {
            const staff = await axios.get(process.env.REACT_APP_BACKEND + 'staff/get-staff/' + getStaffID);
            const data = staff.data[0];
            setStaffData(data);

            if (!data) {
                const noDataDiv = document.getElementById('noDataDiv');
                if (noDataDiv) {
                    window.setTimeout(() => {
                        noDataDiv.style.display = 'flex';
                    }, 1500)
                }
            }
        }

        getStaff();
    }, [getStaffID])

    return (
        <>
            <div>
                <div className='card'>
                    <div className='card-header'>
                        {
                            staffData ?
                                <div className='card-title'>Attendance List - {staffData.fullname}</div>
                                : <Skeleton variant='rounded' width={450} height={25} className='d-inline-block mb-0' />
                        }
                        <div className='card-tools'>
                            <GoBack />
                        </div>
                    </div>

                    <div className='card-body'>
                        {
                            staffData ?
                                <>
                                    {<AttnList staff={getStaffID} />}
                                </>
                                : <>
                                    <Skeleton variant='rounded' height={400} />
                                </>
                        }
                    </div>
                </div>

                <div style={{ position: 'fixed', display: 'none', justifyContent: 'center', alignItems: 'center', top: 0, left: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.2)', padding: '15px' }} id="noDataDiv">
                    <div className='text-center'>
                        <img src="/images/404.svg" width='25%' alt="Not Found!"></img>
                        <h2>No Data Found!</h2>
                        <p>The staff you're looking for doesn't exist. <br></br> Try searching some other staff..!</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewAttn
