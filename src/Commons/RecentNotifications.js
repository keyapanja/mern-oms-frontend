import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { formatDate } from './FormatTime';

function RecentNotifications() {

    const [recentList, setRecentList] = useState([]);
    useEffect(() => {
        const getRecentNotices = async () => {
            const res = await axios.get(process.env.REACT_APP_BACKEND + 'others/recent-notices');
            setRecentList(res.data);
        }
        getRecentNotices();
    })

    //get current user
    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));

    return (
        <>
            <div className='card'>
                <div className='card-header'>
                    <h5 className='card-title m-0'>Recent Notifications</h5>
                </div>
                <div className='card-body'>
                    {
                        recentList && recentList.length > 0
                            ? recentList.map((item) => {
                                return <>
                                    <div className='card card-outline card-primary card-hover my-2' key={item._id}>
                                        <div className='card-body p-2'>
                                            <span className='text-muted text-sm'>{formatDate(item.createdAt)}</span>
                                            <h5 className='my-1'>{item.title}</h5>
                                            <p className='my-1'>{item.desc}</p>
                                        </div>
                                    </div>
                                </>
                            })
                            : <div className='text-center text-muted'>No Notifications Found..!</div>
                    }
                </div>
                <div className='card-footer text-center p-2'>
                    <a href={currentUser.usertype === 'admin' ? '/admin/notices' : '/staff/notices'} className='link-primary'>View All<i className='fa fa-circle-right ml-2'></i></a>
                </div>
            </div>
        </>
    )
}

export default RecentNotifications
