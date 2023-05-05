import { Tooltip } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CommonTable from '../Commons/CommonTable';
// import { formatDate } from '../Commons/FormatTime';
import GoBack from '../Commons/GoBack';

function Projects() {

    useEffect(() => {
        if (document.getElementById('project-nav')) {
            document.getElementById('project-nav').classList.add('active');
        }
    })

    //get current user
    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));

    //fetch projects
    const [projectList, setProjectList] = useState([]);
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'projects/projects-by-staff/' + currentUser.staffID)
            .then((res) => {
                if (res.data.length > 0) {
                    setProjectList(res.data)
                }
            })
    }, [currentUser.staffID])

    const columns = [
        {
            name: '#',
            cell: (row) => '#',
            width: '5%'
        },
        {
            name: 'Project ID',
            selector: (row) => row.projectID,
            sortable: true
        },
        {
            name: 'Project Name',
            selector: (row) => row.name,
            sortable: true
        },
        {
            name: 'Action',
            selector: (row) => <Tooltip title="View Details"><a className='btn btn-sm btn-info' href={'/staff/view-project?project_id=' + row.projectID}><i className='fa fa-eye'></i></a></Tooltip>
        }
    ]

    return (
        <>
            <div className='container-fluid mt-2'>
                <div className='card'>
                    <div className='card-header'>
                        <div className='card-title'>Projects</div>
                        <div className='card-tools'><GoBack /></div>
                    </div>
                    <div className='card-body'>
                        {CommonTable('Projects List', columns, projectList, ['name', 'projectID'])}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Projects
