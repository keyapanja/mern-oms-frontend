import React, { useEffect, useState } from 'react';
import { diffDates, formatDate } from './FormatTime';
import { reloadWindow, SwalComp, ToastComp } from './ToastComp';
import axios from 'axios';
import GoBack from './GoBack';
import CommonTable from './CommonTable';
import { Tooltip } from '@mui/material';
import GetUserPermissions from './GetUserPermissions';

function Holidays() {

    useEffect(() => {
        if (document.getElementById('holiday-nav')) {
            document.getElementById('holiday-nav').classList.add('active');
        }
    })

    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));

    //Style the date pickers according to selected theme
    const currentTheme = window.localStorage.getItem('currentOMSTheme');

    var getUser = GetUserPermissions(currentUser.user);
    const [staffAccess, setStaffAccess] = useState(false);
    useEffect(() => {
        if (getUser && getUser.permissions && getUser.permissions.find(per => per === 'Holidays')) {
            setStaffAccess(true);
        }
    }, [getUser])

    if (currentTheme === 'dark') {
        const calendarIcon = document.getElementsByClassName('css-i4bv87-MuiSvgIcon-root');
        if (calendarIcon && calendarIcon.length > 0) {
            for (let index = 0; index < calendarIcon.length; index++) {
                const element = calendarIcon[index];
                element.style.color = 'whitesmoke';

            }
        }

        const dateInput = document.getElementsByClassName('css-nxo287-MuiInputBase-input-MuiOutlinedInput-input');
        if (dateInput && dateInput.length > 0) {
            for (let index = 0; index < dateInput.length; index++) {
                const element = dateInput[index];
                element.style.color = 'whitesmoke';
            }
        }

        const border = document.getElementsByClassName('css-1d3z3hw-MuiOutlinedInput-notchedOutline');
        if (border && border.length > 0) {
            for (let index = 0; index < border.length; index++) {
                const element = border[index];
                element.style.borderColor = '#6c757d';
            }
        }
    }

    //Input variables
    const [name, setName] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [totalDays, setTotalDays] = useState('');
    //Total number of days 
    useEffect(() => {
        if (fromDate && toDate) {
            const diff = diffDates(fromDate, toDate);
            if (diff >= 1) {
                setTotalDays(<span className='text-success text-sm'>Total days : {diff}</span>);
            } else {
                setTotalDays(<span className='text-danger text-sm'>Total days : {diff}</span>);
            }
        }
    }, [fromDate, toDate])

    //Reset data on close modal
    const closeModal = () => {
        setName('');
        setFromDate('');
        setToDate('');
        setTotalDays('');
        setEditID('');
    }

    //Save holiday
    const saveHoliday = (e) => {
        e.preventDefault();
        if (name && fromDate && toDate) {
            if (diffDates(fromDate, toDate) >= 1) {
                const formData = {
                    'name': name,
                    'from': formatDate(fromDate),
                    'to': formatDate(toDate),
                    'total': diffDates(fromDate, toDate)
                }

                axios.post(process.env.REACT_APP_BACKEND + 'others/add-holiday', formData)
                    .then((res) => {
                        ToastComp(res.data.status, res.data.msg);
                        if (res.data.status === 'success') {
                            reloadWindow();
                        }
                    })
                    .catch((err) => ToastComp('error', err.message))
            } else {
                ToastComp('warning', 'Please enter correct dates..!')
            }
        } else {
            ToastComp('error', 'Please fill in all the fields!')
        }
    }

    //Fetch holidays from database
    const [holiList, setHoliList] = useState([]);
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'others/fetch-holidays')
            .then((res) => setHoliList(res.data))
    }, [])

    const dateFormat = (d) => {
        let date = new Date(d);
        let day = date.getDate()
        if (day < 10) {
            day = '0' + day
        }

        let month = date.getMonth() + 1;
        if (month < 10) {
            month = '0' + month
        }

        let year = date.getFullYear();
        return year + '-' + month + '-' + day
    }

    //Open edit Holiday modal
    const [editID, setEditID] = useState('');
    const openEditModal = (data) => {
        setName(data.name);
        setFromDate(dateFormat(data.from));
        setToDate(dateFormat(data.to));
        setTotalDays(<span className='text-success text-sm'>Total days : {data.total}</span>);
        setEditID(data._id)
    }

    //Delete holiday
    const deleteHoliday = (data) => {
        SwalComp('warning', `Are you sure you want to delete the holiday <em>${data.name}</em> ?`, 'Yes, Delete!')
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(process.env.REACT_APP_BACKEND + 'others/delete-holiday/' + data._id)
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
            name: 'Holiday Name',
            selector: (row) => row.name,
            sortable: true
        },
        {
            name: 'From',
            selector: (row) => row.from,
            sortable: true
        },
        {
            name: 'To',
            selector: (row) => row.to,
            sortable: true
        },
        {
            name: 'Total Days',
            selector: (row) => row.total
        }
    ]

    if (currentUser.usertype === 'admin' || staffAccess) {
        const newCol = {
            name: 'Action',
            selector: (row) => <>
                <Tooltip title='Edit holiday'><button className='btn btn-sm btn-primary mr-1' data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => openEditModal(row)}><i className='fa fa-edit'></i></button></Tooltip>
                <Tooltip title='Delete holiday'><button className='btn btn-sm btn-danger mr-1' onClick={() => deleteHoliday(row)}><i className='fa fa-trash'></i></button></Tooltip>
            </>
        }

        columns.push(newCol);
    }

    //Save edited data
    const editHoliday = (e) => {
        e.preventDefault();
        if (name && fromDate && toDate) {
            if (diffDates(fromDate, toDate) >= 1) {
                const formData = {
                    'name': name,
                    'from': formatDate(fromDate),
                    'to': formatDate(toDate),
                    'total': diffDates(fromDate, toDate)
                }

                axios.post(process.env.REACT_APP_BACKEND + 'others/edit-holiday/' + editID, formData)
                    .then((res) => {
                        ToastComp(res.data.status, res.data.msg);
                        if (res.data.status === 'success') {
                            reloadWindow();
                        }
                    })
                    .catch((err) => ToastComp('error', err.message))
            } else {
                ToastComp('warning', 'Please enter correct dates..!')
            }
        } else {
            ToastComp('error', 'Please fill in all the fields!')
        }
    }

    return (
        <>
            <div className='d-flex justify-content-start my-3'>
                <GoBack />
            </div>
            <div className='card'>
                <div className='card-header'>
                    <h4 className='card-title m-0'>Holidays</h4>
                    <div className='row card-tools'>
                        {
                            ((currentUser && currentUser.usertype === 'admin') || staffAccess) &&
                            <>
                                <button className='btn btn-primary float-right btn-sm' data-bs-toggle="modal" data-bs-target="#addModal">
                                    <i className='fa fa-plus'></i> New Holiday
                                </button>
                            </>
                        }
                    </div>
                </div>

                <div className='card-body'>
                    {CommonTable('Holidays List', columns, holiList, ['name'])}
                </div>
            </div>

            <div className="modal fade" id="addModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-between align-items-center">
                            <h4 className="modal-title fs-5" id="staticBackdropLabel">Add Holiday</h4>
                            <button type="button" className="btn btn-link" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}>
                                <i className='fa fa-xmark'></i>
                            </button>
                        </div>
                        <form onSubmit={saveHoliday}>
                            <div className="modal-body">
                                <div className='form-group mb-3'>
                                    <label>Holiday Name <span className='text-orange'>*</span></label>
                                    <input className='form-control' placeholder='Enter Holiday Name' value={name} onChange={(e) => setName(e.target.value)}></input>
                                </div>
                                <div className='form-group'>
                                    <div className='row'>
                                        <div className='col'>
                                            <label>From <span className='text-orange'>*</span></label>
                                            <input type='date' className='form-control' value={fromDate} onChange={(e) => setFromDate(e.target.value)}></input>
                                        </div>
                                        <div className='col'>
                                            <label>To <span className='text-orange'>*</span></label>
                                            <input type='date' className='form-control' value={toDate} onChange={(e) => setToDate(e.target.value)}></input>
                                        </div>
                                    </div>
                                    <div className='row mt-2'>
                                        {
                                            <span>{totalDays}</span>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeModal}>Close</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="editModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-between align-items-center">
                            <h4 className="modal-title fs-5" id="staticBackdropLabel">Add Holiday</h4>
                            <button type="button" className="btn btn-link" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}>
                                <i className='fa fa-xmark'></i>
                            </button>
                        </div>
                        <form onSubmit={editHoliday}>
                            <div className="modal-body">
                                <input type='hidden' value={editID}></input>
                                <div className='form-group mb-3'>
                                    <label>Holiday Name <span className='text-orange'>*</span></label>
                                    <input className='form-control' placeholder='Enter Holiday Name' value={name} onChange={(e) => setName(e.target.value)}></input>
                                </div>
                                <div className='form-group'>
                                    <div className='row'>
                                        <div className='col'>
                                            <label>From <span className='text-orange'>*</span></label>
                                            <input type='date' className='form-control' value={fromDate} onChange={(e) => setFromDate(e.target.value)}></input>
                                        </div>
                                        <div className='col'>
                                            <label>To <span className='text-orange'>*</span></label>
                                            <input type='date' className='form-control' value={toDate} onChange={(e) => setToDate(e.target.value)}></input>
                                        </div>
                                    </div>
                                    <div className='row mt-2'>
                                        {
                                            <span>{totalDays}</span>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeModal}>Close</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Holidays
