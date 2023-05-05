import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { reloadWindow, ToastComp } from '../../Commons/ToastComp';

function Currency() {

    useEffect(() => {
        if (document.getElementById('currency-nav')) {
            document.getElementById('currency-nav').classList.add('active');
        }
        if (document.getElementById('settings-nav')) {
            document.getElementById('settings-nav').classList.add('active');
        }
        if (document.getElementById('settings-menu')) {
            document.getElementById('settings-menu').classList.add('menu-open');
        }
    })

    //Code variable
    const [code, setCode] = useState('');

    const changeCode = (val) => {
        setCode(val.toUpperCase());
    }

    const saveCurrency = (e) => {
        e.preventDefault();
        if (!code) {
            ToastComp('error', 'Please enter currecy code!')
        } else {
            axios.post(process.env.REACT_APP_BACKEND + 'settings/add-currency', { 'currency': code })
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

    //fetch currecies from database
    const [getCurr, setCurr] = useState([]);
    useEffect(() => {
        const fetchCurr = async () => {
            const currency = await axios.get(process.env.REACT_APP_BACKEND + 'settings/get-currencies');
            const data = currency.data;
            setCurr(data);
        }

        fetchCurr();
    }, [])

    //Open edit modal with data
    const [editId, setEditId] = useState('');
    const [editCode, setEditCode] = useState('');
    const openEditModal = (data) => {
        setEditCode(data.currency);
        setEditId(data._id);
    }

    //Delete currency
    const deleteCurrency = (data) => {
        Swal.fire({
            icon: 'warning',
            html: `Are you sure you want to delete the currency <em>${data.currency}</em> ?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete!',
            reverseButtons: true
        })
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(process.env.REACT_APP_BACKEND + 'settings/delete-currency/' + data._id)
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

    //columns for data table
    const columns = [
        {
            name: '#',
            cell: (row) => '#',
            width: '10%'
        },
        {
            name: 'Currency Code',
            selector: (row) => row.currency,
            sortable: true
        },
        {
            name: 'Action',
            selector: (row) => {
                return <>
                    <button className='btn btn-primary btn-sm' data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => openEditModal(row)}><i className='fa fa-edit'></i></button>
                    <button className='btn btn-danger btn-sm mx-1' onClick={() => deleteCurrency(row)}><i className='fa fa-trash'></i></button>
                </>
            }
        }
    ]

    const customStyles = {
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                fontSize: '16px',
                borderBottom: '1px solid',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
                fontSize: '14px',
            },
        },
    };

    const updateCurrency = (e) => {
        e.preventDefault();
        if (!editCode) {
            ToastComp('error', 'Currency code cannot be empty!');
        } else {
            axios.post(process.env.REACT_APP_BACKEND + 'settings/edit-currency/' + editId, { currency: editCode })
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
            <h4>Currency</h4>

            <div className='row mt-3'>
                <div className='col-md-5 col-sm-12'>
                    <div className='card'>
                        <div className='card-header'>
                            Add Currency
                        </div>
                        <div className='card-body'>
                            <form onSubmit={saveCurrency}>
                                <span>Enter Currency Code</span>
                                <input type="text" className='form-control mt-2' placeholder='Currency Code e.g. USD' maxLength={3} value={code} onChange={(e) => changeCode(e.target.value)}></input>

                                <div className='my-3'>
                                    <button className='btn btn-primary' type='submit'>Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className='col-md-7 col-sm-12'>
                    <div className='card'>
                        <div className='card-body'>
                            <div className='table-responsive'>
                                <DataTable
                                    title='Currencies List'
                                    columns={columns}
                                    data={getCurr}
                                    persistTableHead
                                    customStyles={customStyles}
                                    pagination
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="modal fade" id="editModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fs-5" id="staticBackdropLabel">Edit Currency</h5>
                            <button type="button" className="btn btn-link" data-bs-dismiss="modal" aria-label="Close">
                                <i className='fa fa-xmark'></i>
                            </button>
                        </div>
                        <div className="modal-body py-4">
                            <input type="hidden" value={editId}></input>
                            <label>Currency Code</label>
                            <input className='form-control' value={editCode} onChange={(e) => setEditCode(e.target.value.toUpperCase())} maxLength={3}></input>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={updateCurrency}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Currency
