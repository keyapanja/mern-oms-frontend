import React, { useEffect, useState } from 'react'
import { ToastComp, reloadWindow, SwalComp } from '../Commons/ToastComp';
import axios from 'axios';
import CommonTable from '../Commons/CommonTable';
import { formatDate } from '../Commons/FormatTime';

function Departments() {

    useEffect(() => {
        if (document.getElementById('dept-nav')) {
            document.getElementById('dept-nav').classList.add('active');
        }
    })

    //Fetch departments from database
    const [DeptList, setDeptList] = useState([]);
    useEffect(() => {
        const fetchDepts = async () => {
            const depts = await axios.get(process.env.REACT_APP_BACKEND + 'departments/');
            const data = depts.data;

            setDeptList(data);
        }

        fetchDepts();
    }, [])

    //Delete departments
    const deleteDept = (data) => {
        SwalComp('warning', `Are you sure you want to delete the department <br> <em>"${data.name}"</em> ? <br> <span class="text-sm">You won't be able to revert this and all the related data may get affected!</span>`, 'Yes, Delete!', 'No, Cancel!')
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(process.env.REACT_APP_BACKEND + 'departments/delete/' + data._id)
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
            })
    }

    //Edit modal with data
    const [editID, setEditID] = useState('');
    const [editName, setEditName] = useState('');
    const openEditModal = (data) => {
        setEditID(data.dept_Id);
        setEditName(data.name);
    }

    //Edit departments
    const [newName, setNewName] = useState('');
    const editDept = (e) => {
        e.preventDefault();
        if (newName && newName !== editName) {
            axios.post(process.env.REACT_APP_BACKEND + 'departments/edit/' + editID,
                { 'newName': newName })
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
            ToastComp('warning', 'No changes made..!')
        }
    }

    //Columns for datatable
    const columns = [
        {
            name: '#',
            cell: (row) => '#',
            width: '5%'
        },
        {
            name: 'Department ID',
            selector: (row) => row.dept_Id,
            sortable: true,
        },
        {
            name: 'Department Name',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: 'Created At',
            selector: (row) => formatDate(row.createdAt),
            sortable: true,
        },
        {
            name: 'Action',
            selector: (row) => {
                return <>
                    <button className='btn btn-sm btn-primary mr-1' data-bs-toggle="modal" data-bs-target="#editDeptModal" onClick={() => openEditModal(row)}><i className='fa fa-edit'></i></button>
                    <button className='btn btn-sm btn-danger' onClick={() => deleteDept(row)}><i className='fa fa-trash'></i></button>
                </>
            }
        }
    ]

    //Input values
    const [deptName, setDeptName] = useState('');
    const [deptID, setDeptID] = useState('');

    //Update Department ID
    const changeDept = (val) => {
        setDeptName(val);
        if (val && val.length > 1) {
            const parts = val.split(" ");
            var newID = '';

            if (document.getElementById('loaderDiv')) {
                document.getElementById('loaderDiv').style.display = 'block';
                window.setTimeout(() => {
                    document.getElementById('loaderDiv').style.display = 'none';
                }, 1500)
            }

            for (let index = 0; index < parts.length; index++) {
                const element = parts[index];
                newID += element.charAt(0);
            }
            setDeptID(newID.toUpperCase() + '-' + Math.floor(Math.random() * 1000));
        } else {
            setDeptID('');
            if (document.getElementById('loaderDiv')) {
                document.getElementById('loaderDiv').style.display = 'none';
            }
        }
    }

    //Add Department
    const addDept = (e) => {
        e.preventDefault();
        if (deptName && deptID) {
            const formData = {
                'dept_Id': deptID,
                'name': deptName
            }
            axios.post(process.env.REACT_APP_BACKEND + 'departments/add', formData)
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
            ToastComp('error', 'Please enter a department name!');
        }
    }

    return (

        <>
            <div className='row'>
                <div className='col-md-12 col-sm-12'>
                    <div className='card'>
                        <div className='card-header d-flex align-items-center justify-content-between'>
                            <h4 className='card-title w-50'>Departments</h4>
                            <div className='card-tools w-50'>
                                <button className='btn btn-primary btn-sm float-right' data-bs-toggle="modal" data-bs-target="#addDeptModal">
                                    <i className='fa fa-plus'></i> Add New Department
                                </button>
                            </div>
                        </div>
                        <div className='card-body'>
                            <div className='table-responsive'>
                                {CommonTable('Departments List', columns, DeptList, ['name', 'dept_Id'])}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="modal fade" id="addDeptModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fs-5" id="staticBackdropLabel">Add New Department</h5>
                            <button type="button" className="btn-link btn" data-bs-dismiss="modal" aria-label="Close">
                                <i className='fa fa-xmark'></i>
                            </button>
                        </div>
                        <form onSubmit={(e) => addDept(e)}>
                            <div className="modal-body">
                                <div className="form-group mb-3 position-relative">
                                    <label >Department ID</label>
                                    <input className="form-control" placeholder="####" readOnly value={deptID} />
                                    <div className="spinner-border spinner-border-sm position-absolute text-secondary" id="loaderDiv" style={{ right: '10px', top: '62%', display: 'none' }} role="status"></div>
                                </div>

                                <div className="form-group mb-3">
                                    <label >Department Name</label>
                                    <input type="text" className="form-control" placeholder='Department Name' value={deptName} onChange={(e) => changeDept(e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="editDeptModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fs-5" id="staticBackdropLabel">Edit Department</h5>
                            <button type="button" className="btn-link btn" data-bs-dismiss="modal" aria-label="Close">
                                <i className='fa fa-xmark'></i>
                            </button>
                        </div>
                        <form onSubmit={(e) => editDept(e)}>
                            <div className="modal-body">
                                <div className="form-group mb-3 position-relative">
                                    <label >Department ID</label>
                                    <input className="form-control" placeholder="####" readOnly value={editID} />
                                    <div className="spinner-border spinner-border-sm position-absolute text-secondary" id="loaderDiv" style={{ right: '10px', top: '62%', display: 'none' }} role="status"></div>
                                </div>

                                <div className="form-group mb-3">
                                    <label >Department Name</label>
                                    <input type="text" className="form-control" placeholder='Department Name' defaultValue={editName} onChange={(e) => setNewName(e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Departments
