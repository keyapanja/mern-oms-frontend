import { Tooltip } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CommonTable from '../../Commons/CommonTable';
import { formatDate } from '../../Commons/FormatTime';
import GoBack from '../../Commons/GoBack'
import { reloadWindow, SwalComp, ToastComp } from '../../Commons/ToastComp';

function StaffLeaves() {

    useEffect(() => {
        if (document.getElementById('leaves-nav')) {
            document.getElementById('leaves-nav').classList.add('active');
        }
    })

    //Fetch leaves 
    const [leaveList, setLeaveList] = useState([]);
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'leaves/get-all-leaves')
            .then((res) => setLeaveList(res.data))
    }, [])

    //Accept a leave request
    const acceptRequest = (data) => {
        SwalComp('warning', `Are you sure you want to accept the leave request of <em>${data.staffName}</em> ? <br> <em><b>Reason: </b>${data.reason}</em><br>`, 'Accept Request!')
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(process.env.REACT_APP_BACKEND + 'leaves/accept-request/' + data._id)
                        .then((res) => {
                            ToastComp(res.data.status, res.data.msg);
                            if (res.data.status === 'success') {
                                reloadWindow();
                            }
                        })
                        .catch((err) => ToastComp('error', err.message))
                }
            })
    }

    //Reject a leave request
    const rejectRequest = (data) => {
        SwalComp('warning', `Are you sure you want to delete the leave request of <em>${data.staffName}</em> ? <br> <em><b>Reason: </b>${data.reason}</em><br>`, 'Reject Request!')
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(process.env.REACT_APP_BACKEND + 'leaves/reject-request/' + data._id)
                        .then((res) => {
                            ToastComp(res.data.status, res.data.msg);
                            if (res.data.status === 'success') {
                                reloadWindow();
                            }
                        })
                        .catch((err) => ToastComp('error', err.message))
                }
            })
    }

    const columns = [
        {
            name: '#',
            cell: (row) => '#',
            width: '5%'
        },
        {
            name: 'Staff Name',
            selector: (row) => row.staffName,
            sortable: true
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
            },
            width: '10%'
        },
        {
            name: 'Action',
            selector: (row) => {
                if (row.status === 'Pending') {
                    return <>
                        <Tooltip title='Accept Leave Request'>
                            <button className='btn btn-success btn-sm mr-1' onClick={() => acceptRequest(row)}><i className='fa fa-check'></i></button>
                        </Tooltip>
                        <Tooltip title='Delete Leave Request'>
                            <button className='btn btn-danger btn-sm' onClick={() => rejectRequest(row)}><i className='fa fa-xmark px-1'></i></button>
                        </Tooltip>
                    </>
                } else {
                    return <>
                        <button className='btn btn-success btn-sm mr-1' disabled><i className='fa fa-check'></i></button>
                        <button className='btn btn-danger btn-sm' disabled><i className='fa fa-xmark px-1'></i></button>
                    </>
                }
            }
        }
    ]

    return (
        <>
            <div className='row mt-1'>
                <div className='col-12'>
                    <div className='card'>
                        <div className='card-header'>
                            <div className='card-title'>Leave Management</div>
                            <div className='card-tools'>
                                {<GoBack />}
                            </div>
                        </div>
                        <div className='card-body'>
                            {
                                CommonTable('Leaves List', columns, leaveList, ['reason', 'staffName'])
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StaffLeaves
