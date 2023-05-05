import axios from 'axios';
import React, { useEffect, useState } from 'react'
import RecentNotifications from '../Commons/RecentNotifications';
import StartSession from './AttnComponents/StartSession';
import StopSession from './AttnComponents/StopSession';

function EmpDashboard() {

    useEffect(() => {
        if (document.getElementById('home-nav')) {
            document.getElementById('home-nav').classList.add('active');
        }
    })

    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));

    //Fetch today's attendance
    // const [attnToday, setAttnToday] = useState('');
    // useEffect(() => {
    //     const fetchAttn = async () => {
    //         const attnData = await axios.get(process.env.REACT_APP_BACKEND + 'attendance/get-today-session/' + currentUser.staffID);
    //         setAttnToday(attnData.data);
    //     }

    //     fetchAttn();
    // }, [currentUser.staffID])

    //get recent projects
    const [recentProjects, setRecentProjects] = useState([]);
    useEffect(() => {
        const getRecentProjects = async () => {
            const recent = await axios.get(process.env.REACT_APP_BACKEND + 'projects/staff-recent-projects/' + currentUser.staffID);
            const data = recent.data;
            setRecentProjects(data);
        }
        getRecentProjects();
    })

    return (
        <>
            <h4>Home</h4>

            <div className='row mt-4'>
                <div className='col-md-6 col-sm-12'>
                    <div className='card'>
                        <div className='card-header'>
                            <h5 className='card-title'>Welcome !</h5>
                        </div>
                        <div className='card-body px-4'>
                            <h4 className='m-0'>Attendance</h4>
                            <div className='btn-group w-100 my-3' role='group' style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                <StartSession />
                                <StopSession />
                            </div>
                        </div>
                    </div>

                    <div className='card'>
                        <div className='card-header'>
                            <h5 className='card-title'>Recent Projects</h5>
                        </div>
                        <div className='card-body'>
                            {
                                recentProjects && recentProjects.length > 0
                                    ? recentProjects.map((project) => {
                                        return <a href={'/staff/view-project?project_id=' + project.projectID} key={project._id} className='link-success cursor-pointer'>
                                            <div className='card p-2 card-hover card-outline card-success my-2'>
                                                <h5 className='m-1'>{project.name}</h5>
                                                <span className='mx-1'>Client: {project.client}</span>
                                            </div>
                                        </a>
                                    })
                                    : <div className='text-center text-muted'>No Notifications Found..!</div>
                            }
                        </div>
                        <div className='card-footer text-center p-2'>
                            <a className='link-success' href='/staff/projects' >View All <i className='fa fa-circle-right'></i></a>
                        </div>
                    </div>
                </div>
                <div className='col-md-6 col-sm-12'>
                    <RecentNotifications />
                </div>
            </div>
        </>
    )
}

export default EmpDashboard
