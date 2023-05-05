import { Tooltip } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { reloadWindow, SwalComp, ToastComp } from './ToastComp';

function ProjectFiles() {

    //get project id from url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const projectID = urlParams.get('project_id');

    //get current user
    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));

    const [showFiles, setShowFiles] = useState(false);
    const [selectedFile, setSelectedFile] = useState('');
    const [isFileLoading, setFileLoading] = useState(false);
    const [customName, setCustomName] = useState('');

    //Upload files
    const fileUpload = (e) => {
        e.preventDefault();
        setFileLoading(true);
        if (!selectedFile) {
            ToastComp('error', 'Please select a file!');
            setFileLoading(false);
        }
        else if (!customName) {
            ToastComp('error', 'Please enter a file name!');
            setFileLoading(false);
        }
        else {
            const formdata = {
                'file': selectedFile,
            }

            axios.post(process.env.REACT_APP_BACKEND + 'projects/upload-file/' + projectID + '/' + customName + '/' + currentUser.staffID, formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setFileLoading(false);
                    ToastComp(res.data.status, res.data.msg);
                    if (res.data.status === 'success') {
                        reloadWindow();
                    }
                })
                .catch((err) => ToastComp('error', err.message));
        }
    }

    //Fetch related posts
    const [fileList, setFileList] = useState([]);
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'projects/get-files/' + projectID)
            .then((res) => setFileList(res.data))
    }, [projectID])

    //Delete files from project
    const deleteFile = (data) => {
        SwalComp('warning', `Are you sure you want to delete the file named  <em>${data.name.toUpperCase()}</em> ?`, 'Yes, Delete!')
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(process.env.REACT_APP_BACKEND + 'projects/delete-file/' + data._id)
                        .then((res) => {
                            ToastComp(res.data.status, res.data.msg)
                            if (res.data.status === 'success') {
                                reloadWindow();
                            }
                        })
                        .catch((err) => ToastComp('error', err.message))
                }
            })
    }

    return (
        <>
            <div className='card'>
                <div className='card-header'>
                    <div className='card-title h6 text-bold'>Files</div>
                    <div className='card-tools'>
                        <button type="button" className="btn btn-info btn-sm mr-1" data-card-widget="collapse">
                            <i className="fas fa-minus"></i>
                        </button>
                        {
                            !showFiles ?
                                <button type="button" className="btn btn-info btn-sm" onClick={() => setShowFiles(true)}>
                                    <i className='fa fa-folder-plus'></i> Files
                                </button>
                                : <button type="button" className="btn btn-danger btn-sm" onClick={() => setShowFiles(false)}>
                                    <i className='fa fa-xmark'></i> Cancel
                                </button>
                        }
                    </div>
                </div>
                <div className='card-body'>
                    {
                        showFiles ?
                            <div className='p-1'>
                                <div className='card'>
                                    <div className='card-body'>
                                        <form className='mt-4 mb-3 text-center' onSubmit={fileUpload} id='fileForm'>
                                            <div className='d-flex align-items-center justify-content-center' style={{ padding: '0 10%' }}>
                                                <input type='file' style={{ display: 'none' }} id='fileInput' onChange={(e) => setSelectedFile(e.target.files[0])}></input>
                                                <button className='btn btn-primary btn-block py-2 rounded-pill' onClick={() => document.getElementById('fileInput').click()} type="button">
                                                    <i className='fa fa-cloud-arrow-up'></i> Upload File
                                                </button>
                                            </div>
                                            {
                                                selectedFile &&
                                                <>
                                                    <div className='my-2 d-flex justify-content-center'>
                                                        <div className='row w-100'>
                                                            <div className='col-md-6 col-sm-12 py-2'>
                                                                <input type='text' className='form-control' placeholder='Custom File Name *' value={customName} onChange={(e) => setCustomName(e.target.value)}></input>
                                                            </div>
                                                            <div className='col-md-6 col-sm-12'>
                                                                <div className='card border-info mt-2 position-relative px-1' style={{ width: '100%' }}>
                                                                    <div className='row px-2'>
                                                                        <span className='my-2 text-sm col-10 text-start text-info'>{selectedFile.name}</span>
                                                                        <button onClick={() => setSelectedFile('')} className='btn btn-link text-info col-2'><i className='fa fa-xmark'></i></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='text-center mt-2'>
                                                        <button className='btn btn-outline-info px-4' type='submit'>
                                                            {
                                                                isFileLoading &&
                                                                <div className="spinner-border spinner-border-sm mr-1" role="status"></div>
                                                            }
                                                            Save
                                                        </button>
                                                    </div>
                                                </>
                                            }
                                        </form>
                                    </div>
                                </div>
                            </div>
                            : <div className='p-2'>
                                <div style={{ maxHeight: '350px', overflowY: 'auto', position: 'relative' }}>
                                    <table className='table'>
                                        <thead className='bg-light' style={{ position: 'sticky', top: 0 }}>
                                            <tr>
                                                <th>File Name</th>
                                                <th className='text-center'>File</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                fileList.map((item) => {
                                                    return <tr key={item._id}>
                                                        <td>{item.name}</td>
                                                        <td className='text-center'>
                                                            <Tooltip title='Download'>
                                                                <a className='btn btn-outline-success btn-sm mx-1' target="_blank" rel="noreferrer" href={process.env.REACT_APP_UPLOADS + 'projects/' + item.path}>
                                                                    <i className='fa fa-download'></i>
                                                                </a>
                                                            </Tooltip>
                                                            {
                                                                (item.uploadedBy === currentUser.staffID || currentUser.staffID === 'Admin') &&
                                                                <Tooltip title='Delete'>
                                                                    <button className='btn btn-sm btn-outline-danger' onClick={() => deleteFile(item)}>
                                                                        <i className='fa fa-trash'></i>
                                                                    </button>
                                                                </Tooltip>
                                                            }
                                                        </td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </>
    )
}

export default ProjectFiles
