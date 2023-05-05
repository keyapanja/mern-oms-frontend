import React, { useEffect, useState } from 'react'
import { CountWorkingDays, formatDate } from '../../Commons/FormatTime';
import GoBack from '../../Commons/GoBack'
import { reloadWindow, ToastComp } from '../../Commons/ToastComp'
import axios from 'axios'
import CommonTable from '../../Commons/CommonTable';


function Leaves() {

    useEffect(() => {
        if (document.getElementById('leave-nav')) {
            document.getElementById('leave-nav').classList.add('active');
        }
    })

    //get current user
    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));

    //Fetch staff data from database
    const [staffData, setStaffData] = useState([]);
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'users/logged-user-data/' + currentUser.user)
            .then((res) => setStaffData(res.data[0]))
    })

    //input variables
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [reason, setReason] = useState('');

    //Apply for leave
    const applyLeave = (e) => {
        e.preventDefault();
        if (start && end && reason) {
            if (CountWorkingDays(start, end) <= 0) {
                ToastComp('warning', 'Please select proper dates which include one or more days!')
            } else {
                const formdata = {
                    start: start,
                    end: end,
                    reason: reason,
                    staffID: currentUser.staffID,
                    total: CountWorkingDays(start, end),
                    staffName: staffData.fullname
                }

                axios.post(process.env.REACT_APP_BACKEND + 'leaves/apply-new-leave', formdata)
                    .then((res) => {
                        ToastComp(res.data.status, res.data.msg);
                        if (res.data.status === 'success') {
                            reloadWindow()
                        }
                    })
                    .catch((err) => ToastComp('error', err.message))
            }
        } else {
            ToastComp('error', 'Please fill in all the fields!')
        }
    }

    //Open edit modal
    const [editID, setEditID] = useState('');
    const openEditModal = (data) => {
        setStart(data.start);
        setEnd(data.end);
        setReason(data.reason);
        setEditID(data._id)
    }

    //Reset modal on close
    const resetModal = () => {
        setStart('');
        setEnd('');
        setReason('');
        setEditID('');
    }

    //Fetch leaves from database
    const [leaveList, setLeaveList] = useState([]);
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'leaves/get-leaves/' + currentUser.staffID)
            .then((res) => {
                const data = res.data;
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setLeaveList(data);
            })
            .catch((err) => console.log(err.message))
    }, [currentUser.staffID])

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
        },
        {
            name: 'Action',
            selector: (row) => {
                return <>
                    <button className='btn btn-sm btn-primary mr-1' disabled={row.status === 'Pending' ? false : true} data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => openEditModal(row)}><i className='fa fa-edit'></i></button>
                </>
            }
        }
    ]

    //Edit leave request
    const editLeave = (e) => {
        e.preventDefault();
        if (start && end && reason) {
            if (CountWorkingDays(start, end) <= 0) {
                ToastComp('warning', 'Please select proper dates which include one or more days!')
            } else {
                const formdata = {
                    start: start,
                    end: end,
                    reason: reason,
                    total: CountWorkingDays(start, end),
                    staffName: staffData.fullname
                }

                axios.post(process.env.REACT_APP_BACKEND + 'leaves/edit-leave/' + editID, formdata)
                    .then((res) => {
                        ToastComp(res.data.status, res.data.msg);
                        if (res.data.status === 'success') {
                            reloadWindow()
                        }
                    })
                    .catch((err) => ToastComp('error', err.message))
            }
        } else {
            ToastComp('error', 'Please fill in all the fields!')
        }
    }

    return (
        <>
            <div className='d-flex px-2 justify-content-end my-3'>
                <GoBack />
            </div>
            <div className='card'>
                <div className='card-header'>
                    <div className='card-title'>Leaves</div>
                    <div className='card-tools'>
                        <button className='btn btn-primary btn-sm' data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                            <i className='fa fa-plus'></i> New Leave Request
                        </button>
                    </div>
                </div>

                <div className='card-body'>
                    {
                        CommonTable('Leaves List', columns, leaveList, ['reason'])
                    }
                </div>
            </div>


            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 m-0" id="staticBackdropLabel">Request for Leave</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={resetModal}></button>
                        </div>
                        <form onSubmit={applyLeave}>
                            <div className="modal-body">
                                <div className='row mb-2'>
                                    <div className='col-5'>
                                        <input type='date' className='form-control' value={start} onChange={(e) => setStart(e.target.value)}></input>
                                    </div>
                                    <div className='col-2 d-flex justify-content-center align-items-center'>
                                        <i className='fa fa-right-left'></i>
                                    </div>
                                    <div className='col-5'>
                                        <input type='date' className='form-control' value={end} onChange={(e) => setEnd(e.target.value)}></input>
                                    </div>
                                    {
                                        start && end && <div className='col-12 mt-1'>Total Days: {CountWorkingDays(start, end)}</div>
                                    }
                                </div>
                                <div className='form-group'>
                                    <label>Reason</label>
                                    <textarea className='form-control' rows={4} value={reason} onChange={(e) => setReason(e.target.value)}></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetModal}>Close</button>
                                <button type="submit" className="btn btn-primary">Apply</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="editModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 m-0" id="staticBackdropLabel">Edit Leave Request</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={resetModal}></button>
                        </div>
                        <form onSubmit={editLeave}>
                            <div className="modal-body">
                                <input type="hidden" value={editID}></input>
                                <div className='row mb-2'>
                                    <div className='col-5'>
                                        <input type='date' className='form-control' value={start} onChange={(e) => setStart(e.target.value)}></input>
                                    </div>
                                    <div className='col-2 d-flex justify-content-center align-items-center'>
                                        <i className='fa fa-right-left'></i>
                                    </div>
                                    <div className='col-5'>
                                        <input type='date' className='form-control' value={end} onChange={(e) => setEnd(e.target.value)}></input>
                                    </div>
                                    {
                                        start && end && <div className='col-12 mt-1'>Total Days: {CountWorkingDays(start, end)}</div>
                                    }
                                </div>
                                <div className='form-group'>
                                    <label>Reason</label>
                                    <textarea className='form-control' rows={4} value={reason} onChange={(e) => setReason(e.target.value)}></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetModal}>Close</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Leaves
