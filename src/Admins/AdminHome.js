import React, { useEffect, useState } from 'react'
import axios from 'axios'
import RecentNotifications from '../Commons/RecentNotifications';

function AdminHome() {

    useEffect(() => {
        if (document.getElementById('home-nav')) {
            document.getElementById('home-nav').classList.add('active');
        }
    })

    //Count Departments
    const [totalDepts, setTotalDepts] = useState(0);
    useEffect(() => {
        const countDepts = async () => {
            const depts = await axios.get(process.env.REACT_APP_BACKEND + 'count/departments');
            const data = depts.data;
            setTotalDepts(data);
        }

        countDepts()
    }, [])

    //Count Designations
    const [totalDesgs, setTotalDesgs] = useState(0);
    useEffect(() => {
        const countDesgs = async () => {
            const desgs = await axios.get(process.env.REACT_APP_BACKEND + 'count/designations');
            const data = desgs.data;
            setTotalDesgs(data);
        }

        countDesgs()
    }, [])

    //Count staff
    const [totalStaff, setTotalStaff] = useState(0);
    useEffect(() => {
        const countDesgs = async () => {
            const desgs = await axios.get(process.env.REACT_APP_BACKEND + 'count/staff');
            const data = desgs.data;
            setTotalStaff(data);
        }

        countDesgs()
    }, [])

    //Count staff
    const [totalProjects, setTotalProjects] = useState(0);
    useEffect(() => {
        const countDesgs = async () => {
            const desgs = await axios.get(process.env.REACT_APP_BACKEND + 'count/projects');
            const data = desgs.data;
            setTotalProjects(data);
        }

        countDesgs()
    }, [])

    //get Company data
    // const [company, setCompany] = useState([]);
    useEffect(() => {
        const getCompany = async () => {
            const comp = await axios.get(process.env.REACT_APP_BACKEND + 'company/');
            const data = comp.data;
            // setCompany(data);
            if (!data) {
                const alertDiv = document.getElementById('alertDiv');
                if (alertDiv) {
                    alertDiv.style.display = 'block';
                }
            }
        }

        getCompany()
    }, [])

    //get recent projects
    const [recentProjects, setRecentProjects] = useState([]);
    useEffect(() => {
        const getRecentProjects = async () => {
            const recent = await axios.get(process.env.REACT_APP_BACKEND + 'projects/recent-projects');
            const data = recent.data;
            setRecentProjects(data);
        }
        getRecentProjects();
    })

    return (
        <>
            <h4>Home</h4>

            <div className='row mt-4'>

                <div className='col-12 mb-3' style={{ display: 'none' }} id="alertDiv">
                    <div className="alert alert-warning" role="alert">
                        <h4 className="alert-heading">Complete setup!</h4>
                        <p>Looks like you haven't completed the setup yet. Please <a href='/admin/settings/company-data' className='text-decoration-none text-bold' style={{ color: 'black' }}>setup your company details</a> first to use the system without any issues.</p>
                    </div>
                </div>

                <div className='col-md-3 col-sm-6'>
                    <a href='/admin/departments' className='d-block'>
                        <div className="info-box">
                            <span className="info-box-icon bg-info bg-gradient elevation-1"><i className="fas fa-building"></i></span>

                            <div className="info-box-content text-info">
                                <span className="info-box-text">Departments</span>
                                <h4 className="info-box-number mb-0">
                                    {totalDepts}
                                </h4>
                            </div>
                        </div>
                    </a>
                </div>

                <div className='col-md-3 col-sm-6'>
                    <a href='/admin/designations' className='d-block'>
                        <div className="info-box">
                            <span className="info-box-icon bg-info-subtle elevation-1 text-info"><i className="fas fa-clipboard-user"></i></span>

                            <div className="info-box-content text-info">
                                <span className="info-box-text">Designations</span>
                                <h4 className="info-box-number mb-0">
                                    {totalDesgs}
                                </h4>
                            </div>
                        </div>
                    </a>
                </div>

                <div className='col-md-3 col-sm-6'>
                    <a href='/admin/employees' className='d-block'>
                        <div className="info-box">
                            <span className="info-box-icon bg-primary bg-gradient elevation-1"><i className="fas fa-users"></i></span>

                            <div className="info-box-content text-primary">
                                <span className="info-box-text">Employees (active)</span>
                                <h4 className="info-box-number mb-0">
                                    {totalStaff}
                                </h4>
                            </div>
                        </div>
                    </a>
                </div>

                <div className='col-md-3 col-sm-6'>
                    <a href='/admin/projects' className='d-block'>
                        <div className="info-box">
                            <span className="info-box-icon bg-success bg-gradient elevation-1"><i className="fas fa-sheet-plastic"></i></span>

                            <div className="info-box-content text-success">
                                <span className="info-box-text">Projects</span>
                                <h4 className="info-box-number mb-0">
                                    {totalProjects}
                                </h4>
                            </div>
                        </div>
                    </a>
                </div>

                <div className='col-md-6 col-sm-12'>
                    <RecentNotifications />
                </div>

                <div className='col-md-6 col-sm-12'>
                    <div className='card'>
                        <div className='card-header'>
                            <h5 className='card-title'>Recent Projects</h5>
                        </div>
                        <div className='card-body'>
                            {
                                recentProjects && recentProjects.length > 0
                                    ? recentProjects.map((project) => {
                                        return <a href={'/admin/view-project?project_id=' + project.projectID} key={project._id} className='link-success cursor-pointer'>
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
                            <a className='link-success' href='/admin/projects' >View All <i className='fa fa-circle-right'></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminHome
