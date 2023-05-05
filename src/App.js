import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Auth/LoginPage';
import AdminRoutes from './Admins/AdminRoutes';
import EmpRoutes from './Employees/EmpRoutes';
import { useEffect } from 'react';
import PageNotFound from './Commons/PageNotFound';
import CreateAccount from './Auth/CreateAccount';
import ForgotPassword from './Auth/ForgotPassword';
import ResetPass from './Auth/ResetPass';

function App() {

  const theme = window.localStorage.getItem('currentOMSTheme');

  useEffect(() => {
    const mainBody = document.getElementById('main-body');
    const mainNavbar = document.getElementById('main-navbar');
    const mainSidebar = document.getElementById('main-sidebar');
    if (theme) {
      if (theme === 'dark') {
        mainBody.classList.add('dark-mode');
        if (mainNavbar) {
          mainNavbar.classList.add('navbar-dark');
          mainNavbar.classList.remove('navbar-light');
        }
        if (mainSidebar) {
          mainSidebar.classList.add('sidebar-dark-primary');
          mainSidebar.classList.remove('sidebar-light-primary');
        }

      } else if (theme === 'light') {
        mainBody.classList.remove('dark-mode');
        if (mainNavbar) {
          mainNavbar.classList.remove('navbar-dark');
          mainNavbar.classList.add('navbar-light');
        }
        if (mainSidebar) {
          mainSidebar.classList.remove('sidebar-dark-primary');
          mainSidebar.classList.add('sidebar-light-primary');
        }
      }
    }
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<LoginPage />}></Route>
        <Route exact path='/forgot-password' element={<ForgotPassword />}></Route>
        <Route exact path='/reset-password' element={<ResetPass />}></Route>
        <Route exact path='/admin/*' element={<AdminRoutes />}></Route>
        <Route exact path='/staff/*' element={<EmpRoutes />}></Route>
        <Route exact path='/create-staff-account' element={<CreateAccount />}></Route>
        <Route exact path='*' element={<PageNotFound />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
