import axios from 'axios';
import React, { useEffect, useState } from 'react'
import parse from 'html-react-parser';
import { formatDate, FormatTime } from './FormatTime';
import { ToastComp } from './ToastComp';

function Notifications() {

    const theme = window.localStorage.getItem('currentOMSTheme');
    //get current user
    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));

    //Fething user's notifications
    const [notis, setNotis] = useState([]);
    const notifs = async () => {
        const fetchNotifs = await axios.get(process.env.REACT_APP_BACKEND + 'notifications/get-notifications/' + currentUser.staffID);
        const data = fetchNotifs.data;
        setNotis(data);
    }
    useEffect(() => {
        notifs()
    })

    //Mark all the unseen notifications as read 
    const markAllRead = () => {
        axios.post(process.env.REACT_APP_BACKEND + 'notifications/mark-all-as-read/' + currentUser.staffID)
            .then((res) => {
                ToastComp(res.data.status, res.data.msg);
                notifs();
            })
            .catch((err) => ToastComp('error', err.message))
    }

    //Mark a notification as read on click and visit the link
    const visitNotification = (data) => {
        if (data.status !== 'read') {
            axios.post(process.env.REACT_APP_BACKEND + 'notifications/mark-as-read/' + data._id)
                .then(() => {
                    window.location.href = data.link;
                })
        } else {
            window.location.href = data.link;
        }
    }

    return (
        <>
            <div className={theme === 'dark' ? 'offcanvas offcanvas-end text-bg-dark' : 'offcanvas offcanvas-end'} data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Notifications</h5>
                    <button type="button" className={theme === 'dark' ? 'btn-close btn-close-white' : 'btn-close'} data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body py-0">
                    {
                        notis.length > 0
                            ? <>
                                <div>
                                    <div className='d-block w-100 text-end'>
                                        <button className='btn btn-link text-info text-sm' onClick={markAllRead}><i className='fa fa-check-double mr-1'></i>Mark All As Read</button>
                                    </div>
                                    {
                                        notis.map((result) => {
                                            result.records.length > 0 && result.records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                            return <div key={result._id} className='mb-3'>

                                                {new Date(result._id).toDateString() === new Date().toDateString() &&
                                                    <label className='text-info'>Today</label>}
                                                {new Date(result._id).toDateString() !== new Date().toDateString() &&
                                                    <label className='text-muted'>{formatDate(result._id)}</label>}
                                                {
                                                    result.records.map((item) => {
                                                        return <div className={`p-2 rounded cursor-pointer ${item.status !== 'read' && 'notification-bg'}`} key={item._id} onClick={() => visitNotification(item)}>
                                                            <div className='row p-0 d-flex align-items-center'>
                                                                <div className='col-2 pr-0'>
                                                                    <i className={item.icon} style={{ height: '35px', width: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}></i>
                                                                </div>
                                                                <div className='col-8 p-0'>
                                                                    {parse(item.msg)}
                                                                </div>
                                                                <div className='col-2 pr-0 text-end' style={{ fontSize: '11px', minWidth: '50px' }}>
                                                                    {FormatTime(item.createdAt)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        })
                                    }
                                </div>
                            </>
                            : <>
                                <div className='text-center w-100 py-4'>
                                    <span className='text-muted'>No Notifications Available..!</span>
                                </div>
                            </>
                    }
                </div>
            </div >
        </>
    )
}

export default Notifications


export function CountNotifications() {
    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));

    const [total, setTotal] = useState('');

    const fetchNotifs = async () => {
        const count = await axios.get(process.env.REACT_APP_BACKEND + 'count/unread-notifications/' + currentUser.staffID);
        const data = count.data;
        if (data !== 0) {
            setTotal(data);
        }
    }

    window.setInterval(() => {
        fetchNotifs();

    }, 1000)

    return total;
}