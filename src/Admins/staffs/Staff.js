import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import CommonTable from '../../Commons/CommonTable';
import Swal from 'sweetalert2';
import { reloadWindow, ToastComp } from '../../Commons/ToastComp';
import Switch from '@mui/material/Switch';

function Staff() {

    useEffect(() => {
        if (document.getElementById('staff-nav')) {
            document.getElementById('staff-nav').classList.add('active');
        }
        if (document.getElementById('staff-parent-nav')) {
            document.getElementById('staff-parent-nav').classList.add('active');
        }
        if (document.getElementById('staff-menu')) {
            document.getElementById('staff-menu').classList.add('menu-open');
        }
    })

    //Toggle switch and status
    const toggleStatus = (status, ID, name) => {
        Swal.fire({
            icon: 'warning',
            html: `Are you sure you want to change the status of <em>${name}</em> ?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, Change it!',
            cancelButtonText: 'No, Cancel!',
            reverseButtons: true
        })
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(process.env.REACT_APP_BACKEND + 'staff/change-status/' + ID, {
                        'status': status === 'active' ? 'inactive' : 'active'
                    })
                        .then((res) => {
                            ToastComp(res.data.status, res.data.msg);
                            reloadWindow();
                        })
                        .catch((err) => {
                            ToastComp('error', err.message);
                        })
                } else {
                    reloadWindow();
                }
            })
    }

    //fetching staffs from database
    const [StaffList, setStaffList] = useState([]);
    useEffect(() => {
        const getStaff = async () => {
            const staffData = await axios.get(process.env.REACT_APP_BACKEND + 'staff');
            const data = staffData.data;

            setStaffList(data);
        }

        getStaff();
    }, [])

    //Delete staff
    const deleteStaff = (data) => {
        Swal.fire({
            icon: 'warning',
            html: `Are you sure you want to delete the employee <em> ${data.fullname}</em> ? <br><br> <span className="text-sm">You won't be able to revert this and all the related data may get affected!</span>`,
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete!',
            cancelButtonText: 'No, Cancel!',
            reverseButtons: true
        })
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(process.env.REACT_APP_BACKEND + 'staff/delete/' + data._id)
                        .then((res) => {
                            ToastComp(res.data.status, res.data.msg);
                            if (res.data.status === 'success') {
                                reloadWindow();
                            }
                        })
                        .catch((err) => {
                            ToastComp('error', err.message);
                        })
                }
            })
    }

    //Add Permissions
    const permModel = (data) => {
        if (document.getElementById('staffName')) {
            document.getElementById('staffName').innerHTML = data.fullname;
        }
        if (document.getElementById('staffID')) {
            document.getElementById('staffID').value = data.staffID;
        }
    }

    const Permissions = ['Projects', 'Staff', 'Leaves', 'Attendance', 'Reports', 'Holidays', 'Notices'];

    const selectAll = () => {
        for (let index = 0; index < Permissions.length; index++) {
            const element = Permissions[index];
            document.getElementById(element).checked = true;
        }
        document.getElementById('clear').checked = false;
    }

    const clearAll = () => {
        for (let index = 0; index < Permissions.length; index++) {
            const element = Permissions[index];
            document.getElementById(element).checked = false;
        }
        document.getElementById('select').checked = false;
    }

    const clearForm = () => {
        if (document.getElementById('permForm')) {
            document.getElementById('permForm').reset();
        }
        setIsLoading(false);
    }

    const [isLoading, setIsLoading] = useState(false);
    const addPerm = () => {
        setIsLoading(true);
        const newArr = [];
        for (let index = 0; index < Permissions.length; index++) {
            const element = Permissions[index];
            if (document.getElementById(element).checked === true) {
                newArr.push(element);
            }
        }
        if (newArr.length > 0) {
            axios.post(process.env.REACT_APP_BACKEND + 'staff/add-permissions/' + document.getElementById('staffID').value, {
                permissions: newArr
            })
                .then((res) => {
                    ToastComp(res.data.status, res.data.msg);
                    setIsLoading(false);
                    if (res.data.status === 'success') {
                        reloadWindow();
                    }
                })
                .catch((err) => {
                    ToastComp('error', err.message);
                    setIsLoading(false);
                })
            // console.log(newArr)
        } else {
            ToastComp('error', 'Please select at least one checkbox!');
            setIsLoading(false);
        }
    }

    const permModelUpdate = (data) => {
        if (document.getElementById('staffName')) {
            document.getElementById('staffName').innerHTML = data.fullname;
        }
        if (document.getElementById('staffID')) {
            document.getElementById('staffID').value = data.staffID;
        }
        if (data.permissions.length > 0) {
            for (let index = 0; index < data.permissions.length; index++) {
                const element = data.permissions[index];
                document.getElementById(element).checked = true;
            }
        }
    }


    //Columns for database
    const columns = [
        {
            name: 'Avatar',
            selector: (row) => {
                var icon = '';
                if (row) {
                    if (row.pfp === 'maleIcon1.png') {
                        icon = '/images/maleIcon1.png';
                    } else if (row.pfp === 'femaleIcon1.png') {
                        icon = '/images/femaleIcon1.png';
                    } else if (row.pfp && row.pfp !== '') {
                        icon = process.env.REACT_APP_UPLOADS + 'staff/' + row.pfp;
                    }
                }

                return <Avatar sx={{ width: 35, height: 35 }} src={icon} alt={row.fullname}></Avatar>
            },
            width: '7%'
        },
        {
            name: 'Name',
            selector: (row) => row.fullname,
            sortable: true
        },
        {
            name: 'Staff ID',
            selector: (row) => row.staffID,
            sortable: true,
        },
        {
            name: 'Designation',
            selector: (row) => row.designation,
            sortable: true
        },
        {
            name: 'Mobile No.',
            selector: (row) => row.mobile,
        },
        {
            name: 'Company Email',
            selector: (row) => row.CompanyMail || '-'
        },
        {
            name: 'Joining Date',
            selector: (row) => row.joiningDate,
            sortable: true
        },
        {
            name: 'Status',
            selector: (row) => <Switch value={row.status} defaultChecked={row.status === 'active' ? true : false} color='info' onClick={() => toggleStatus(row.status, row.staffID, row.fullname)} />
        },
        {
            name: 'Action',
            selector: (row) => {
                return <>
                    <a href={'/admin/edit-employee?staff_id=' + row.staffID} className='btn btn-sm my-1 btn-primary'><i className='fa fa-edit'></i></a>
                    <a href={'/admin/view-employee?staff_id=' + row.staffID} className='btn btn-sm my-1 mx-1 btn-info'><i className='fa fa-eye'></i></a>
                    <button className='btn btn-sm my-1 btn-danger' onClick={() => deleteStaff(row)
                    }> <i className='fa fa-trash'></i></button >
                </>
            }
        }
    ]


    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));

    if (currentUser.usertype === 'admin') {
        const newCol = {
            name: 'Permissions',
            selector: (row) => row.permissions && row.permissions.length > 0 && row.permissions[0] !== '' ?
                <>
                    <ul className='mb-0'>
                        {row.permissions.map(permission => {
                            return <li>{permission}</li>
                        })}
                    </ul>
                    <button className='btn btn-link btn-sm' onClick={() => permModelUpdate(row)} data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i className='fa fa-edit mr-1'></i>Edit</button>
                </>
                : <button className='btn btn-link' data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => permModel(row)}><i className='fa fa-plus'></i> Add</button>
        }
        columns.splice(-1, 0, newCol);
    }

    return (
        <>
            <div className='row'>
                <div className='col-md-12 col-sm-12'>
                    <div className='card'>
                        <div className='card-header d-flex align-items-center justify-content-between'>
                            <h4 className='card-title w-50'>Staff</h4>
                            <div className='card-tools w-50'>
                                <a className='btn btn-primary btn-sm float-right' href='/admin/add-employee'>
                                    <i className='fa fa-plus'></i> Add New Staff
                                </a>
                            </div>
                        </div>
                        <div className='card-body'>
                            <div className='table-responsive'>
                                {CommonTable('Staff List', columns, StaffList, ['fullname', 'designation'])}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Add Permissions - <span id="staffName"></span></h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={clearForm}></button>
                        </div>
                        <div className="modal-body">
                            <form id="permForm">
                                <input type="hidden" id="staffID"></input>
                                <h6>Select one or more areas to give access to the staff:</h6>
                                <div className='px-2'>
                                    <div className='row my-2'>
                                        <div className='col'>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="select" />
                                                <label className="form-check-label" htmlFor="select" onClick={selectAll}>
                                                    Select All
                                                </label>
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="clear" />
                                                <label className="form-check-label" htmlFor="clear" onClick={clearAll}>
                                                    Clear All
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="Projects" />
                                        <label className="form-check-label" htmlFor="Projects">
                                            Projects
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="Staff" />
                                        <label className="form-check-label" htmlFor="Staff">
                                            Staff
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="Attendance" />
                                        <label className="form-check-label" htmlFor="Attendance">
                                            Attendance
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="Leaves" />
                                        <label className="form-check-label" htmlFor="Leaves">
                                            Leave Management
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="Reports" />
                                        <label className="form-check-label" htmlFor="Reports">
                                            Reports
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="Holidays" />
                                        <label className="form-check-label" htmlFor="Holidays">
                                            Holidays
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="Notices" />
                                        <label className="form-check-label" htmlFor="Notices">
                                            Notices
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={clearForm}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={addPerm} disabled={isLoading} >Allow Access</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Staff
