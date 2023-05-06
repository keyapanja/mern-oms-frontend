import axios from 'axios';
import React, { useEffect, useState } from 'react'

import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import { reloadWindow, ToastComp } from '../../Commons/ToastComp';
import { formatCurrency } from '../../Commons/FormatTime';
import GoBack from '../../Commons/GoBack';
import { PrintStaff } from '../../Commons/PrintStaff';

function ViewStaff() {

    useEffect(() => {
        if (document.getElementById('staff-parent-nav')) {
            document.getElementById('staff-parent-nav').classList.add('active');
        }
    })

    //get staff id from url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const getStaffID = urlParams.get('staff_id')

    //Fetching staff data from database
    const [staffData, setStaffData] = useState(null);
    useEffect(() => {
        const getStaff = async () => {
            const staff = await axios.get(process.env.REACT_APP_BACKEND + 'staff/get-staff/' + getStaffID);
            const data = staff.data[0];
            setStaffData(data);

            if (!data) {
                const noDataDiv = document.getElementById('noDataDiv');
                if (noDataDiv) {
                    window.setTimeout(() => {
                        noDataDiv.style.display = 'flex';
                    }, 1500)
                }
            }
        }

        getStaff();
    }, [getStaffID])

    //Setting the avatar source
    var icon = '';
    if (staffData) {
        if (staffData.pfp === 'maleIcon1.png') {
            icon = '/images/maleIcon1.png';
        } else if (staffData.pfp === 'femaleIcon1.png') {
            icon = '/images/femaleIcon1.png';
        } else if (staffData.pfp && staffData.pfp !== '') {
            icon = process.env.REACT_APP_UPLOADS + 'staff/' + staffData.pfp;
        }
    }

    //Print the data 
    // const printData = () => {
    //     var card1 = document.getElementById("staffCard1").innerHTML;
    //     var card2 = document.getElementById("staffCard2").innerHTML;
    //     var a = window.open('', '', 'width=600');
    //     a.document.open();
    //     a.document.write(`<html><head><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"
    //     integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous"> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
    //     integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
    //     crossorigin="anonymous" referrerpolicy="no-referrer" /></head>`);
    //     a.document.write(`<body onload="window.print();window.close(); class="p-3"><div>${card1}</div> <hr> <div>${card2}</div></div></body>`);
    //     a.document.write('</html>');
    //     a.document.close();
    //     a.print();
    // }

    //save company email
    const [compMail, setcompMail] = useState('');
    const saveCompMail = (e) => {
        e.preventDefault();
        if (!compMail) {
            ToastComp('error', 'Please enter an email address!')
        } else {
            axios.post(process.env.REACT_APP_BACKEND + 'staff/add-company-mail/' + getStaffID, { 'CompanyMail': compMail })
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

    //Fetch staff login data
    const [loginData, setLoginData] = useState('');
    const [seeLogin, setSeeLogin] = useState(false);
    useEffect(() => {
        const getStaff = async () => {
            const staff = await axios.get(process.env.REACT_APP_BACKEND + 'users/get-user-by-staffID/' + getStaffID);
            const data = staff.data;
            setLoginData(data);
        }

        getStaff();
    }, [getStaffID])

    const handleLoginView = () => {
        if (seeLogin) {
            setSeeLogin(false);
        } else {
            setSeeLogin(true);
        }
    }

    return (
        <>
            <div className='mb-3 mt-2 d-flex justify-content-start w-100'>
                <GoBack />
            </div>
            <div className='row position-relative mt-3' id="mainStaffDiv">
                <div className='col-md-4 col-sm-12 my-1'>
                    <div className='card'>
                        <div className='card-body' id="staffCard1">
                            {
                                staffData ?
                                    <>
                                        <div className='d-flex justify-content-center my-3 d-print-none'>
                                            <Avatar sx={{ width: '100px', height: '100px' }} src={icon} alt={staffData.fullname}></Avatar>
                                        </div>
                                        <div className='text-center mb-4'>
                                            <h2>{staffData.fullname}</h2>
                                            <span>{staffData.designation}</span><br></br>
                                        </div>
                                    </>
                                    : <>
                                        <div className='d-flex justify-content-center mt-3 mb-2'>
                                            <Skeleton variant='circular' width={120} height={120}></Skeleton>
                                        </div>
                                        <div className='text-center mb-2'>
                                            <h1 className='m-0'><Skeleton /></h1>
                                            <span className='m-0'><Skeleton /></span>
                                            <span className='m-0'><Skeleton /></span>
                                        </div>
                                    </>
                            }
                        </div>
                    </div>
                    <div className='card'>
                        <div className='card-body text-center'>
                            <button className='btn btn-link text-bold d-block w-100 text-center' onClick={handleLoginView}>
                                {!seeLogin ? <i className='fa fa-eye mr-1'></i> : <i className='fa fa-eye-slash mr-1'></i>}
                                Login Details
                            </button>
                            {
                                seeLogin && loginData &&
                                <>
                                    <b>Username: </b><span>{loginData.username}</span>
                                    <br />
                                    <b>Password: </b><span>{atob(loginData.password)}</span>
                                </>
                            }
                        </div>
                    </div>
                </div>

                <div className='col-md-8 col-sm-12 my-1'>
                    <div className='card'>
                        <div className='card-header'>

                            {
                                !staffData ? <Skeleton variant='text' width={150} height={35} />
                                    : <h5 className='my-1 card-title'>Staff ID: #{getStaffID}</h5>
                            }

                            {
                                staffData && <div className='card-tools pr-2'>
                                    <button className='btn btn-info btn-sm mx-1' onClick={() => PrintStaff(staffData)}>
                                        <i className='fa fa-print mr-1'></i> Print
                                    </button>
                                    <a href={'/admin/edit-employee?staff_id=' + getStaffID} className='btn btn-primary btn-sm mx-1'>
                                        <i className='fa fa-edit mr-1'></i> Edit
                                    </a>
                                </div>
                            }
                        </div>
                        <div className='card-body' id="staffCard2">
                            {
                                staffData ?
                                    <>
                                        <h5 className='m-1'>Personal Information</h5>
                                        <div className='row mt-4 px-2'>
                                            <div className='col-md-4 col-sm-12 my-1'>
                                                <label className='d-block mb-1'><i className='fa fa-cake-candles mr-1'></i> Date of Birth</label>
                                                <span className='ml-4'>{staffData.dob}</span>
                                            </div>
                                            <div className='col-md-4 col-sm-12 my-1'>
                                                <label className='d-block mb-1'><i className='fa fa-graduation-cap mr-1'></i> Highest Qualification</label>
                                                <span className='ml-4 pl-1'>{staffData.qualification}</span>
                                                <br />
                                                <div className='pl-4 ml-1 text-sm'>{staffData.course && staffData.course}</div>
                                            </div>
                                            <div className='col-md-4 col-sm-12 my-1'>
                                                <label className='d-block mb-1'><i className=' fa fa-location-dot mr-1'></i> Address</label>
                                                <span className='ml-4'>{staffData.address}</span>
                                            </div>
                                        </div>

                                        <hr />

                                        <h5 className='m-1'>Contact Information</h5>
                                        <div className='row mt-4 px-2'>
                                            <div className='col-md-4 col-sm-12 my-1'>
                                                <label className='d-block mb-1'><i className=' fa fa-phone mr-1'></i> Mobile Number</label>
                                                <span className='ml-4'>{staffData.mobile}</span>
                                            </div>
                                            <div className='col-md-4 col-sm-12 my-1'>
                                                <label className='d-block mb-1'><i className=' fa fa-envelope mr-1'></i> Personal Email</label>
                                                <span className='ml-4'>{staffData.email}</span>
                                            </div>
                                            <div className='col-md-4 col-sm-12 my-1'>
                                                <label className='d-block mb-1'><i className=' fa fa-envelope mr-1'></i> Company Email</label>
                                                {
                                                    staffData.CompanyMail && staffData.CompanyMail !== '' ?
                                                        <span className='ml-4'>{staffData.CompanyMail}</span>
                                                        : <button className='btn btn-link py-0 d-print-none' data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i className='fa fa-plus'></i> Add Company Email</button>
                                                }
                                            </div>
                                        </div>

                                        <hr />

                                        <h5 className='m-1'>Employement Information</h5>
                                        <div className='row mt-4 px-2'>
                                            <div className='col-md-4 col-sm-12 my-1'>
                                                <label className='d-block mb-1'><i className=' fa fa-building mr-1'></i> Department</label>
                                                <span className='ml-4'>{staffData.Dept[0].name}</span>
                                            </div>
                                            <div className='col-md-4 col-sm-12 my-1'>
                                                <label className='d-block mb-1'><i className=' fa fa-calendar-day mr-1'></i> Joining Date</label>
                                                <span className='ml-4'>{staffData.joiningDate}</span>
                                            </div>
                                            <div className='col-md-4 col-sm-12 my-1'>
                                                <label className='d-block mb-1'><i className=' fa fa-wallet mr-1'></i> Salary</label>
                                                <span className='ml-4'>
                                                    {formatCurrency(staffData.salary, staffData.currency)}
                                                </span>
                                                <span>&nbsp; {staffData.salaryType}</span>
                                            </div>
                                        </div>
                                        <div className='row px-2'>
                                            <div className='col-md-4 col-sm-12 my-1'>
                                                <label className='d-block mb-1'><i className=' fa-brands fa-angellist mr-1'></i> Experience</label>
                                                <span className='ml-4'>{staffData.ExpLevel} {staffData.ExpLevel === 'Experienced' && ' (' + staffData.ExpYears + ' years)'}</span>
                                            </div>
                                            <div className='col-md-8 col-sm-12 my-1'>
                                                <label className='d-block mb-1'><i className=' fa fa-list-check mr-1'></i> Skills</label>
                                                <span className='ml-4'>{staffData.skills}</span>
                                            </div>
                                        </div>
                                    </>
                                    : <>
                                        <Skeleton width={250} variant='text' sx={{ fontSize: '2rem' }} />
                                        <div className='row px-2'>
                                            <Skeleton variant="text" width={'100%'} sx={{ fontSize: '4rem' }} />
                                        </div>

                                        <Skeleton variant='text' sx={{ fontSize: '0.1rem' }}></Skeleton>

                                        <Skeleton width={250} variant='text' sx={{ fontSize: '2rem' }} />
                                        <div className='row px-2'>
                                            <Skeleton variant="text" width={'100%'} sx={{ fontSize: '4rem' }} />
                                        </div>

                                        <Skeleton variant='text' sx={{ fontSize: '0.1rem' }}></Skeleton>

                                        <Skeleton width={250} variant='text' sx={{ fontSize: '2rem' }} />
                                        <div className='row px-2'>
                                            <Skeleton variant="text" width={'100%'} sx={{ fontSize: '4rem' }} />
                                        </div>
                                    </>
                            }
                        </div>
                    </div>
                </div>


                <div style={{ position: 'fixed', display: 'none', justifyContent: 'center', alignItems: 'center', top: 0, left: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.2)', padding: '15px' }} id="noDataDiv">
                    <div className='text-center'>
                        <img src="/images/404.svg" width='25%' alt="Not Found!"></img>
                        <h2>No Data Found!</h2>
                        <p>The staff you're looking for doesn't exist. <br></br> Try searching some other staff..!</p>
                    </div>
                </div>
            </div>


            <div className="modal fade" id="staticBackdrop" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fs-5" id="staticBackdropLabel">Add Company Email</h5>
                        </div>
                        <form onSubmit={saveCompMail}>
                            <div className="modal-body">
                                <p>Enter {(staffData && staffData.fullname) || 'staff'} 's Email address that is associated with the company.</p>
                                <span className='text-sm'>This email would be used to send official mails from the system.</span>
                                <input className='form-control mt-3' type="email" placeholder='Enter Email Address' value={compMail} onChange={(e) => setcompMail(e.target.value)}></input>
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

export default ViewStaff
