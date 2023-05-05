import React, { useEffect, useState } from 'react'
import { FormatTime } from '../../Commons/FormatTime';
import axios from 'axios';
import { reloadWindow, ToastComp } from '../../Commons/ToastComp';

function StartSession() {

    const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
    const [manual, setManual] = useState(false);

    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));

    //submit form with entered time
    const handleStart = () => {
        const formData = {
            staffID: currentUser.staffID,
        }
        if (manual) {
            formData.startTime = time
        } else {
            formData.startTime = new Date().getHours() + ':' + new Date().getMinutes();
        }

        axios.post(process.env.REACT_APP_BACKEND + 'attendance/start-session', formData)
            .then((res) => {
                ToastComp(res.data.status, res.data.msg);
                if (res.data.status === 'success') {
                    reloadWindow();
                }
            })
    }

    //Fetch today's attendance
    const [attnToday, setAttnToday] = useState('');
    useEffect(() => {
        const fetchAttn = async () => {
            const attnData = await axios.get(process.env.REACT_APP_BACKEND + 'attendance/get-today-session/' + currentUser.staffID);
            setAttnToday(attnData.data);
        }

        fetchAttn();
    }, [currentUser.staffID])

    return (
        <>
            <button className="btn btn-success btn-block" data-bs-toggle="modal" data-bs-target="#startSessionModal" disabled={attnToday ? true : false}>
                Start Session
            </button>

            <div className="modal fade" id="startSessionModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-between align-items-center">
                            <h4 className="modal-title fs-5 m-0" id="staticBackdropLabel">Start Session</h4>
                            <button type="button" className="btn btn-link text-secondary py-0" data-bs-dismiss="modal" aria-label="Close">
                                <i className='fa fa-xmark' style={{ fontSize: '20px' }}></i>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className='container-fluid text-center my-4'>
                                Your session is going to start from :
                                <br></br>
                                {!manual && <>
                                    <h4 id="startTime">{FormatTime()}</h4>
                                    <button className='btn btn-link text-info' onClick={() => setManual(true)}>Enter time manually</button>
                                </>
                                }

                                {
                                    manual &&
                                    <>
                                        <div className='px-4 py-2 d-flex justify-content-center mt-2'>
                                            <input type='time' className='form-control' value={time} onChange={(e) => setTime(e.target.value)}></input>
                                        </div>
                                        <button className='btn btn-link text-info' onClick={() => setManual(false)}>Set time Automatically</button>
                                    </>
                                }
                            </div>

                            <div className="w-100 d-flex justify-content-center mt-4 mb-3">
                                <button type="button" className="btn btn-secondary mx-2" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" className="btn btn-success mx-2" onClick={handleStart}>Start Session</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StartSession
