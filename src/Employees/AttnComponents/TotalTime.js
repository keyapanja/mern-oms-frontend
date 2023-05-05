import { Tooltip } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { diffInTwoTimes } from '../../Commons/FormatTime';

function TotalTime() {

    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));

    //Fetch today's attendance
    const [attnToday, setAttnToday] = useState('');
    const [totalToday, setTotalToday] = useState('0:00');
    useEffect(() => {
        const fetchAttn = async () => {
            const attnData = await axios.get(process.env.REACT_APP_BACKEND + 'attendance/get-today-session/' + currentUser.staffID);
            setAttnToday(attnData.data);
        }

        fetchAttn();

        setTotalToday(diffInTwoTimes(attnToday && attnToday.startTime, (attnToday && attnToday.endTime) || new Date().getHours() + ":" + new Date().getMinutes()));
    }, [currentUser.staffID, attnToday])

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
            {finalTime(totalToday, attnToday)} Hours
            {
                getTimings && getTimings.maxBreakHours && finalTime(totalToday, attnToday) >= '08:00' &&
                <Tooltip title="You have completed the minimum working hours!"><i className='fa fa-circle-check text-sm ml-2 text-success cursor-pointer'></i></Tooltip>
            }
        </>
    )
}

export default TotalTime

export function finalTime(totalToday, attnToday) {
    let final = totalToday;
    if (attnToday && attnToday.breaks.length > 0) {
        for (let index = 0; index < attnToday.breaks.length; index++) {
            const element = attnToday.breaks[index];
            if (element.total) {
                final = diffInTwoTimes(final, element.total);
            }
        }
        return final;
    } else {
        return totalToday;
    }
}
