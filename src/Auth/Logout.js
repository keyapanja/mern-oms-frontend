import React from 'react'

function Logout() {

    const logoutUser = () => {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.innerHTML = `LOGOUT <div class="spinner-border spinner-border-sm ml-1" role="status"></div>`
        }

        window.setTimeout(() => {
            window.sessionStorage.clear('loggedInUser');
            window.location.href = '/';
        }, 1500)
    }

    return (
        <>
            <button className='nav-link btn btn-link py-0' onClick={logoutUser} id="logoutBtn">
                LOGOUT <i className='fa fa-right-from-bracket ml-1'></i>
            </button>
        </>
    )
}

export default Logout
