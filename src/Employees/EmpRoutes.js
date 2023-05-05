import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Attendance from './Attendance';
import EmpHome from './EmpHome';
import Header from './template/Header';
import Sidebar from './template/Sidebar';
import Footer from '../Commons/Footer';
import PageNotFound from '../Commons/PageNotFound';
import Notices from '../Commons/Notices';
import Profile from './Profile';
import Tasks from './Tasks';
import Projects from './Projects';
import Holidays from '../Commons/Holidays';
import Leaves from './leaves/Leaves';
import ViewProject from './ViewProject';

function AdminRoutes() {

  const loggedInUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));
  if (!loggedInUser && loggedInUser.usertype !== 'staff') {
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
              <Route exact path='/' element={<EmpHome />}></Route>
              <Route exact path='/home' element={<EmpHome />}></Route>
              <Route exact path='/attendances' element={<Attendance />}></Route>
              <Route exact path='/notices' element={<Notices />}></Route>
              <Route exact path='/profile' element={<Profile />}></Route>
              <Route exact path='/tasks' element={<Tasks />}></Route>
              <Route exact path='/projects' element={<Projects />}></Route>
              <Route exact path='/holidays' element={<Holidays />}></Route>
              <Route exact path='/leaves' element={<Leaves />}></Route>
              <Route exact path='/view-project' element={<ViewProject />}></Route>
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
