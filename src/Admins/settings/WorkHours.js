import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { reloadWindow, ToastComp } from '../../Commons/ToastComp';

function WorkHours() {

    useEffect(() => {
        if (document.getElementById('hours-nav')) {
            document.getElementById('hours-nav').classList.add('active');
        }
        if (document.getElementById('settings-nav')) {
            document.getElementById('settings-nav').classList.add('active');
        }
        if (document.getElementById('settings-menu')) {
            document.getElementById('settings-menu').classList.add('menu-open');
        }
    })

    //Clone input boxes to add more timings
    const cloneInput = () => {
        const inputBox = document.getElementById('inputBox');
        const inputField = document.getElementById('inputFields');
        inputField.appendChild(inputBox.cloneNode(true))
        setRev(false);
    }

    //Count timings
    const [totalTimes, setTotalTimes] = useState(0);
    const [totalHours, setTotalHours] = useState('0.00 Hours');
    const [rev, setRev] = useState(false);
    const [timings, setTimings] = useState([]);

    const review = () => {
        const starts = document.getElementsByName('starts[]');
        var startTimes = [];
        for (let index = 0; index < starts.length; index++) {
            const element = starts[index];
            if (element.value !== '') {
                startTimes.push(element.value);
            }
        }

        const ends = document.getElementsByName('ends[]');
        var endTimes = [];
        for (let index = 0; index < ends.length; index++) {
            const element = ends[index];
            if (element.value !== '') {
                endTimes.push(element.value);
            }
        }

        if ((startTimes.length === endTimes.length) && startTimes.length > 0) {
            setTotalTimes(startTimes.length)
            var timeDiffs = [];
            var finalObj = [];
            for (let index = 0; index < startTimes.length; index++) {
                const from = new Date(new Date().toDateString() + ' ' + startTimes[index]);
                const to = new Date(new Date().toDateString() + ' ' + endTimes[index]);
                let difference = to.getTime() - from.getTime();
                difference = difference / 1000 / 60;
                let hours = parseInt(difference / 60);
                let minutes = parseInt(difference % 60);
                timeDiffs.push(hours + "." + minutes);

                const newObj = {
                    'from': startTimes[index],
                    'to': endTimes[index]
                }
                finalObj.push(newObj);
            }
            setTimings(finalObj);

            var total = 0.00;
            if (timeDiffs.length > 0) {
                for (let index = 0; index < timeDiffs.length; index++) {
                    const element = timeDiffs[index];
                    total += parseFloat(element);
                }
            }

            if (parseInt(total.toFixed(2).toString().split('.')[1]) >= 60) {
                let newTotal = total.toFixed(2);
                let newHours = (parseInt(newTotal.toString().split('.')[1]) / 60) + parseInt(total.toString().split('.')[0]);
                let newMins = parseInt(newTotal.toString().split('.')[1]) % 60;
                let final = parseInt(newHours) + '.' + parseInt(newMins);
                setTotalHours(parseFloat(final).toFixed(2) + ' Hours');
            } else {
                setTotalHours(parseFloat(total).toFixed(2) + ' Hours');
            }
            setRev(true);
        } else {
            ToastComp('warning', 'Please enter both start and end time!')
            setTotalTimes(0);
            setTotalHours('0.00 Hours')
        }
    }

    //Save timings
    const saveTimings = (e) => {
        e.preventDefault();
        if (timings.length > 0) {
            const formData = {
                timings: timings,
                totalHours: totalHours,
            }

            axios.post(process.env.REACT_APP_BACKEND + 'settings/add-timings', formData)
                .then((res) => {
                    ToastComp(res.data.status, res.data.msg);
                    if (res.data.status === 'success') {
                        reloadWindow();
                    }
                })
                .catch((err) => {
                    ToastComp('error', err.message);
                })
        }
    }

    //Employee Timings
    const [workHours, setWorkHours] = useState('');
    const [breakHours, setBreakHours] = useState(0);

    const saveHours = () => {
        if (workHours !== 0 && breakHours !== 0) {
            const formData = {
                minWorkHours: workHours,
                maxBreakHours: breakHours
            }

            axios.post(process.env.REACT_APP_BACKEND + 'settings/add-timings', formData)
                .then((res) => {
                    ToastComp(res.data.status, res.data.msg);
                    if (res.data.status === 'success') {
                        reloadWindow();
                    }
                })
                .catch((err) => {
                    ToastComp('error', err.message);
                })
        } else {
            ToastComp("error", 'Please enter valid hours!');
        }
    }

    // Fetch saved data
    const [timing, setTiming] = useState([]);
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'settings/fetch-timings')
            .then((res) => {
                // console.log(res.data)
                setTiming(res.data)
            })
    }, [])

    return (
        <>
            <h4>Work Hours</h4>

            <div className='row mt-4'>

                {/* Set up company's timings  */}
                <div className='col-md-6 col-sm-12'>
                    <div className='card'>
                        <div className='card-header'>
                            <div className='d-flex justify-content-between w-100'>
                                <h5 className='m-0'>Business Timings</h5>
                            </div>
                        </div>
                        <div className='card-body'>
                            {
                                timing &&
                                <>
                                    <h6 className='mt-2 mb-2 text-success text-bold'>
                                        <i className='fa fa-circle-check'></i> Completed
                                    </h6>
                                    {
                                        timing.timings && timing.timings.map((item) => {
                                            return <div className='mb-3'>
                                                <span>From : {item.from}</span> &emsp; &emsp; <span>To : {item.to}</span>
                                            </div>
                                        })
                                    }
                                    <hr />
                                </>
                            }
                            <form id="timingForm">
                                <div className='row text-center'>
                                    <div className='col-12' id="inputFields">
                                        <div className='row' id="inputBox">
                                            <div className='col'>
                                                <div className='form-group'>
                                                    <label>From</label>
                                                    <input type='time' className='form-control' name='starts[]'></input>
                                                </div>
                                            </div>
                                            <div className='col'>
                                                <div className='form-group'>
                                                    <label>To</label>
                                                    <input type='time' className='form-control' name='ends[]'></input>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-12'>
                                        <button className='btn btn-link text-info my-0 py-1 btn-sm' type='button' onClick={cloneInput}><i className='fa fa-plus'></i> Add More Timings</button>
                                    </div>
                                    {
                                        rev &&
                                        <div className='col-12'>
                                            <h6>Total Number of Timings: {totalTimes}</h6>
                                            <h6>Total Business Hours: {totalHours}</h6>
                                        </div>
                                    }
                                    <div className='col-12 my-3'>
                                        {
                                            !rev ?
                                                <button className='btn btn-primary' type='button' onClick={review}>Review</button>
                                                : <button className='btn btn-primary' type='submit' onClick={saveTimings}>
                                                    Save Timings
                                                </button>
                                        }
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Set up employee timings */}
                <div className='col-md-6 col-sm-12'>
                    <div className='card'>
                        <div className='card-header'>
                            <h5 className='m-0'>Employee Timings</h5>
                        </div>
                        <div className='card-body'>
                            {
                                timing && <>
                                    <h6 className='mt-2 mb-2 text-success text-bold'>
                                        <i className='fa fa-circle-check'></i> Completed
                                    </h6>
                                    <span>Minimum Working Hours: {timing.minWorkHours}</span>
                                    <br></br>
                                    <span>Maximum Break Time: {timing.maxBreakHours}</span>
                                    <br />
                                    <span>Total Hours: {timing.totalHours}</span>
                                    <hr />
                                </>
                            }
                            <div className='row d-flex align-items-center mb-2 mt-3'>
                                <div className='col-md-4 col-sm-6'>
                                    <label className='m-0'>Minimum Working Hours</label>
                                </div>
                                <div className='col-md-3 col-sm-6 d-flex align-items-center'>
                                    <input className='form-control mr-2 text-center' type='number' min={0} step={0.05} value={workHours} onChange={(e) => setWorkHours(e.target.value)}></input>
                                    Hours
                                </div>
                            </div>
                            <div className='row d-flex align-items-center mt-3'>
                                <div className='col-md-4 col-sm-6'>
                                    <label className='m-0'>Maximum Break Time</label>
                                </div>
                                <div className='col-md-3 col-sm-6 d-flex align-items-center'>
                                    <input className='form-control mr-2 text-center' type='time' value={breakHours} onChange={(e) => setBreakHours(e.target.value)}></input>
                                    Hours
                                </div>
                            </div>
                            <button className='btn btn-primary mt-4 mb-3 px-4' onClick={saveHours}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WorkHours
