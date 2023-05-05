import React, { useEffect } from 'react'
import Logout from '../../Auth/Logout';
import Notifications, { CountNotifications } from '../../Commons/Notifications';
import TotalTime from '../AttnComponents/TotalTime';

function Header() {

    const currentTheme = window.localStorage.getItem('currentOMSTheme');

    const toggleTheme = () => {
        if (currentTheme) {
            if (currentTheme === 'light') {
                window.localStorage.setItem('currentOMSTheme', 'dark');
            } else {
                window.localStorage.setItem('currentOMSTheme', 'light');
            }
        } else {
            window.localStorage.setItem('currentOMSTheme', 'dark');
        }
        window.location.reload();
    }

    useEffect(() => {
        const lightBtn = document.getElementById('lightThemeBtn');
        const darkBtn = document.getElementById('darkThemeBtn');
        if (darkBtn && lightBtn) {
            if (currentTheme && currentTheme === 'light') {
                darkBtn.style.display = 'block';
                lightBtn.style.display = 'none';
            } else if (currentTheme && currentTheme === 'dark') {
                darkBtn.style.display = 'none';
                lightBtn.style.display = 'block';
            }
        }
    }, [currentTheme])

    return (
        <>
            <nav className="main-header navbar navbar-expand navbar-light" id="main-navbar" style={{ position: 'sticky', top: 0, left: 0, right: 0, zIndex: '1000' }}>

                <ul className='navbar-nav'>
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" href="/" role="button"><i className="fas fa-bars"></i></a>
                    </li>
                    <li className="nav-item">
                        <div className='border border-secondary rounded px-3'>
                            <div className='h5 p-0 m-2 text-center'>
                                <TotalTime />
                            </div>
                        </div>
                    </li>
                </ul>

                <ul className="navbar-nav ml-auto">

                    <li className="nav-item">
                        <button className="nav-link btn btn-link text-secondary py-0" onClick={toggleTheme} id="darkThemeBtn" style={{ display: 'block' }} title='Switch to Dark Mode'>
                            <i className="fas fa-moon"></i>
                        </button>
                        <button className="nav-link btn btn-link text-light py-0" onClick={toggleTheme} id="lightThemeBtn" style={{ display: 'none' }} title="Switch to Light Mode">
                            <i className="fas fa-sun"></i>
                        </button>
                    </li>

                    <li className="nav-item">
                        <button className="nav-link btn btn-link py-0 position-relative" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
                            <i className="fa fa-bell"></i>

                            <span className='position-absolute badge rounded-pill badge-sm badge-info' style={{ top: '10%', right: '5%' }}>{CountNotifications()}</span>
                        </button>
                    </li>

                    <li className="nav-item">
                        <Logout />
                    </li>
                </ul>
            </nav>

            <Notifications />
        </>
    )
}

export default Header
