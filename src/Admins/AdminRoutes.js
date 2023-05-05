import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminDashboard from './AdminHome';
import Header from './template/Header';
import Sidebar from './template/Sidebar';
import Departments from './Departments';
import Footer from '../Commons/Footer';
import Designations from './Designations';
import Staff from './staffs/Staff';
import AddStaff from './staffs/AddStaff';
import PageNotFound from '../Commons/PageNotFound';
import ViewStaff from './staffs/ViewStaff';
import CompanyData from './settings/CompanyData';
import Currency from './settings/Currency';
import SalaryType from './settings/SalaryType';
import Notices from '../Commons/Notices';
import EditStaff from './staffs/EditStaff';
import Holidays from '../Commons/Holidays';
import WorkHours from './settings/WorkHours';
import AddProject from './projects/AddProject';
import ProjectsList from './projects/ProjectsList';
import ViewProject from './projects/ViewProject';
import EditProject from './projects/EditProject';
import TodayList from './attendances/TodayList';
import ViewAttn from './attendances/ViewAttn';
import StaffLeaves from './leaves/StaffLeaves';
import ProjectReport from './reports/ProjectReport';
import ViewLeaves from './leaves/ViewLeaves';

function AdminRoutes() {

    const loggedInUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));
    if (!loggedInUser || (loggedInUser.usertype && loggedInUser.usertype !== 'admin')) {
        window.location.href = '/';
    }

    return (
        <>
            <Header />
            <Sidebar />
            <div className="content-wrapper">
                <div className="content">
                    <div className="container-fluid p-3">

                        <Routes>
                            <Route exact path='/' element={<AdminDashboard />}></Route>
                            <Route exact path='/home' element={<AdminDashboard />}></Route>
                            <Route exact path='/departments' element={<Departments />}></Route>
                            <Route exact path='/designations' element={<Designations />}></Route>
                            <Route exact path='/employees' element={<Staff />}></Route>
                            <Route exact path='/add-employee' element={<AddStaff />}></Route>
                            <Route exact path='/view-employee' element={<ViewStaff />}></Route>
                            <Route exact path='/edit-employee' element={<EditStaff />}></Route>
                            <Route exact path='/attendances' element={<TodayList />}></Route>
                            <Route exact path='/view-attendance' element={<ViewAttn />}></Route>
                            <Route exact path='/add-project' element={<AddProject />}></Route>
                            <Route exact path='/projects' element={<ProjectsList />}></Route>
                            <Route exact path='/view-project' element={<ViewProject />}></Route>
                            <Route exact path='/edit-project' element={<EditProject />}></Route>
                            <Route exact path='/settings/company-data' element={<CompanyData />}></Route>
                            <Route exact path='/settings/currency' element={<Currency />}></Route>
                            <Route exact path='/settings/salarytype' element={<SalaryType />}></Route>
                            <Route exact path='/settings/work-hours' element={<WorkHours />}></Route>
                            <Route exact path='/notices' element={<Notices />}></Route>
                            <Route exact path='/holidays' element={<Holidays />}></Route>
                            <Route exact path='/leave-management' element={<StaffLeaves />}></Route>
                            <Route exact path='/view-leaves' element={<ViewLeaves />}></Route>
                            <Route exact path='/reports/projects' element={<ProjectReport />}></Route>
                            <Route exact path='*' element={<PageNotFound />}></Route>
                        </Routes>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default AdminRoutes
