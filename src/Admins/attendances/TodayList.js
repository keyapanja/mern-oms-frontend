import { Tooltip } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CommonTable from '../../Commons/CommonTable';
import { formatDate } from '../../Commons/FormatTime'
import GoBack from '../../Commons/GoBack'
import GetUserPermissions from '../../Commons/GetUserPermissions';

function TodayList() {

    useEffect(() => {
        if (document.getElementById('attn-nav')) {
            document.getElementById('attn-nav').classList.add('active');
        }
    })

    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));
    var getUser = GetUserPermissions(currentUser.user);
    const [staffAccess, setStaffAccess] = useState(false);
    useEffect(() => {
        if (getUser && getUser.permissions && getUser.permissions.find(per => per === 'Attendance')) {
            setStaffAccess(true);
        }
    }, [getUser])


    const [attnList, setAttnList] = useState([]);
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'attendance/staff-attendance')
            .then((res) => setAttnList(res.data))
    })

    const columns = [
        {
            name: '#',
            cell: (row) => '#',
            width: '5%'
        },
        {
            name: 'Name',
            selector: (row) => row.name,
            sortable: true
        },
        {
            name: 'Staff ID',
            selector: (row) => row.staffID,
            sortable: true
        },
        {
            name: 'Status',
            selector: (row) => {
                if (row.attnToday) {
                    return <span className='badge badge-pill badge-success'>Present</span>
                } else {
                    return <span className='badge badge-pill badge-danger'>Absent</span>
                }
            }
        },
        {
            name: 'Action',
            selector: (row) => {
                return <>
                    <Tooltip title='View Attendance'><a className='btn btn-sm btn-primary mr-1' href={(currentUser && currentUser.usertype === 'staff' && staffAccess ? '/staff' : '/admin') + '/view-attendance?staff_id=' + row.staffID}><i className='fa fa-clipboard-list'></i></a></Tooltip>
                    <Tooltip title='View Leaves'><a className='btn btn-sm btn-secondary' href={(currentUser && currentUser.usertype === 'staff' && staffAccess ? '/staff' : '/admin') + '/view-leaves?staff_id=' + row.staffID}><i className='fa fa-clipboard'></i></a></Tooltip>
                </>
            }
        }
    ]

    return (
        <>
            <div className='card'>
                <div className='card-header'>
                    <div className='card-title'>
                        Staff Attendance on : {formatDate(new Date())}
                    </div>
                    <div className='card-tools'>
                        <GoBack />
                    </div>
                </div>

                <div className='card-body'>
                    {CommonTable('Attendance List', columns, attnList, ['name'])}
                </div>
            </div>
        </>
    )
}

export default TodayList
