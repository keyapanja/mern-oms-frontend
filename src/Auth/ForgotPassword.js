import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { Box, Container, Paper, TextField } from '@mui/material'
import React, { useState } from 'react'
import SendIcon from '@mui/icons-material/Send';
import { ToastComp } from '../Commons/ToastComp';
import axios from 'axios';

function ForgotPassword() {

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const checkUser = (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!email) {
            ToastComp('error', 'Please enter a valid email address!');
        } else {
            axios.post(process.env.REACT_APP_BACKEND + 'users/check-user', {
                email: email
            })
                .then((res) => {
                    setIsLoading(false);
                    ToastComp(res.data.status, res.data.msg);
                    if (res.data.status === 'success') {
                        setEmail('');
                        window.setTimeout(() => {
                            ToastComp('info', 'Redirecting to login page...');
                            window.setTimeout(() => {
                                window.location.href = '/';
                            }, 2100)
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
                    <Box style={{ padding: '15px' }}>
                        <Box style={{ textAlign: 'center', marginBottom: '10px' }}>
                            <h2 style={{ margin: '15px 0' }}>Office Management System</h2>
                            <span className='text-bold'>Please enter your Registered Email Address.</span>
                        </Box>

                        <Box
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '35ch' },
                            }}
                            style={{ margin: '15px 0' }}
                        >
                            <form className='w-100' onSubmit={(e) => checkUser(e)}>
                                <div className='d-flex justify-content-center align-items-center'>
                                    <TextField
                                        label="Email Address"
                                        type="email"
                                        size='small'
                                        defaultValue={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className='w-100'
                                    />
                                </div>
                                <div className='d-flex justify-content-center align-items-center my-2'>
                                    <div>
                                        <LoadingButton
                                            loading={isLoading}
                                            loadingPosition="end"
                                            endIcon={<SendIcon />}
                                            variant="contained"
                                            style={{ marginRight: '10px' }}
                                            type="submit"
                                        >
                                            Send Reset Link
                                        </LoadingButton>
                                        <br />
                                        <a href="/" className='text-center mt-3 d-block'>Back to Login</a>
                                    </div>
                                </div>
                            </form>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </>
    )
}

export default ForgotPassword
