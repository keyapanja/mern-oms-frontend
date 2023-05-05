import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Chip from '@mui/material/Chip';
import { reloadWindow, SwalComp, ToastComp } from '../Commons/ToastComp';
import { formatDate } from '../Commons/FormatTime';
import CommonTable from '../Commons/CommonTable';

function Designations() {

    useEffect(() => {
        if (document.getElementById('desg-nav')) {
            document.getElementById('desg-nav').classList.add('active');
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

    const [Desgs, setDesgs] = useState('');

    //create chip for every designation
    const [DesgsArr, setDesgsArr] = useState([]);

    useEffect(() => {
        var arr = Desgs.split(",");
        if (arr.length === 0) {
            arr = Desgs
        }
        const newArr = [];
        for (let index = 0; index <= arr.length - 1; index++) {
            const element = arr[index];
            if (!newArr.includes(element.trim()) && (element !== '' && element !== ' ')) {
                newArr.push(element.trim());
            }
        }
        setDesgsArr(newArr);
    }, [Desgs])

    //Delete chip or designation from array
    const handleDelete = (index) => {
        const newArr = DesgsArr;
        newArr.splice(index, 1);
        setDesgsArr(newArr);
        setDesgs(DesgsArr.join(', ') + ', ');
    }

    //Save the designations
    const saveDesgs = (e) => {
        e.preventDefault();
        const dept = document.getElementById('dept').value;
        if (!dept || dept === '') {
            ToastComp('error', 'Please select a Department!');
        } else if (DesgsArr.length === 0) {
            ToastComp('error', 'Please enter at least one Designation!')
        } else {
            const formData = {
                dept_Id: dept,
                desgArr: DesgsArr
            }
            axios.post(process.env.REACT_APP_BACKEND + 'desgs/add', formData)
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

    //Fetch designations from database
    const [desgList, setDesgList] = useState([]);
    useEffect(() => {
        const getDesgs = async () => {
            const desgs = await axios.get(process.env.REACT_APP_BACKEND + "desgs/");
            const data = desgs.data;
            setDesgList(data);
        }

        getDesgs();
    }, [])

    //Open Edit modal with data
    const openEditModal = (data) => {
        const editDept = document.getElementById('editDept');
        editDept.value = data.dept[0].dept_Id;

        const editDesg = document.getElementById('editDesg');
        editDesg.value = data.name;

        document.getElementById('editID').value = data._id;
    }

    //Delete Designatios
    const deleteDesg = (data) => {
        SwalComp('warning', `Are you sure you want to delete the desgination <br> <em>"${data.name}"</em> ? <br> <span class="text-sm">You won't be able to revert this and all the related data may get affected!</span>`, 'Yes, Delete!', 'No, Cancel!')
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(process.env.REACT_APP_BACKEND + 'desgs/delete/' + data._id)
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

    //columns for datatable
    const columns = [
        {
            name: '#',
            cell: (row) => '#',
            width: '5%'
        },
        {
            name: 'Designation',
            selector: (row) => row.name,
            sortable: true
        },
        {
            name: 'Department',
            selector: (row) => row.dept[0].name,
            sortable: true
        },
        {
            name: 'Created At',
            selector: (row) => formatDate(row.createdAt),
            sortable: true
        },
        {
            name: 'Action',
            selector: (row) => {
                return <>
                    <button className='btn btn-sm btn-primary mr-1' data-bs-toggle="modal" data-bs-target="#editDesgModal" onClick={() => openEditModal(row)}><i className='fa fa-edit'></i></button>
                    <button className='btn btn-sm btn-danger' onClick={() => deleteDesg(row)}><i className='fa fa-trash'></i></button>
                </>
            }
        }
    ]

    //update designation
    const updateDesg = (e) => {
        e.preventDefault();

        const editDept = document.getElementById('editDept');
        const editDesg = document.getElementById('editDesg');
        const ediID = document.getElementById('editID').value;

        if (editDept.value === '') {
            ToastComp('error', 'Please select a Department!');
        } else if (editDesg.value === '') {
            ToastComp('error', 'Please enter a Designation');
        } else {
            const formData = {
                'name': editDesg.value,
                'dept_Id': editDept.value
            }

            axios.post(process.env.REACT_APP_BACKEND + 'desgs/edit/' + ediID, formData)
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

    return (
        <>
            <div className='row'>
                <div className='col-md-12 col-sm-12'>
                    <div className='card'>
                        <div className='card-header d-flex align-items-center justify-content-between'>
                            <h4 className='card-title w-50'>Designations</h4>
                            <div className='card-tools w-50'>
                                <button className='btn btn-primary btn-sm float-right' data-bs-toggle="modal" data-bs-target="#addDesgModal">
                                    <i className='fa fa-plus'></i> Add New Designation
                                </button>
                            </div>
                        </div>
                        <div className='card-body'>
                            <div className='table-responsive'>
                                {CommonTable('Designations List', columns, desgList, ['name'])}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="addDesgModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fs-5" id="staticBackdropLabel">Add Designation</h5>
                            <button type="button" className="btn-link btn" data-bs-dismiss="modal" aria-label="Close">
                                <i className='fa fa-xmark'></i>
                            </button>
                        </div>
                        <form onSubmit={(e) => saveDesgs(e)}>
                            <div className="modal-body">
                                <div className="form-group mb-3">
                                    <label>Select a Department</label>
                                    <select className="form-select form-control" id="dept">
                                        <option selected disabled value=''>--Select a Department--</option>
                                        {
                                            DeptList.length > 0 &&
                                            DeptList.map((item) => {
                                                return <option key={item._id} value={item.dept_Id}>{item.name} ({item.dept_Id})</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className='form-group mb-3'>
                                    <label className='mb-0'>Enter designations</label> <span>(Insert comma after each)</span>
                                    <span className='text-sm d-block mb-2'>[Duplicate values won't be counted.]</span>
                                    <textarea rows={3} className='form-control' style={{ resize: 'none' }} onChange={(e) => setDesgs(e.target.value)} value={Desgs}>
                                    </textarea>
                                </div>

                                <div className='w-100'>
                                    {
                                        DesgsArr.length > 0 &&
                                        DesgsArr.map((item) => {
                                            return <Chip key={DesgsArr.indexOf(item)} label={item} onDelete={() => handleDelete(DesgsArr.indexOf(item))} color="info" className='m-1' />
                                        })
                                    }
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


            <div className="modal fade" id="editDesgModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fs-5" id="staticBackdropLabel">Edit Designation</h5>
                            <button type="button" className="btn-link btn" data-bs-dismiss="modal" aria-label="Close">
                                <i className='fa fa-xmark'></i>
                            </button>
                        </div>
                        <form onSubmit={(e) => updateDesg(e)}>
                            <div className="modal-body">
                                <div className="form-group mb-3">
                                    <input id='editID' type='hidden'></input>
                                    <label>Department</label>
                                    <select className="form-select form-control" id="editDept">
                                        <option disabled value=''>--Select a Department--</option>
                                        {
                                            DeptList.length > 0 &&
                                            DeptList.map((item) => {
                                                return <option key={item._id} value={item.dept_Id}>{item.name} ({item.dept_Id})</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className='form-group mb-3'>
                                    <label>Designation Name</label>
                                    <input type="text" className='form-control' id='editDesg'></input>
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

export default Designations
