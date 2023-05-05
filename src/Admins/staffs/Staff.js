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
            html: `Are you sure you want to delete the employee <em> ${data.fullname}</em> ? <br><br> <span class="text-sm">You won't be able to revert this and all the related data may get affected!</span>`,
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
            }
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
        </>
    )
}

export default Staff
