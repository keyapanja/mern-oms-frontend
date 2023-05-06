import { Skeleton, Tooltip } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { formatCurrency } from '../../Commons/FormatTime';
import GoBack from '../../Commons/GoBack';
import Select from 'react-select';
import { reloadWindow, ToastComp } from '../../Commons/ToastComp';
import parse from 'html-react-parser';
import ProjectTasks from './ProjectTasks';
import ProjectFiles from '../../Commons/ProjectFiles';
import GetUserPermissions from '../../Commons/GetUserPermissions';

function ViewProject() {

    useEffect(() => {
        if (document.getElementById('project-parent-nav')) {
            document.getElementById('project-parent-nav').classList.add('active');
        }
    })

    //get current user
    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));
    var getUser = GetUserPermissions(currentUser.user);
    const [staffAccess, setStaffAccess] = useState(false);
    useEffect(() => {
        if (getUser && getUser.permissions && getUser.permissions.find(per => per === 'Projects')) {
            setStaffAccess(true);
        }
    }, [getUser])


    //get project id from url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const projectID = urlParams.get('project_id');

    //Get Project data
    const [projectTeam, setProjectTeam] = useState([]);
    const [projectData, setProjectData] = useState('');
    useEffect(() => {
        const fetchProject = async () => {
            const projectData = await axios.get(process.env.REACT_APP_BACKEND + 'projects/get-project/' + projectID);
            const data = projectData.data;
            if (!data) {
                const noDataDiv = document.getElementById('noDataDiv');
                if (noDataDiv) {
                    window.setTimeout(() => {
                        noDataDiv.style.display = 'flex';
                    }, 1500)
                }
            } else {
                setProjectData(data);
                setProjectTeam(data.team);
            }
        }

        fetchProject();
    }, [projectID])

    //fetching staffs from database
    const [secStaffList, secsetStaffList] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    useEffect(() => {
        const getStaff = async () => {
            const staffData = await axios.get(process.env.REACT_APP_BACKEND + 'staff');
            const data = staffData.data;

            let arr = [];
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                const obj = {
                    value: {
                        staffID: element.staffID,
                        name: element.fullname,
                        pfp: element.pfp,
                        designation: element.designation
                    },
                    label: element.fullname
                }
                arr.push(obj);
            }
            secsetStaffList(arr);

            let selects = [];
            if (projectData && projectData.team.length > 0) {
                for (let index = 0; index < projectData.team.length; index++) {
                    const teamMem = projectData.team[index];
                    const find = data.find(item => item.staffID === teamMem.staffID);
                    selects.push(data.indexOf(find))
                }
            }

            setSelectedTeam(selects);

        }

        getStaff();
    }, [projectData])

    var StaffList = [];
    if (secStaffList.length > 0) {
        StaffList = secStaffList
    }

    //Edit Team
    const [editable, setEditable] = useState(false);
    const [newTeam, setNewTeam] = useState([]);
    const changeTeam = () => {
        if (newTeam && newTeam.length > 0) {
            axios.post(process.env.REACT_APP_BACKEND + 'projects/update-team/' + projectID, {
                newTeam: newTeam.map(item => item.value)
            })
                .then((res) => {
                    ToastComp(res.data.status, res.data.msg);
                    if (res.data.status === 'success') {
                        reloadWindow();
                    }
                })
                .catch((err) => {
                    ToastComp('error', err.message)
                })
        } else {
            ToastComp('error', 'Please choose at least one employee!');
        }
    }

    //Assign tasks to staff and store data in an array
    const [taskStaff, setTaskStaff] = useState('');
    const [taskCont, setTaskCont] = useState('');
    const [taskTable, setTaskTable] = useState([]);
    const enterTask = () => {
        if (!taskStaff) {
            ToastComp('error', 'Please select a staff to assign a task!')
        } else if (!taskCont) {
            ToastComp('error', 'Please assign a task to the staff!')
        } else {
            let obj = {
                'staffID': taskStaff,
                'name': projectTeam.find(item => item.staffID === taskStaff).name,
                'task': taskCont,
                'projectID': projectID
            }
            setTaskTable(taskTable => [...taskTable, obj])
            setTaskStaff('')
            setTaskCont('');
        }

    }

    //Reset form
    const resetForm = () => {
        setTaskCont('');
        setTaskStaff('');
        setTaskTable([]);
    }

    //Show the tasks table if it has some value
    const [showTasks, setShowTasks] = useState(false);
    useEffect(() => {
        if (taskTable.length === 0) {
            setShowTasks(false)
        } else {
            setShowTasks(true)
        }
    }, [taskTable])

    //Remove a particular task
    const removeTask = (index) => {
        taskTable.splice(index, 1);
        setTaskTable(taskTable => [...taskTable])
    }

    //Change project status
    const projectStatus = (status) => {
        if (status) {
            axios.post(process.env.REACT_APP_BACKEND + 'projects/change-status/' + projectID, { status: status })
                .then((res) => {
                    ToastComp(res.data.status, res.data.msg)
                    if (res.data.status === 'success') {
                        reloadWindow();
                    }
                })
                .catch((err) => {
                    ToastComp('error', err.message);
                })
            // console.log(status);
        }
    }

    //Save all the tasks
    const saveTasks = (e) => {
        e.preventDefault();
        if (taskTable.length > 0 || (taskStaff && taskCont)) {
            var formdata = [];
            if (taskTable.length > 0) {
                formdata = taskTable
            } else if (taskStaff && taskCont) {
                const taskObj = {
                    'staffID': taskStaff,
                    'name': projectTeam.find(item => item.staffID === taskStaff).name,
                    'task': taskCont,
                    'projectID': projectID
                }
                formdata.push(taskObj);
            }

            if (formdata.length > 0) {
                axios.post(process.env.REACT_APP_BACKEND + 'projects/add-task', { tasks: formdata, projectName: projectData.name, by: currentUser.staffID })
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
        } else {
            ToastComp('error', 'Please assign at least one task to any of the team members!')
        }
    }

    //Fetch all tasks related to this project
    const [taskWidth, setTaskWidth] = useState(0);
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'projects/get-project-tasks/' + projectID)
            .then((res) => {
                const total = res.data.length;
                let completed = 0;
                for (let index = 0; index < total; index++) {
                    const element = res.data[index];
                    if (element.status === 'Completed') {
                        completed = completed + 1;
                    }
                }
                const percentage = Math.floor((completed / total) * 100);
                setTaskWidth(percentage || 0);
            })
    }, [projectID])

    return (
        <>
            <div className='position-relative'>
                <div className='mb-3 mt-2 d-flex justify-content-between w-100'>
                    <GoBack />
                    <div className='mr-2'>
                        <div className='btn-group' role='group'>
                            <a className='btn btn-primary btn-sm' href={(currentUser && currentUser.usertype === 'staff' && staffAccess ? '/staff' : '/admin') + '/edit-project?project_id=' + projectID}>
                                <i className='fa fa-edit mr-1'></i> Edit
                            </a>
                            {/* <button className='btn btn-sm btn-info'>
                                <i className='fa fa-print mr-1'></i> Print
                            </button> */}
                        </div>
                    </div>
                </div>
                <div className='row mt-4'>
                    <div className='card card-info p-0'>
                        {
                            projectData ?
                                <>
                                    <div className='card-header w-100' style={{ textAlign: 'center' }}>
                                        <h5 className='mx-0 mt-0 mb-1'>{projectData.name}</h5>
                                        <span>#{projectData.projectID}</span>
                                    </div>
                                    <div className='card-body'>

                                        <div className='my-2 d-flex justify-content-center align-items-center'>
                                            <div className='text-center'>
                                                <div>
                                                    <h6 className='d-inline-block mr-2'>Project Status </h6>
                                                    {
                                                        projectData.status && projectData.status === 'Yet to Start' &&
                                                        <span className='badge badge-sm badge-warning'>Yet to Start</span>
                                                    }
                                                    {
                                                        projectData.status && projectData.status === 'On-Going' &&
                                                        <span className='badge badge-sm badge-info'>On-Going</span>
                                                    }
                                                    {
                                                        projectData.status && projectData.status === 'On-Hold' &&
                                                        <span className='badge badge-sm badge-secondary'>On-Hold</span>
                                                    }
                                                    {
                                                        projectData.status && projectData.status === 'Completed' &&
                                                        <span className='badge badge-sm badge-warning'>Completed</span>
                                                    }
                                                </div>
                                                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                    <button type="button" className="btn btn-warning" onClick={() => projectStatus('Yet to Start')} disabled={projectData.status && projectData.status === 'Yet to Start'} >Yet to Start</button>
                                                    <button type="button" className="btn btn-info" onClick={() => projectStatus('On-Going')} disabled={projectData.status && projectData.status === 'On-Going'}>On-Going</button>
                                                    <button type="button" className="btn btn-secondary" onClick={() => projectStatus('On-Hold')} disabled={projectData.status && projectData.status === 'On-Hold'}>On-Hold</button>
                                                    <button type="button" className="btn btn-success" onClick={() => projectStatus('Completed')} disabled={projectData.status && projectData.status === 'Completed'}>Completed</button>
                                                </div>
                                            </div>
                                        </div>

                                        <p>
                                            {projectData.budget &&
                                                <><b className='mr-1'>Budget : </b> {formatCurrency(projectData.budget, projectData.currency)} (Estimated)</>
                                            }
                                        </p>
                                        <p>
                                            <b>Project Description : </b> {parse(projectData.desc)}
                                        </p>

                                        <div className='row pt-3'>
                                            <div className='col-md-6 col-sm-12'>
                                                <div className='card'>
                                                    <div className='card-header'>
                                                        <span className='card-title' style={{ padding: 0, fontSize: '18px', fontWeight: 'bold' }}>Team</span>
                                                        <div className='card-tools'>
                                                            <button type="button" className="btn btn-info btn-sm mr-1" data-card-widget="collapse">
                                                                <i class="fas fa-minus"></i>
                                                            </button>
                                                            {
                                                                editable ?
                                                                    <button className='card-tools btn btn-sm btn-secondary' onClick={() => setEditable(false)}>
                                                                        <i className='fa fa-xmark'></i> Cancel
                                                                    </button>
                                                                    :
                                                                    <button className='card-tools btn btn-sm btn-info' onClick={() => setEditable(true)}>
                                                                        <i className='fa fa-edit'></i> Edit
                                                                    </button>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className='card-body py-1'>
                                                        <div className='my-3'>
                                                            {
                                                                editable &&
                                                                <div className='row'>
                                                                    <div className='d-inline-block col-11 px-0'>
                                                                        <Select
                                                                            defaultValue={selectedTeam && selectedTeam.map(item => StaffList[item])}
                                                                            isMulti
                                                                            closeMenuOnSelect={false}
                                                                            hideSelectedOptions={true}
                                                                            name="team"
                                                                            className="basic-multi-select"
                                                                            classNamePrefix="select"
                                                                            options={StaffList}
                                                                            onChange={(e) => setNewTeam(e)}
                                                                            placeholder='Select from Staff...'
                                                                        />
                                                                    </div>
                                                                    <div className='col-1'>
                                                                        <Tooltip title='Save'>
                                                                            <button className='btn btn-success' onClick={changeTeam}><i className='fa fa-check'></i></button>
                                                                        </Tooltip>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                        <div>
                                                            {
                                                                projectData.team.length > 0 &&
                                                                projectData.team.map((item) => {
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
                                                                    return <div key={item.staffID} className='my-3 d-flex align-items-center justify-content-between'>
                                                                        <div className='d-inline-block'>
                                                                            <div className='d-inline-block bg-cyan rounded-pill mr-3 elevation-2' style={{ overflow: 'hidden' }}>
                                                                                <img src={icon} width="42px" height="42px" alt={item.name}></img>
                                                                            </div>
                                                                            <div className='d-inline-block'>
                                                                                <b className='d-block'>{item.name}</b>
                                                                                <span>{item.designation}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='mt-4'>
                                                    {<ProjectFiles />}
                                                </div>
                                            </div>

                                            <div className='col-md-6 col-sm-12'>
                                                <div className='card'>
                                                    <div className='card-header'>
                                                        <span className='card-title' style={{ padding: 0, fontSize: '18px', fontWeight: 'bold' }}>Tasks</span>
                                                        <div className='card-tools'>
                                                            <button type="button" className="btn btn-info btn-sm mr-1" data-card-widget="collapse">
                                                                <i class="fas fa-minus"></i>
                                                            </button>
                                                            <button className='btn btn-sm btn-info' data-bs-toggle="modal" data-bs-target="#addTaskModal">
                                                                <i className='fa fa-list-check'></i> Add Tasks
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className='card-body p-3' >
                                                        {
                                                            taskWidth !== 0 &&
                                                            <div className='row py-3 px-4'>
                                                                <div className="progress rounded-pill p-0" role="progressbar" aria-label="Success striped example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                                                    <div className="progress-bar progress-bar-striped bg-success rounded-pill" style={{ width: `${taskWidth}%` }}>{taskWidth}%</div>
                                                                </div>
                                                            </div>
                                                        }
                                                        <div className='p-2' style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                            <ProjectTasks projectID={projectID} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className='card-header w-100 d-flex justify-content-center'>
                                        <div>
                                            <Skeleton variant="rounded" width={350} height={35} />
                                            <div className='w-100 d-flex justify-content-center'>
                                                <Skeleton variant="rounded" width={150} height={20} className='mt-1' />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-body'>
                                        <Skeleton variant="rounded" height={100} />
                                        <Skeleton variant="rounded" height={80} width='30%' className='mt-2' />
                                        <div className='row mt-3'>
                                            <div className='col-md-6 col-sm-12'>
                                                <Skeleton height={200} />
                                            </div>
                                            <div className='col-md-6 col-sm-12'>
                                                <Skeleton height={200} />
                                            </div>
                                        </div>
                                    </div>
                                </>
                        }
                    </div>
                </div>

                {/* Modal to assign tasks */}
                <div className="modal fade" id="addTaskModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable" style={{ height: 'auto' }}>
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between align-items-center">
                                <h4 className="modal-title fs-5" id="staticBackdropLabel">Assign Tasks</h4>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={resetForm}></button>
                            </div>
                            <div className="modal-body">
                                <form className='my-2' id="taskForm" onSubmit={(e) => e.preventDefault()}>
                                    <select className='form-control' value={taskStaff} onChange={(e) => setTaskStaff(e.target.value)}>
                                        <option selected disabled value=''>--Select from Team--</option>
                                        {
                                            projectTeam.length > 0 &&
                                            projectTeam.map((item) => {
                                                return <option key={item.staffID} value={item.staffID}>{item.name}</option>
                                            })
                                        }
                                    </select>
                                    <div className='form-group mt-3 px-2'>
                                        <div className='row'>
                                            <input className='form-control col-11' placeholder='Enter Task...' value={taskCont} onChange={(e) => setTaskCont(e.target.value)}></input>
                                            <Tooltip title="Add More Tasks">
                                                <button className='btn btn-primary col-1 p-1' type='button' onClick={enterTask}>
                                                    <i className='fa fa-plus'></i>
                                                </button>
                                            </Tooltip>
                                        </div>
                                        <div className='row my-3'>
                                            {
                                                showTasks && taskTable.length > 0 ?
                                                    <table className='table'>
                                                        <thead>
                                                            <tr>
                                                                <th scope="col" style={{ width: '30%' }}>Staff</th>
                                                                <th scope="col" style={{ width: '60%' }}>Task</th>
                                                                <th scope='col'></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                taskTable && taskTable.map((item, index) => {
                                                                    return <tr key={index}>
                                                                        <td>{item.name}</td>
                                                                        <td>{item.task}</td>
                                                                        <td>
                                                                            <Tooltip title="Delete">
                                                                                <button className='btn btn-link text-danger py-0' type='button' onClick={() => removeTask(index)}>
                                                                                    <i className='fa fa-xmark'></i>
                                                                                </button>
                                                                            </Tooltip>
                                                                        </td>
                                                                    </tr>
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                    :
                                                    <span className='text-muted'>No tasks added yet...</span>
                                            }
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetForm}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={saveTasks}>Assign Tasks</button>
                            </div>
                        </div>
                    </div>
                </div>


                <div style={{ position: 'fixed', display: 'none', justifyContent: 'center', alignItems: 'center', top: 0, left: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.2)', padding: '15px' }} id="noDataDiv">
                    <div className='text-center'>
                        <img src="/images/404.svg" width='25%' alt="Not Found!"></img>
                        <h2>No Data Found!</h2>
                        <p>The staff you're looking for doesn't exist. <br></br> Try searching some other staff..!</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewProject
