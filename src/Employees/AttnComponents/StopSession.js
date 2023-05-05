import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { addTimes, diffInTwoTimes, FormatTime } from '../../Commons/FormatTime';
import { reloadWindow, ToastComp } from '../../Commons/ToastComp';


function StopSession() {

    const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
    const [manual, setManual] = useState(false);

    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));

    //Fetch today's attendance
    const [attnToday, setAttnToday] = useState('');
    useEffect(() => {
        const fetchAttn = async () => {
            const attnData = await axios.get(process.env.REACT_APP_BACKEND + 'attendance/get-today-session/' + currentUser.staffID);
            setAttnToday(attnData.data);
        }

        fetchAttn();
    }, [currentUser.staffID])

    //Count total break times
    var breaksTotal = [];
    if (attnToday && attnToday.breaks.length > 0) {
        for (let index = 0; index < attnToday.breaks.length; index++) {
            const element = attnToday.breaks[index];
            if (element.total) {
                breaksTotal.push(element.total);
            }
        }
    }


    //End session
    const handleEnd = () => {
        const formData = {}
        if (manual) {
            formData.endTime = time;
        } else {
            let endTime = new Date().getHours() + ':' + new Date().getMinutes();
            formData.endTime = endTime;
        }

        if (formData.endTime) {
            const totalBreaks = breaksTotal.length === 1 ? breaksTotal[0] : addTimes(breaksTotal);
            const totalWork = diffInTwoTimes(formData.endTime, attnToday.startTime);
            const totalWithBreak = diffInTwoTimes(totalWork, totalBreaks);
            formData.totalHours = totalWithBreak;
        }

        axios.post(process.env.REACT_APP_BACKEND + 'attendance/stop-session/' + currentUser.staffID, formData)
            .then((res) => {
                ToastComp(res.data.status, res.data.msg);
                if (res.data.status === 'success') {
                    reloadWindow();
                }
            })
    }

    return (
        <>
            <button className="btn btn-danger btn-block" data-bs-toggle="modal" data-bs-target="#stopSessionModal" disabled={(attnToday && attnToday.endTime !== '') ? true : !attnToday && true}>
                Stop Session
            </button>

            <div className="modal fade" id="stopSessionModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-between align-items-center">
                            <h4 className="modal-title fs-5 m-0" id="staticBackdropLabel">Stop Session</h4>
                            <button type="button" className="btn btn-link text-secondary py-0" data-bs-dismiss="modal" aria-label="Close">
                                <i className='fa fa-xmark' style={{ fontSize: '20px' }}></i>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className='container-fluid text-center my-4'>
                                Your session is going to end on :
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
                                <button type="button" className="btn btn-danger mx-2" onClick={handleEnd}>End Session</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StopSession
