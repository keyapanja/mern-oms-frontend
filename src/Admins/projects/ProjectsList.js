import { Avatar, AvatarGroup, Tooltip } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CommonTable from '../../Commons/CommonTable';
import { reloadWindow, SwalComp, ToastComp } from '../../Commons/ToastComp';
import GetUserPermissions from '../../Commons/GetUserPermissions';

function ProjectsList() {

    useEffect(() => {
        if (document.getElementById('projects-nav')) {
            document.getElementById('projects-nav').classList.add('active');
        }
        if (document.getElementById('project-parent-nav')) {
            document.getElementById('project-parent-nav').classList.add('active');
        }
        if (document.getElementById('project-menu')) {
            document.getElementById('project-menu').classList.add('menu-open');
        }
    })

    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));
    var getUser = GetUserPermissions(currentUser.user);
    const [staffAccess, setStaffAccess] = useState(false);
    useEffect(() => {
        if (getUser && getUser.permissions && getUser.permissions.find(per => per === 'Projects')) {
            setStaffAccess(true);
        }
    }, [getUser])

    //Fetch projects from database
    const [projectsList, setProjectsList] = useState([]);
    useEffect(() => {
        const fetchProjects = async () => {
            const projects = await axios.get(process.env.REACT_APP_BACKEND + 'projects/get-projects');
            setProjectsList(projects.data);
        }

        fetchProjects();
    }, [])

    //Delete Project
    const deleteProject = (data) => {
        SwalComp('warning', `Are you sure you want to delete the project <em>${data.name}</em> ? <br> <span class='text-sm'>You won't be able to revert this and all the related data may get affected!</span>`, 'Yes, Delete !', 'No, Cancel !')
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(process.env.REACT_APP_BACKEND + 'projects/delete-project/' + data.projectID)
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
            name: 'Client / Company',
            selector: (row) => row.client,
            sortable: true
        },
        {
            name: 'Team',
            selector: (row) => {
                return <AvatarGroup total={row.team.length} max={8}>
                    {
                        row.team.map((item) => {
                            var icon = '';
                            if (item) {
                                if (item.pfp === 'maleIcon1.png') {
                                    icon = '/images/maleIcon1.png';
                                } else if (item.pfp === 'femaleIcon1.png') {
                                    icon = '/images/femaleIcon1.png';
                                } else if (item.pfp && item.pfp !== '') {
                                    icon = process.env.REACT_APP_UPLOADS + 'staff/' + item.pfp;
                                }
                            }

                            return <Tooltip title={item.name} key={item.staffID}>
                                <Avatar
                                    sx={{ width: 24, height: 24, cursor: 'pointer', bgcolor: '#17a2b8' }}
                                    alt={item.name}
                                    src={icon}
                                    onClick={() => window.location.href = `${(currentUser && currentUser.usertype === 'staff' && staffAccess ? '/staff' : '/admin')}/view-employee?staff_id=` + item.staffID}
                                ></Avatar>
                            </Tooltip>
                        })
                    }
                </AvatarGroup>
            }
        },
        {
            name: 'Action',
            selector: (row) => {
                return <>
                    <Tooltip title="Edit Project"><a className='btn btn-sm btn-primary' href={(currentUser && currentUser.usertype === 'staff' && staffAccess ? '/staff' : '/admin') + '/edit-project?project_id=' + row.projectID}><i className='fa fa-edit'></i></a></Tooltip>
                    <Tooltip title="View Project"><a href={(currentUser && currentUser.usertype === 'staff' && staffAccess ? '/staff' : '/admin') + '/view-project?project_id=' + row.projectID} className='btn btn-sm btn-info mx-1'><i className='fa fa-eye'></i></a></Tooltip>
                    <Tooltip title="Delete Project"><button className='btn btn-sm btn-danger' onClick={() => deleteProject(row)}><i className='fa fa-trash'></i></button></Tooltip>
                </>
            }
        }
    ]

    return (
        <>
            <div className='row'>
                <div className='card'>
                    <div className='card-header d-flex align-items-center justify-content-between'>
                        <h4 className='card-title w-50'>Projects</h4>
                        <div className='card-tools w-50'>
                            <a className='btn btn-primary btn-sm float-right' href='/admin/add-project'>
                                <i className='fa fa-plus'></i> Add New Project
                            </a>
                        </div>
                    </div>
                    <div className='card-body'>
                        <div>
                            {CommonTable('Projects List', columns, projectsList, ['name'])}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProjectsList
