import axios from 'axios';
import React, { useEffect, useState } from 'react'
import GoBack from '../Commons/GoBack';
import CommonTable from '../Commons/CommonTable';
import { Tooltip } from '@mui/material';
import { formatDate } from '../Commons/FormatTime';
import { reloadWindow, SwalComp, ToastComp } from '../Commons/ToastComp';

function Tasks() {

    useEffect(() => {
        if (document.getElementById('task-nav')) {
            document.getElementById('task-nav').classList.add('active');
        }
    })

    //get current user
    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));

    //Fetch employee tasks
    const [taskList, setTaskList] = useState([]);
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'projects/get-tasks/' + currentUser.staffID)
            .then((res) => setTaskList(res.data))
    }, [currentUser.staffID])

    //Mark a task as completed
    const markCompleted = (data) => {
        SwalComp('warning', `<b>Task: </b>${data.task} <br> <br> Are you sure this task is completed?`, 'Mark as Completed!')
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(process.env.REACT_APP_BACKEND + 'projects/task-completed/' + data._id)
                        .then((res) => {
                            ToastComp(res.data.status, res.data.msg);
                            if (res.data.status === 'success') {
                                reloadWindow();
                            }
                        })
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
            name: 'Task',
            selector: (row) => row.task,
            sortable: true
        },
        {
            name: 'Status',
            selector: (row) => {
                if (row.status === 'Pending') {
                    return <span className='badge badge-warning badge-pill'>Pending</span>
                } else if (row.status === 'Completed') {
                    return <span className='badge badge-success badge-pill'>Completed</span>
                }
            }
        },
        {
            name: 'Assigned on',
            selector: (row) => formatDate(row.createdAt),
            sortable: true
        },
        {
            name: 'Action',
            selector: (row) => {
                return <>
                    <Tooltip title="Mark as Done">
                        <button className='btn btn-sm btn-success' disabled={row.status !== 'Pending'} onClick={() => markCompleted(row)}><i className='fa fa-check'></i></button>
                    </Tooltip>
                </>
            }
        }
    ]

    return (
        <>
            <div className='container-fluid mt-2'>
                <div className='card'>
                    <div className='card-header'>
                        <div className='card-title'>Tasks</div>
                        <div className='card-tools'>
                            <GoBack />
                        </div>
                    </div>
                    <div className='card-body'>
                        {CommonTable('Tasks List', columns, taskList, ['task'])}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Tasks
