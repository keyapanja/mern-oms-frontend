import React, { useEffect, useState } from 'react'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Tooltip, tooltipClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import StringAvatar from '../../Commons/StringAvatar';

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

    //get current user
    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));

    const admUri = '/admin/';

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

    return (
        <>
            <aside className="main-sidebar sidebar-light-primary elevation-4 sidebar-no-expand" id="main-sidebar" style={{ position: 'fixed', top: 0, bottom: 0 }}>
                <span className="brand-link d-flex justify-content-between align-items-center">
                    <div className='d-flex align-items-center justify-content-start'>
                        {
                            company && company.logo && company.logo ?
                                <img src={process.env.REACT_APP_UPLOADS + 'company/' + company.logo} className="brand-image img-circle elevation-3" alt={company.company_name}></img>
                                : <span className="brand-image img-circle elevation-3">
                                    {
                                        StringAvatar((company && company.company_name) || 'Company Name')
                                    }
                                </span>
                        }
                        <span className="brand-text" > {(company && company.company_name) || 'Company Name'}</span>
                    </div>
                    <button className='btn btn-link text-secondary d-sm-block d-xs-block d-md-block d-lg-none' id="sidebarCloseBtn">
                        <i className=' fa fa-angle-left'></i>
                    </button>
                </span>

                <div className="sidebar">
                    <div className="user-panel mt-2 pb-2 mb-2 d-flex align-items-center">
                        <div className="image pl-2">
                            {/* <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Avatar" /> */}
                            <span className="img-circle elevation-2">{StringAvatar('Admins')}</span>
                        </div>
                        <div className="info">
                            <span>{currentUser.staffID === 'Admin' && 'Admin'}</span>
                            <span className="d-block text-muted">@{currentUser.staffID}</span>
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
                                    <a href={admUri + 'home'} className="nav-link" id="home-nav">
                                        <DashboardRoundedIcon className='nav-icon' />
                                        <p>
                                            Dashboard
                                        </p>
                                    </a>
                                </HtmlTooltip>
                            </li>

                            {/* Departments */}
                            <li className="nav-item" >
                                <HtmlTooltip title="Departments">
                                    <a href={admUri + 'departments'} className="nav-link" id="dept-nav">
                                        <i className='nav-icon fa fa-building'></i>
                                        <p>
                                            Departments
                                        </p>
                                    </a>
                                </HtmlTooltip>
                            </li>

                            {/* Designations */}
                            <li className="nav-item" >
                                <HtmlTooltip title="Designations">
                                    <a href={admUri + 'designations'} className="nav-link" id="desg-nav">
                                        <i className='nav-icon fa fa-clipboard-user'></i>
                                        <p>
                                            Designations
                                        </p>
                                    </a>
                                </HtmlTooltip>
                            </li>

                            {/* Employees */}
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
                                            <a href={admUri + 'add-employee'} className="nav-link" id="add-staff-nav">
                                                <i className="fa fa-user-plus nav-icon"></i>
                                                <p>Add Employee</p>
                                            </a>
                                        </li>
                                    </HtmlTooltip>
                                    <HtmlTooltip title="Employees List">
                                        <li className="nav-item">
                                            <a href={admUri + 'employees'} className="nav-link" id="staff-nav">
                                                <i className="fa fa-user-group nav-icon"></i>
                                                <p>Employees List</p>
                                            </a>
                                        </li>
                                    </HtmlTooltip>
                                </ul>
                            </li>

                            {/* Attendances */}
                            <li className="nav-item" >
                                <HtmlTooltip title="Attendances">
                                    <a href={admUri + 'attendances'} className="nav-link" id="attn-nav">
                                        <i className='nav-icon fa fa-clipboard-list'></i>
                                        <p>
                                            Staff Attendance
                                        </p>
                                    </a>
                                </HtmlTooltip>
                            </li>

                            {/* Projects */}
                            <li className="nav-item" id="project-menu">
                                <HtmlTooltip title="Projects">
                                    <a href={admUri + 'projects'} className="nav-link" id="project-parent-nav">
                                        <i className='nav-icon fa fa-sheet-plastic'></i>
                                        <p>
                                            Projects
                                            <i className="right fas fa-angle-left"></i>
                                        </p>
                                    </a>
                                </HtmlTooltip>
                                <ul className="nav nav-treeview">
                                    <HtmlTooltip title="Add Project">
                                        <li className="nav-item">
                                            <a href={admUri + 'add-project'} className="nav-link" id="add-project-nav">
                                                <i className="fa fa-file-circle-plus nav-icon"></i>
                                                <p>Add Project</p>
                                            </a>
                                        </li>
                                    </HtmlTooltip>
                                    <HtmlTooltip title="Projects List">
                                        <li className="nav-item">
                                            <a href={admUri + 'projects'} className="nav-link" id="projects-nav">
                                                <i className="fa fa-laptop-file nav-icon"></i>
                                                <p>Projects List</p>
                                            </a>
                                        </li>
                                    </HtmlTooltip>
                                </ul>
                            </li>

                            {/* Leave Management */}
                            <li className="nav-item" >
                                <HtmlTooltip title="Leave Management">
                                    <a href={admUri + 'leave-management'} className="nav-link" id="leaves-nav">
                                        <i className='nav-icon fa fa-scroll'></i>
                                        <p>
                                            Leave Management
                                        </p>
                                    </a>
                                </HtmlTooltip>
                            </li>

                            {/* Reports */}
                            <li className="nav-item" id="report-menu">
                                <HtmlTooltip title="Reports">
                                    <span className="nav-link text-dark" id="report-parent-nav">
                                        <AssessmentIcon className='nav-icon' />
                                        <p>
                                            Reports
                                            <i className="right fas fa-angle-left"></i>
                                        </p>
                                    </span>
                                </HtmlTooltip>
                                <ul className="nav nav-treeview">
                                    <li className="nav-item">
                                        <a href={admUri + "reports/projects"} className="nav-link" id='project-report-nav'>
                                            <i className="fa fa-bars-progress nav-icon"></i>
                                            <p>Projects Report</p>
                                        </a>
                                    </li>
                                </ul>
                            </li>

                            {/* Holidays */}
                            <li className="nav-item" >
                                <HtmlTooltip title="Holidays">
                                    <a href={admUri + 'holidays'} className="nav-link" id="holiday-nav">
                                        <i className='nav-icon fa fa-umbrella-beach'></i>
                                        <p>
                                            Holidays
                                        </p>
                                    </a>
                                </HtmlTooltip>
                            </li>

                            {/* Notices */}
                            <li className="nav-item" >
                                <HtmlTooltip title="Notices">
                                    <a href={admUri + 'notices'} className="nav-link" id="notice-nav">
                                        <i className='nav-icon fa fa-bullhorn'></i>
                                        <p>
                                            Notices
                                        </p>
                                    </a>
                                </HtmlTooltip>
                            </li>

                            {/* Settings */}
                            <li className="nav-item" id="settings-menu">
                                <HtmlTooltip title="Settings">
                                    <span className="nav-link text-dark" id="settings-nav">
                                        <i className='nav-icon fa fa-gear'></i>
                                        <p>
                                            Settings
                                            <i className="right fas fa-angle-left"></i>
                                        </p>
                                    </span>
                                </HtmlTooltip>
                                <ul className="nav nav-treeview">
                                    <HtmlTooltip title="Company Data">
                                        <li className="nav-item">
                                            <a href={admUri + 'settings/company-data'} className="nav-link" id="company-data-nav">
                                                <i className="fa fa-building-user nav-icon"></i>
                                                <p>Company Data</p>
                                            </a>
                                        </li>
                                    </HtmlTooltip>
                                    <HtmlTooltip title="Currency">
                                        <li className="nav-item">
                                            <a href={admUri + 'settings/currency'} className="nav-link" id="currency-nav">
                                                <i className="fa fa-coins nav-icon"></i>
                                                <p>Currency</p>
                                            </a>
                                        </li>
                                    </HtmlTooltip>
                                    {/* <HtmlTooltip title="Salary Type">
                                        <li className="nav-item">
                                            <a href={admUri + 'settings/salarytype'} className="nav-link" id="salarytype-nav">
                                                <i className="fa fa-money-bill-wave nav-icon"></i>
                                                <p>Salary Type</p>
                                            </a>
                                        </li>
                                    </HtmlTooltip> */}
                                    <HtmlTooltip title="Work Hours">
                                        <li className="nav-item">
                                            <a href={admUri + 'settings/work-hours'} className="nav-link" id="hours-nav">
                                                <i className="fa fa-business-time nav-icon"></i>
                                                <p>Work Hours</p>
                                            </a>
                                        </li>
                                    </HtmlTooltip>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
