import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { formatDate } from '../../Commons/FormatTime';

function ProjectTasks(props) {

    const projectID = props.projectID
    const [taskList, setTaskList] = useState([]);
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'projects/get-project-tasks/' + projectID)
            .then((res) => {
                setTaskList(res.data)
            })
    }, [projectID])

    return (
        <>
            {
                taskList.length > 0 ?
                    taskList.map((item) => {
                        return <div key={item._id} className='card card-outline card-secondary'>
                            <div className='card-header p-2'>
                                <b>To : </b><span>{item.name}</span>
                                {
                                    item.status === 'Pending' &&
                                    <span className='badge badge-sm ml-2 badge-warning badge-pill'>Pending</span>
                                }
                                {
                                    item.status === 'Completed' &&
                                    <span className='badge badge-sm ml-2 badge-success badge-pill'>Completed</span>
                                }
                            </div>
                            <div className='card-body p-2'>
                                {item.task}
                            </div>
                            <div className='card-footer p-2 text-sm'>
                                <div className="hstack gap-3">
                                    <div>Assigned On: {formatDate(item.createdAt)}</div>
                                    {
                                        item.createdAt !== item.updatedAt &&
                                        <>
                                            <div className="vr" style={{ width: '2px', opacity: '0.40' }}></div>
                                            <div>Last Updated: {formatDate(item.updatedAt)}</div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    })
                    : <div className='w-100 text-center py-4'>
                        <span className='text-muted'>No tasks found..!</span>
                    </div>
            }
        </>
    )
}

export default ProjectTasks
