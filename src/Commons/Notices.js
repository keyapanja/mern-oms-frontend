import React, { useEffect, useState } from 'react'
import { reloadWindow, ToastComp } from './ToastComp'
import axios from 'axios'
import { formatDate } from './FormatTime'
import Swal from 'sweetalert2'
import GetUserPermissions from './GetUserPermissions'

function Notices() {

    useEffect(() => {
        if (document.getElementById('notice-nav')) {
            document.getElementById('notice-nav').classList.add('active');
        }
    })

    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));

    var getUser = GetUserPermissions(currentUser.user);
    const [staffAccess, setStaffAccess] = useState(false);
    useEffect(() => {
        if (getUser && getUser.permissions && getUser.permissions.find(per => per === 'Notices')) {
            setStaffAccess(true);
        }
    }, [getUser])

    //post content variable
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    //Post notice
    const postNotice = (e) => {
        e.preventDefault();
        setIsLoading(true)

        if (!desc) {
            ToastComp('error', 'Description should not be empty!');
            setIsLoading(false);
        } else if (desc.length < 11) {
            ToastComp('warning', 'Description is too small!')
            setIsLoading(false);
        } else {
            const formData = {
                'title': title,
                'desc': desc,
                'postedBy': currentUser.staffID
            }

            axios.post(process.env.REACT_APP_BACKEND + 'others/post-notice', formData)
                .then((res) => {
                    setIsLoading(false);
                    ToastComp(res.data.status, res.data.msg);
                    if (res.data.status === 'success') {
                        reloadWindow();
                    }
                })
        }
    }

    //Fetch all notices
    const [getNotices, setNotices] = useState([]);
    useEffect(() => {
        const fetchNotices = async () => {
            const notice = await axios.get(process.env.REACT_APP_BACKEND + 'others/get-notices');
            const data = notice.data;
            setNotices(data);
        }

        fetchNotices();
    }, [])

    //Change inputs to editable form 
    const [editable, setEditable] = useState('');

    //Reset form and turn off edit
    const resetForm = (itemID) => {
        const form = document.getElementById(itemID + '-form');
        if (form) {
            form.reset();
            setEditable('');
        }
    }

    //Save changes
    const saveChanges = (itemID) => {
        const title = document.getElementById(itemID + '-title');
        const desc = document.getElementById(itemID + '-desc');
        var formData = {}
        if (title) {
            formData.title = title.value;
        }
        if (desc) {
            formData.desc = desc.value;
        }

        axios.post(process.env.REACT_APP_BACKEND + 'others/edit-notice/' + itemID, formData)
            .then((res) => {
                ToastComp(res.data.status, res.data.msg);
                if (res.data.status === 'success') {
                    reloadWindow();
                }
            })
        resetForm(itemID);
    }

    //Delete Notice 
    const DeleteNotice = (itemID) => {
        Swal.fire({
            icon: 'warning',
            html: 'Are you sure you want to delete this notice?',
            showCancelButton: true,
            cancelButtonText: 'No, Cancel!',
            confirmButtonText: 'Yes, Delete!',
            reverseButtons: true
        })
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(process.env.REACT_APP_BACKEND + 'others/delete-notice/' + itemID)
                        .then((res) => {
                            ToastComp(res.data.status, res.data.msg);
                            if (res.data.status === 'success') {
                                reloadWindow();
                            }
                        })
                }
            })
    }

    return (
        <>
            <h4>Notices</h4>

            {
                ((currentUser && currentUser.usertype === 'admin') || staffAccess) &&
                <div className='row d-flex justify-content-end'>
                    <div>
                        {
                            !showForm ?
                                <button className='btn btn-secondary' style={{ padding: '7px 25px' }} onClick={() => setShowForm(true)}>
                                    <i className='fa fa-plus mr-1'></i> New Notice
                                </button>
                                :
                                <button className='btn btn-secondary' style={{ padding: '7px 25px' }} onClick={() => setShowForm(false)}>
                                    <i className='fa fa-minus mr-1'></i> Hide Form
                                </button>
                        }
                    </div>
                </div>
            }
            {
                showForm &&
                <div className='row px-2'>
                    <div className='card mt-4 col-12'>
                        <div className='card-header'>Post New Notice</div>
                        <div className='card-body'>
                            <form onSubmit={postNotice}>
                                <label>Title</label>
                                <input className='form-control mb-3' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)}></input>

                                <label>Description <span className='text-orange'>*</span></label>
                                <textarea className='form-control' rows={4} placeholder='Type something here...' value={desc} onChange={(e) => setDesc(e.target.value)}></textarea>
                                <div className='text-right my-2'>
                                    <button className='btn btn-primary' type='submit' style={{ padding: '7px 7%' }} disabled={isLoading}>
                                        Post
                                        {
                                            isLoading && <div className="spinner-border spinner-border-sm ml-2" role="status"></div>
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            }

            <div className='row py-3'>
                {
                    getNotices.length > 0 ?
                        getNotices.map((item) => {
                            return <div key={item._id} className="col-12">
                                <div className='card' style={{ borderRadius: '10px !important', overflow: 'hidden' }}>
                                    <form id={item._id + '-form'}>
                                        {item.title && <div className='card-header p-0'>
                                            <div className='h5 mb-0'>
                                                <input type='text' className='form-control plaintext text-bold' readOnly={editable === item._id ? false : true} defaultValue={item.title} id={item._id + '-title'}></input>
                                            </div>
                                        </div>}
                                        <div className='card-body p-0'>
                                            <input type='text' className='form-control plaintext' readOnly={editable === item._id ? false : true} defaultValue={item.desc} id={item._id + '-desc'}></input>
                                        </div>
                                    </form>
                                    <div className='card-footer py-1 position-relative row' style={{ borderRadius: 0 }}>
                                        <span className='text-sm col-6 py-1'><em>Posted on {formatDate(item.createdAt)}</em></span>

                                        <div className='d-flex justify-content-end col-6'>
                                            {((currentUser && currentUser.usertype === 'admin') || staffAccess) &&
                                                <div className="btn-group" role="group">
                                                    {
                                                        editable && editable === item._id ?
                                                            <>
                                                                <button type="button" className='btn btn-sm btn-primary' onClick={() => saveChanges(item._id)}>
                                                                    <i className='fa fa-floppy-disk'></i>
                                                                </button>
                                                                <button type="button" className='btn btn-sm btn-danger' onClick={() => resetForm(item._id)}>
                                                                    <i className='fa fa-xmark'></i>
                                                                </button>
                                                            </>
                                                            : <>
                                                                <button type="button" className="btn btn-sm btn-primary" onClick={() => setEditable(item._id)}>
                                                                    <i className='fa fa-edit'></i>
                                                                </button>
                                                                <button type="button" className="btn btn-sm btn-danger" onClick={() => DeleteNotice(item._id)}>
                                                                    <i className='fa fa-trash'></i>
                                                                </button>
                                                            </>
                                                    }
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })
                        :
                        <>
                            <div className='container text-center py-4'>
                                <h3>No Notices Found!</h3>
                            </div>
                        </>
                }
            </div>
        </>
    )
}

export default Notices
