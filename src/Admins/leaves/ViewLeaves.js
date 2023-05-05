import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CommonTable from '../../Commons/CommonTable';
import { formatDate } from '../../Commons/FormatTime';
import GoBack from '../../Commons/GoBack';

function ViewLeaves() {

    useEffect(() => {
        if (document.getElementById('attn-nav')) {
            document.getElementById('attn-nav').classList.add('active');
        }
    })

    //get staff id from url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const getStaffID = urlParams.get('staff_id')

    //Staff data
    const [staffData, setStaffData] = useState(null);
    useEffect(() => {
        const getStaff = async () => {
            const staff = await axios.get(process.env.REACT_APP_BACKEND + 'staff/get-staff/' + getStaffID);
            const data = staff.data[0];
            setStaffData(data);
        }
        getStaff();
    }, [getStaffID])

    //get leaves list from database
    const [leaveList, setLeaveList] = useState('');
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'leaves/get-leaves/' + getStaffID)
            .then(res => {
                setLeaveList(res.data)
            })
    })

    const columns = [
        {
            name: '#',
            cell: (row) => '#',
            width: '5%'
        },
        {
            name: 'Reason',
            selector: (row) => row.reason,
            sortable: true
        },
        {
            name: 'Days',
            selector: (row) => {
                return <>
                    <div>
                        {formatDate(row.start)} - {formatDate(row.end)} <br />
                        ({row.total} Days)
                    </div>
                </>
            },
            sortable: true
        },
        {
            name: 'Applied On',
            selector: (row) => formatDate(row.createdAt),
            sortable: true
        },
        {
            name: 'Status',
            selector: (row) => {
                if (row.status === 'Pending') {
                    return <span className='badge badge-pill badge-warning'>Pending</span>
                } else if (row.status === 'Approved') {
                    return <span className='badge badge-pill badge-success'>Approved</span>
                } else if (row.status === 'Rejected') {
                    return <span className='badge badge-pill badge-danger'>Rejected</span>
                }
            }
        }
    ]

    return (
        <>
            <div>
                <div className='card'>
                    <div className='card-header'>
                        <div className='card-title'>Leaves List - {staffData && staffData.fullname}</div>
                        <div className='card-tools'>
                            <GoBack />
                        </div>
                    </div>
                    <div className='card-body'>
                        {CommonTable('Leaves List', columns, leaveList, ['reason'])}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewLeaves
