import LoadingButton from '@mui/lab/LoadingButton/LoadingButton'
import { Box, Container, Paper, TextField } from '@mui/material'
import React, { useState } from 'react'
import SaveIcon from '@mui/icons-material/Save';
import { checkTimeValidity } from '../Commons/FormatTime';
import { ToastComp } from '../Commons/ToastComp';
import axios from 'axios';

function ResetPass() {

    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    //get project id from url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const email = urlParams.get('email');
    const sentTime = decodeURI(urlParams.get('token'));

    //Save new password
    const setPass = (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!password || !cpassword) {
            ToastComp('error', 'Please fill in all the required fields!');
            setIsLoading(false);
        } else if (password.length < 8) {
            ToastComp('warning', 'Your password must be at least 8 characters!');
            setIsLoading(false);
        } else if (password !== cpassword) {
            ToastComp('error', 'Confirm password is not matching with your password!');
            setIsLoading(false);
        } else {
            axios.post(process.env.REACT_APP_BACKEND + 'users/change-password', {
                email: email,
                password: btoa(password),
            })
                .then((res) => {
                    setIsLoading(false)
                    ToastComp(res.data.status, res.data.msg);
                    if (res.data.status === 'success') {
                        window.setTimeout(() => {
                            ToastComp('info', 'Redirecting to login page...!');
                            window.setTimeout(() => {
                                window.location.href = '/';
                            }, 2000);
                        }, 2100)
                    }
                })
                .catch((err) => {
                    ToastComp('error', err.message);
                    setIsLoading(false);
                })

        }
    }

    return (
        <>
            <Container fixed style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Paper elevation={3}>
                    {/* {checkTimeValidity(sentTime, new Date())} */}
                    {
                        email && checkTimeValidity(sentTime, new Date()) <= 30 ?
                            <Box style={{ padding: '15px' }}>
                                <Box style={{ textAlign: 'center', marginBottom: '10px' }}>
                                    <h2 style={{ margin: '15px 0' }}>Office Management System</h2>
                                    <span className='text-bold'>Please create a new password.</span>
                                </Box>

                                <Box
                                    sx={{
                                        '& .MuiTextField-root': { m: 1, width: '35ch' },
                                    }}
                                    style={{ margin: '15px 0' }}
                                >
                                    <form className='w-100' onSubmit={(e) => setPass(e)}>
                                        <div className='d-flex justify-content-center align-items-center'>
                                            <TextField
                                                type="email"
                                                size='small'
                                                className='w-100'
                                                disabled
                                                value={email}
                                            />
                                        </div>
                                        <div className='d-flex justify-content-center align-items-center'>
                                            <TextField
                                                label="Password *"
                                                type="password"
                                                size='small'
                                                defaultValue={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className='w-100'
                                            />
                                        </div>
                                        <div className='d-flex justify-content-center align-items-center'>
                                            <TextField
                                                label="Confirm Password *"
                                                type="password"
                                                size='small'
                                                defaultValue={cpassword}
                                                onChange={(e) => setCPassword(e.target.value)}
                                                className='w-100'
                                            />
                                        </div>
                                        <div className='d-flex justify-content-center align-items-center my-2'>
                                            <div>
                                                <LoadingButton
                                                    loading={isLoading}
                                                    loadingPosition="end"
                                                    endIcon={<SaveIcon />}
                                                    variant="contained"
                                                    style={{ marginRight: '10px' }}
                                                    type="submit"
                                                >
                                                    Set Password
                                                </LoadingButton>
                                                <br />
                                                <a href="/" className='text-center mt-3 d-block'>Back to Login</a>
                                            </div>
                                        </div>
                                    </form>
                                </Box>
                            </Box>
                            : <Box style={{ padding: '35px', textAlign: 'center' }}>
                                <h3 className='text-danger'>Oops!</h3>
                                <p className='text-center'>This link has been expired <br /> and you cannot access it anymore.</p>
                                <a href='/'>Go Back To Home</a>
                            </Box>
                    }
                </Paper>
            </Container>
        </>
    )
}

export default ResetPass
