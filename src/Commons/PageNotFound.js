import React from 'react'
import { useNavigate } from 'react-router-dom';

function PageNotFound() {

    const currentTheme = window.localStorage.getItem('currentOMSTheme');
    const navigate = useNavigate();

    return (
        <div className='d-flex justify-content-center align-items-center'>
            <div className='text-center py-4'>
                <img src='/images/404.svg' alt="Page Not Found!" width='30%'></img>

                <h3>Page Not Found!</h3>
                <p>Looks like the page you're looking for isn't available..!</p>
                <p><button onClick={() => navigate(-1)} className={currentTheme === 'dark' ? 'btn btn-link text-light' : 'btn btn-link text-dark'}> <i className='fa fa-circle-left mr-1'></i> Go Back</button></p>
            </div>
        </div>
    )
}

export default PageNotFound
