import React, { useState } from 'react'

import Container from '@mui/material/Container';
import { Paper, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box } from '@mui/system';
import { ToastComp } from '../Commons/ToastComp';
import LoginIcon from '@mui/icons-material/Login';
import axios from 'axios';
import { Buffer } from 'buffer';

function LoginPage() {

    //Submit login form
    const [username, setUsername] = useState('');
    const [pass, setPass] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const loginUser = (e) => {
        e.preventDefault();

        if (username === '' && pass === '') {
            ToastComp('error', 'Please fill in all the input fields!')
        } else {
            setIsLoading(true);
            axios.post(process.env.REACT_APP_BACKEND + 'users/login', {
                'username': username,
                'password': Buffer.from(pass).toString('base64')
            })
                .then((res) => {
                    setIsLoading(false);
                    ToastComp(res.data.status, res.data.msg);
                    if (res.data.status === 'success') {
                        const loggedUser = res.data.data.username;
                        const loggedUserType = res.data.data.usertype;
                        window.sessionStorage.setItem('loggedInUser', JSON.stringify({ 'user': loggedUser, 'usertype': loggedUserType, 'staffID': res.data.data.staffID }));
                        window.setTimeout(() => {
                            if (loggedUserType === 'admin') {
                                window.location.href = '/admin/home';
                            } else {
                                window.location.href = '/staff/home';
                            }
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
            <Container fixed style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Paper elevation={3}>
                    <Box style={{ padding: '15px' }}>
                        <Box style={{ textAlign: 'center', marginBottom: '10px' }}>
                            <h2 style={{ margin: '15px 0' }}>Office Management System</h2>
                            <span>Please enter your login credentials.</span>
                        </Box>
                        <Box
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '35ch' },
                            }}
                            style={{ margin: '15px 0' }}
                        >
                            <form onSubmit={(e) => loginUser(e)} className='w-100'>
                                <div className='d-flex justify-content-center align-items-center'>
                                    <TextField
                                        required
                                        label="Username / Email Address"
                                        type="text"
                                        size='small'
                                        defaultValue={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className='w-100'
                                    />
                                </div>
                                <div className='d-flex justify-content-center align-items-center'>
                                    <TextField
                                        required
                                        label="Password"
                                        type="password"
                                        size='small'
                                        defaultValue={pass}
                                        onChange={(e) => setPass(e.target.value)}
                                        className='w-100'
                                    />
                                </div>
                                <div className='d-flex justify-content-between align-items-center mt-3'>
                                    <a href="/forgot-password" style={{ marginLeft: '10px' }}>Forgot Password?</a>
                                    <LoadingButton
                                        loading={isLoading}
                                        loadingPosition="end"
                                        endIcon={<LoginIcon />}
                                        variant="contained"
                                        style={{ marginRight: '10px' }}
                                        type="submit"
                                    >
                                        Login
                                    </LoadingButton>
                                </div>
                            </form>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </>
    )
}

export default LoginPage
