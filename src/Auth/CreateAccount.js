import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ToastComp } from '../Commons/ToastComp';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import { Buffer } from 'buffer';

function CreateAccount() {

    //get email from url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const getEmail = urlParams.get('email')
    const getStaffId = urlParams.get('staff_id')

    //check if there's already an account with this email address
    const [checkMail, setcheckMail] = useState([]);
    useEffect(() => {
        const checkUser = async () => {
            const user = await axios.get(process.env.REACT_APP_BACKEND + 'users/get-user-by-staffID/' + getStaffId);
            const data = user.data;
            setcheckMail(data);
        }
        checkUser();
    }, [getStaffId])

    //Toggle password view or show button
    const [passShow, setPassShow] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    //Input values
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    //save the data and create new account
    const createNewAcc = (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!username) {
            ToastComp('error', 'Please enter an username!');
            setIsLoading(false);
        } else if (!password) {
            ToastComp('error', 'Please create a password!');
            setIsLoading(false);
        } else if (username.toLowerCase() === password.toLowerCase()) {
            ToastComp('warning', 'Your password matches with your username... please provide a secure password!');
            setIsLoading(false);
        } else if (password.length < 6) {
            ToastComp('warning', 'Password should be at least 6 characters!');
            setIsLoading(false);
        } else if (username.split(" ").length > 1) {
            ToastComp('warning', 'Username must not contain spaces!');
            setIsLoading(false);
        } else {
            axios.post(process.env.REACT_APP_BACKEND + 'users/create-account', {
                'username': username.toLowerCase(),
                'password': Buffer.from(password).toString('base64'),
                'userType': 'staff',
                'email': getEmail,
                'staffID': getStaffId
            })
                .then((res) => {
                    setIsLoading(false);
                    ToastComp(res.data.status, res.data.msg);
                    if (res.data.status === 'success') {
                        window.setTimeout(() => {
                            window.location.href = '/'
                        }, 2100)
                    }
                })
                .catch((err) => {
                    setIsLoading(false);
                    ToastComp('error', err.message);
                })
        }
    }

    return (
        <>
            <div className='container d-flex justify-content-center align-items-center' style={{ width: '100%', height: '100vh' }}>
                <div className='card' style={{ width: '35%' }}>
                    <div className='card-body'>
                        {
                            checkMail ?
                                <>
                                    <h4 className='text-center'>Oops!</h4>
                                    <span className='text-center'>Your Staff account has been created already. <br></br> Please go to the <a href='/'>Login Page</a> to access your account!</span>
                                </>
                                : <>
                                    <h4 className='text-center'>Welcome!</h4>
                                    <span className='text-center'>Please choose an username and password to create a new staff account.</span>

                                    <form className='my-3' onSubmit={createNewAcc}>
                                        <div className='form-group mb-3'>
                                            <label>Username</label>
                                            <input className='form-control' placeholder='Enter an Username' value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())}></input>
                                            {
                                                username.split(" ").length > 1 && <span className='text-sm text-danger'><i className='fa fa-circle-exclamation'></i> Username must not contain any spaces!</span>
                                            }
                                        </div>
                                        <label>Password</label>
                                        <div className='form-group mb-3 w-100'>
                                            <input className='form-control' style={{ width: '90%', float: 'left' }} placeholder='Create a Password' type={passShow ? 'text' : 'password'} id="passInput" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                                            {
                                                !passShow ?
                                                    <button className="btn btn-link text-secondary px-1 ml-1" id="passViewBtn" onClick={() => setPassShow(true)} type="button">
                                                        <i className='fa fa-eye'></i>
                                                    </button>
                                                    :
                                                    <button className="btn btn-link text-secondary px-1 ml-1" id="passHideBtn" onClick={() => setPassShow(false)} type="button">
                                                        <i className='fa fa-eye-slash'></i>
                                                    </button>
                                            }
                                        </div>

                                        <div className='text-center pt-2'>
                                            <LoadingButton
                                                loading={isLoading}
                                                loadingPosition="start"
                                                startIcon={<PersonAddRoundedIcon />}
                                                variant="contained"
                                                type="submit"
                                            >
                                                Create Account
                                            </LoadingButton>
                                        </div>
                                    </form>
                                </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateAccount
