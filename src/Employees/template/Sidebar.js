import React, { useEffect, useState } from 'react'
import StringAvatar from '../../Commons/StringAvatar';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Tooltip, tooltipClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} placement='right' />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#343a40',
        color: 'whitesmoke',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(13),
        border: '1px solid #ccc',
    },
}));

function Sidebar() {

    const empUri = '/staff/';

    //get Company data
    const [company, setCompany] = useState([]);
    useEffect(() => {
        const getCompany = async () => {
            const comp = await axios.get(process.env.REACT_APP_BACKEND + 'company/');
            const data = comp.data;
            setCompany(data);
        }

        getCompany()
    }, [])

    //get current user
    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));

    //Fetch logged user data
    const [getUser, setUser] = useState('');
    useEffect(() => {
        const getUser = async () => {
            const userdata = await axios.get(process.env.REACT_APP_BACKEND + 'users/logged-user-data/' + currentUser.user);
            const data = userdata.data[0];
            setUser(data);
        }

        getUser();
    }, [currentUser.user])

    var avatar = '';
    if (getUser) {
        if (getUser.pfp) {
            avatar = process.env.REACT_APP_UPLOADS + 'staff/' + getUser.pfp;
        } else {
            if (getUser.gender === 'Male') {
                avatar = '/images/maleIcon1.png';
            } else if (getUser.gender === 'Female') {
                avatar = '/images/femaleIcon1.png';
            }
        }
    }

    return (
        <>
            <aside className="main-sidebar sidebar-light-primary elevation-4 sidebar-no-expand" id="main-sidebar" style={{ position: 'fixed', top: 0, bottom: 0 }}>
                <span className="brand-link d-flex justify-content-between align-items-center">
                    <div>
                        {
                            company.logo ?
                                <img src={process.env.REACT_APP_UPLOADS + 'company/' + company.logo} className="brand-image img-circle elevation-3" alt={company.company_name}></img>
                                : <span className="brand-image img-circle elevation-3">
                                    {
                                        StringAvatar((company && company.company_name) || 'Company Name')
                                    }
                                </span>
                        }
                        < span className="brand-text font-weight-light" >{(company && company.company_name) || 'Company Name'}</span>
                    </div>
                    <button className='btn btn-link text-secondary d-sm-block d-xs-block d-md-block d-lg-none' id="sidebarCloseBtn">
                        <i className=' fa fa-angle-left'></i>
                    </button>
                </span>

                <div className="sidebar">
                    <div className="user-panel mt-2 pb-2 mb-2 d-flex align-items-center">
                        <div className="image pl-2">
                            <img src={avatar} alt={getUser && getUser.fullname} className='img-circle elevation-2' style={{ height: '35px', width: '35px' }} />
                        </div>
                        <div className="info">
                            <span>{getUser && getUser.fullname}</span>
                            <span className="d-block text-muted">@{currentUser && currentUser.user}</span>
                        </div>
                    </div>

                    <div className="form-inline">
                        <div className="input-group" data-widget="sidebar-search">
                            <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                            <div className="input-group-append">
                                <button className="btn btn-sidebar">
                                    <i className="fas fa-search fa-fw"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <nav className="mt-2 mb-4">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            {/* Home or Dashboard */}
                            <li className="nav-item">
                                <HtmlTooltip title="Home">
                                    <a href={empUri + 'home'} className="nav-link" id="home-nav">
                                        <DashboardRoundedIcon className='nav-icon' />
                                        <p>
                                            Dashboard
                                        </p>
                                    </a>
                                </HtmlTooltip>
                            </li>

                            {/* Employees */}
                            {
                                getUser.permissions && getUser.permissions.find(permission => permission === 'Staff') &&
                                <li className="nav-item" id="staff-menu">
                                    <HtmlTooltip title="Employees">
                                        <span className="nav-link text-dark" id="staff-parent-nav">
                                            <i className=' fa fa-users nav-icon'></i>
                                            <p>
                                                Employees
                                                <i className="right fas fa-angle-left"></i>
                                            </p>
                                        </span>
                                    </HtmlTooltip>
                                    <ul className="nav nav-treeview">
                                        <HtmlTooltip title="Add Employee">
                                            <li className="nav-item">
                                                <a href={empUri + 'add-employee'} className="nav-link" id="add-staff-nav">
                                                    <i className="fa fa-user-plus nav-icon"></i>
                                                    <p>Add Employee</p>
                                                </a>
                                            </li>
                                        </HtmlTooltip>
                                        <HtmlTooltip title="Employees List">
                                            <li className="nav-item">
                                                <a href={empUri + 'employees'} className="nav-link" id="staff-nav">
                                                    <i className="fa fa-user-group nav-icon"></i>
                                                    <p>Employees List</p>
                                                </a>
                                            </li>
                                        </HtmlTooltip>
                                    </ul>
                                </li>
                            }

                            {/* Attendances */}
                            <li className="nav-item" >
                                <HtmlTooltip title="Attendances">
                                    <a href={empUri + 'attendances'} className="nav-link" id="attn-nav">
                                        <i className='nav-icon fa fa-clipboard-list'></i>
                                        <p>
                                            Attendances
                                        </p>
                                    </a>
                                </HtmlTooltip>
                            </li>

                            {/* Attendances */}
                            {
                                getUser.permissions && getUser.permissions.find(permission => permission === 'Attendance') &&
                                <li className="nav-item" >
                                    <HtmlTooltip title="Staff Attendance">
                                        <a href={empUri + 'staff-attendance'} className="nav-link" id="attn-nav">
                                            <i className='nav-icon fa fa-clipboard-list'></i>
                                            <p>
                                                Staff Attendance <span className='text-sm text-info'>(Admin)</span>
                                            </p>
                                        </a>
                                    </HtmlTooltip>
                                </li>
                            }

                            {/* Projects */}
                            {
                                getUser.permissions && getUser.permissions.find(permission => permission === 'Projects') &&
                                <li className="nav-item" id="project-menu">
                                    <HtmlTooltip title="Projects (Admin)">
                                        <a href={empUri + 'projects'} className="nav-link" id="project-parent-nav">
                                            <i className='nav-icon fa fa-sheet-plastic'></i>
                                            <p>
                                                Projects <span className='text-sm text-info'>(Admin)</span>
                                                <i className="right fas fa-angle-left"></i>
                                            </p>
                                        </a>
                                    </HtmlTooltip>
                                    <ul className="nav nav-treeview">
                                        <HtmlTooltip title="Add Project">
                                            <li className="nav-item">
                                                <a href={empUri + 'add-project'} className="nav-link" id="add-project-nav">
                                                    <i className="fa fa-file-circle-plus nav-icon"></i>
                                                    <p>Add Project</p>
                                                </a>
                                            </li>
                                        </HtmlTooltip>
                                        <HtmlTooltip title="Projects List">
                                            <li className="nav-item">
                                                <a href={empUri + 'projects-admin'} className="nav-link" id="projects-nav">
                                                    <i className="fa fa-laptop-file nav-icon"></i>
                                                    <p>Projects List</p>
                                                </a>
                                            </li>
                                        </HtmlTooltip>
                                    </ul>
                                </li>
                            }

                            {/* Projects */}
                            <li className="nav-item" >
                                <HtmlTooltip title="My Projects">
                                    <a href={empUri + 'projects'} className="nav-link" id="project-nav">
                                        <i className='nav-icon fa fa-sheet-plastic'></i>
                                        <p>
                                            My Projects
                                        </p>
                                    </a>
                                </HtmlTooltip>
                            </li>

                            {/* Tasks */}
                            <li className="nav-item" >
                                <HtmlTooltip title="Tasks">
                                    <a href={empUri + 'tasks'} className="nav-link" id="task-nav">
                                        <i className='nav-icon fa fa-list-check'></i>
                                        <p>
                                            Tasks
                                        </p>
                                    </a>
                                </HtmlTooltip>
                            </li>

                            {/* Leaves */}
                            <li className="nav-item" >
                                <HtmlTooltip title="Leaves">
                                    <a href={empUri + 'leaves'} className="nav-link" id="leave-nav">
                                        <i className='nav-icon fa fa-scroll'></i>
                                        <p>
                                            Leaves
                                        </p>
                                    </a>
                                </HtmlTooltip>
                            </li>

                            {/* Leave Management */}
                            {
                                getUser.permissions && getUser.permissions.find(permission => permission === 'Leaves') &&
                                <li className="nav-item" >
                                    <HtmlTooltip title="Leave Management">
                                        <a href={empUri + 'leave-management'} className="nav-link" id="leaves-nav">
                                            <i className='nav-icon fa fa-scroll'></i>
                                            <p>
                                                Leave Management <span className='text-sm text-info'>(Admin)</span>
                                            </p>
                                        </a>
                                    </HtmlTooltip>
                                </li>
                            }

                            {/* Reports */}
                            {
                                getUser.permissions && getUser.permissions.find(permission => permission === 'Reports') &&
                                <li li className="nav-item" id="report-menu">
                                    <HtmlTooltip title="Reports">
                                        <span className="nav-link text-dark" id="report-parent-nav">
                                            <AssessmentIcon className='nav-icon' />
                                            <p>
                                                Reports <span className='text-sm text-info'>(Admin)</span>
                                                <i className="right fas fa-angle-left"></i>
                                            </p>
                                        </span>
                                    </HtmlTooltip>
                                    <ul className="nav nav-treeview">
                                        <li className="nav-item">
                                            <a href={empUri + "reports/projects"} className="nav-link" id='project-report-nav'>
                                                <i className="fa fa-bars-progress nav-icon"></i>
                                                <p>Projects Report</p>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            }

                            {/* Holidays */}
                            <li className="nav-item" >
                                <HtmlTooltip title="Holidays">
                                    <a href={'/staff/holidays'} className="nav-link" id="holiday-nav">
                                        <i className='nav-icon fa fa-umbrella-beach'></i>
                                        <p>
                                            Holidays {getUser.permissions && getUser.permissions.find(permission => permission === 'Holidays') && <span className='text-sm text-info'>(Admin)</span>}
                                        </p>
                                    </a>
                                </HtmlTooltip>
                            </li>

                            {/* Notices */}
                            <li className="nav-item" >
                                <HtmlTooltip title="Notices">
                                    <a href={empUri + 'notices'} className="nav-link" id="notice-nav">
                                        <i className='nav-icon fa fa-bullhorn'></i>
                                        <p>
                                            Notices {getUser.permissions && getUser.permissions.find(permission => permission === 'Notices') && <span className='text-sm text-info'>(Admin)</span>}
                                        </p>
                                    </a>
                                </HtmlTooltip>
                            </li>

                            {/* Profile */}
                            <li className="nav-item" >
                                <HtmlTooltip title="Profile">
                                    <a href={empUri + 'profile'} className="nav-link" id="profile-nav">
                                        <AccountCircleIcon className='nav-icon' />
                                        <p>
                                            Profile
                                        </p>
                                    </a>
                                </HtmlTooltip>
                            </li>


                        </ul>
                    </nav>
                </div>
            </aside >
        </>
    )
}

export default Sidebar
