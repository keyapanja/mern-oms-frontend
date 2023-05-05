import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { addTimes, CountWorkingDays, formatDate, FormatTime } from './FormatTime';
import commonTable from './CommonTable';
import parse from 'html-react-parser';
import { ToastComp } from './ToastComp';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);

export const monthOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Monthly Attendance Chart',
        },
    },
};

function AttnList(props) {

    const theme = window.localStorage.getItem('currentOMSTheme');

    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));
    var staffID = '';
    if (props.staff) {
        staffID = props.staff;
    } else {
        staffID = currentUser.staffID;
    }

    //fetch staff attendance report
    const [monthlyData, setMonthlyData] = useState();
    useEffect(() => {
        const date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        axios.get(process.env.REACT_APP_BACKEND + 'reports/monthly-attendance/' + staffID)
            .then((res) => {
                const totalWorkDays = CountWorkingDays(firstDay, new Date());
                const totalPresent = res.data;
                const totalAbsent = parseInt(totalWorkDays) - parseInt(totalPresent);
                const arr = [];
                arr.push(totalPresent, totalAbsent);
                setMonthlyData(arr);
            })
    }, [staffID])

    const monthReport = {
        labels: ['Present', 'Absent'],
        datasets: [
            {
                label: 'Number of Days',
                data: monthlyData,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 99, 132, 0.5)',

                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',

                ],
                borderWidth: 2,
            },
        ]
    }

    //Fetch attendance list
    const [list, setList] = useState([]);
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'attendance/get-attendance/' + staffID).then((res) => {
            if (res.data) {
                setList(res.data)
            }
        })
    }, [staffID])

    const columns = [
        {
            name: 'Date',
            selector: (row) => formatDate(row.date),
            sortable: true
        },
        {
            name: 'From',
            selector: (row) => FormatTime(new Date().toDateString() + " " + row.startTime)
        },
        {
            name: 'To',
            selector: (row) => row.endTime ? FormatTime(new Date().toDateString() + " " + row.endTime) : '-'
        },
        {
            name: 'Breaks',
            selector: (row) => {
                const breaks = row.breaks;
                var breakString = '';
                let breaksTotal = [];
                for (let index = 0; index < breaks.length; index++) {
                    const element = breaks[index];
                    let start = element.start ? FormatTime(new Date().toDateString() + ' ' + element.start) : '-';
                    let end = element.end ? FormatTime(new Date().toDateString() + ' ' + element.end) : '-';
                    breakString += `<span>${start} to ${end}</span>
                        ${element.total ? ' (' + element.total + 'H)' : ''}
                        <br />`

                    if (element.total) {
                        breaksTotal.push(element.total);
                    }
                }
                return <>
                    <div>{parse(breakString)}</div>
                    <span><b>Total : </b>{addTimes(breaksTotal)}H</span>
                </>
            }
        },
        {
            name: 'Total Work Hours',
            selector: (row) => row.endTime ? row.totalWorkHours + 'H' : '-'
        }
    ]

    //Filter by date
    const filterAttn = (e) => {
        e.preventDefault();
        if (e.target.from.value && e.target.to.value) {
            const formData = {
                'from': e.target.from.value,
                'to': e.target.to.value
            }
            console.log(formData)
            axios.post(process.env.REACT_APP_BACKEND + 'attendance/filter-by-date/' + staffID, formData)
                .then((res) => {
                    if (res.data) {
                        setList(res.data)
                    }
                })
        } else {
            ToastComp('error', 'Please select the from and to dates to filter!')
        }
    }

    return (
        <>
            <div className='row my-2 d-flex align-items-center'>
                <div className='col-md-6 col-sm-12'>
                    <button className='btn btn-link text-info' data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">
                        <i className='fa fa-chart-simple'></i> Chart View
                    </button>
                </div>
                <div className='col-md-6 col-sm-12'>
                    <div className='row'>
                        <form onSubmit={filterAttn} id='filterForm'>
                            <div className='d-inline-block col-md-5 col-sm-12 pl-0'>
                                <input className='form-control' type="date" name='from'></input>
                            </div>
                            <div className='d-inline-block col-md-1 col-sm-12 pl-0 text-center'>
                                <label className='pt-2'>to</label>
                            </div>
                            <div className='d-inline-block col-md-5 col-sm-12 pl-0'>
                                <input className='form-control' type="date" name='to'></input>
                            </div>

                            <div className='d-inline-block col-md-1 col-sm-12 text-center'>
                                <button className='btn btn-primary btn-sm' type='submit'>
                                    <i className='fa fa-filter d-none d-sm-block py-1'></i><span className='ml-1 d-block d-sm-none'>Filter</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {
                commonTable('Attendance List', columns, list, ['date'])
            }


            <div className={theme === 'dark' ? 'offcanvas offcanvas-bottom text-bg-dark' : 'offcanvas offcanvas-bottom'} tabIndex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel" style={{ height: '100vh', padding: '15px 20px' }}>
                <div className="offcanvas-header">
                    <h4 className="offcanvas-title" id="offcanvasBottomLabel">Attendance Chart</h4>
                    <button type="button" className={theme === 'dark' ? 'btn-close btn-close-white' : 'btn-close'} data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body small">
                    <div className='row'>
                        <div className='col-md-4 col-sm-12 text-center'>
                            {<Doughnut data={monthReport} options={monthOptions} />}
                        </div>
                        <div className='col-md-6 col-sm-12'></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AttnList
