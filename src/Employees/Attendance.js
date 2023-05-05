import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { addTimes, diffInTwoTimes } from '../Commons/FormatTime';
import Break from './AttnComponents/Break';
import StartSession from './AttnComponents/StartSession';
import StopSession from './AttnComponents/StopSession';
import TotalTime from './AttnComponents/TotalTime';
import GoBack from '../Commons/GoBack';
import AttnList from '../Commons/AttnList';

function Attendance() {

    useEffect(() => {
        if (document.getElementById('attn-nav')) {
            document.getElementById('attn-nav').classList.add('active');
        }
    })

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

    //Fetch timings from database 
    const [getTimings, setTimings] = useState('');
    useEffect(() => {
        const fetchTimings = async () => {
            const timings = await axios.get(process.env.REACT_APP_BACKEND + 'settings/fetch-timings');
            setTimings(timings.data);
        }

        fetchTimings();
    }, [])

    return (
        <>
            <div className="container-fluid">
                <div className="row my-2">
                    <div className="col-sm-6">
                        <h4 className="m-0">Attendance</h4>
                    </div>
                    <div className='col-sm-6 d-flex justify-content-end'>
                        <GoBack />
                    </div>
                </div>
            </div>

            <div className='container-fluid mt-4'>
                <div >
                    <div className='row text-center'>
                        <div className='col-12 mb-4'>
                            <div style={{ width: '100%' }} className='d-flex justify-content-center'>
                                <div className='w-50'>
                                    <div className='border border-secondary rounded px-3 py-2'>
                                        <h4 className='py-2'> <TotalTime /> </h4>
                                        <span>Total Breaks Taken Today : {breaksTotal.length === 1 ? breaksTotal[0] : addTimes(breaksTotal)} Hours</span>
                                        <br></br>
                                        {
                                            getTimings && getTimings.maxBreakHours &&
                                            <span>Remaining Break Time Today : {diffInTwoTimes(breaksTotal.length === 1 ? breaksTotal[0] : addTimes(breaksTotal), getTimings.maxBreakHours)} Hours</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-4'>
                            <StartSession />
                        </div>
                        <div className='col-4'>
                            <Break />
                        </div>
                        <div className='col-4'>
                            <StopSession />
                        </div>
                    </div>

                    <div className='row mt-3'>
                        <div className='card'>
                            <div className='card-body'>
                                <AttnList />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Attendance
