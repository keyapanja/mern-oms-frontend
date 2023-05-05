import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { diffInTwoTimes, FormatTime } from '../../Commons/FormatTime';
import { reloadWindow, ToastComp } from '../../Commons/ToastComp';

function Break() {

    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));

    //Fetch today's attendance
    const [breaksList, setBreaksList] = useState([]);
    const [attnToday, setAttnToday] = useState('');
    useEffect(() => {
        const fetchAttn = async () => {
            const attnData = await axios.get(process.env.REACT_APP_BACKEND + 'attendance/get-today-session/' + currentUser.staffID);
            setAttnToday(attnData.data);
            window.setTimeout(() => {
                setBreaksList(attnData.data && attnData.data.breaks);
            }, 50)
        }

        fetchAttn();
    }, [currentUser.staffID])

    const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
    const [manual, setManual] = useState(false);

    const startBreak = () => {
        var startTime = '';
        if (manual) {
            startTime = time;
        } else {
            startTime = new Date().getHours() + ':' + new Date().getMinutes();
        }

        if (startTime !== '') {
            axios.post(process.env.REACT_APP_BACKEND + 'attendance/start-break/' + currentUser.staffID, {
                breakTime: { start: startTime, end: '' }
            })
                .then((res) => {
                    ToastComp(res.data.status, res.data.msg);
                    if (res.data.status === 'success') {
                        reloadWindow();
                    }
                })

        }
    }

    const endBreak = () => {
        var endTime = '';
        if (manual) {
            endTime = time;
        } else {
            endTime = new Date().getHours() + ':' + new Date().getMinutes();
        }

        if (endTime !== '') {
            const startedLast = breaksList.find(item => item.end === '');
            axios.post(process.env.REACT_APP_BACKEND + 'attendance/end-break/' + currentUser.staffID, { end: endTime, total: diffInTwoTimes(startedLast.start, endTime) })
                .then((res) => {
                    ToastComp(res.data.status, res.data.msg);
                    if (res.data.status === 'success') {
                        reloadWindow();
                    }
                })

        }
    }

    return (
        <>
            {
                (breaksList && breaksList.length > 0 && breaksList.find(item => item.end === '')) ?
                    <button className="btn btn-info btn-block" data-bs-toggle="modal" data-bs-target="#endBreakModal" >
                        End Break
                    </button>
                    : <button className="btn btn-info btn-block" data-bs-toggle="modal" data-bs-target="#startbreakModal" disabled={attnToday && attnToday.endTime === '' ? false : true} >
                        Take a Break
                    </button>
            }

            <div className="modal fade" id="startbreakModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-between align-items-center">
                            <h4 className="modal-title fs-5 m-0" id="staticBackdropLabel">Take a Break</h4>
                            <button type="button" className="btn btn-link text-secondary py-0" data-bs-dismiss="modal" aria-label="Close">
                                <i className='fa fa-xmark' style={{ fontSize: '20px' }}></i>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className='container-fluid text-center my-4'>
                                Your break time is going to start from :
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
                                <button type="button" className="btn btn-info mx-2" onClick={startBreak}>Start Break</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="endBreakModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-between align-items-center">
                            <h4 className="modal-title fs-5 m-0" id="staticBackdropLabel">End Break</h4>
                            <button type="button" className="btn btn-link text-secondary py-0" data-bs-dismiss="modal" aria-label="Close">
                                <i className='fa fa-xmark' style={{ fontSize: '20px' }}></i>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className='container-fluid text-center my-4'>
                                Your break time is going to end on :
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
                                <button type="button" className="btn btn-info mx-2" onClick={endBreak}>End Break</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Break
