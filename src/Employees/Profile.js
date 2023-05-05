import { Avatar, Skeleton } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { formatCurrency } from '../Commons/FormatTime';
import { reloadWindow, ToastComp } from '../Commons/ToastComp';
import { PrintStaff } from '../Commons/PrintStaff';

function Profile() {

    useEffect(() => {
        if (document.getElementById('profile-nav')) {
            document.getElementById('profile-nav').classList.add('active');
        }
    })

    //get current user
    const currentUser = JSON.parse(window.sessionStorage.getItem('loggedInUser'));

    //Fetch logged user data
    const [staffData, setStaffData] = useState(null);
    const [getStaffID, setStaffID] = useState('');
    useEffect(() => {
        const getUser = async () => {
            const userdata = await axios.get(process.env.REACT_APP_BACKEND + 'users/logged-user-data/' + currentUser.user);
            const data = userdata.data[0];
            setStaffData(data);
            setStaffID(data.staffID);

            if (!data) {
                const noDataDiv = document.getElementById('noDataDiv');
                if (noDataDiv) {
                    window.setTimeout(() => {
                        noDataDiv.style.display = 'flex';
                    }, 1500)
                }
            }
        }

        getUser();
    }, [currentUser.user])

    //Setting the avatar source
    var icon = '';
    if (staffData) {
        if (staffData.pfp && staffData.pfp !== '') {
            icon = process.env.REACT_APP_UPLOADS + 'staff/' + staffData.pfp;
        }
        else {
            if (staffData.gender === 'Male') {
                icon = '/images/maleIcon1.png';
            } else if (staffData.gender === 'Female') {
                icon = '/images/femaleIcon1.png';
            }
        }
    }

    //Print the data 
    // const printData = () => {
    //     var card1 = document.getElementById("staffCard1").innerHTML;
    //     var card2 = document.getElementById("staffCard2").innerHTML;
    //     var a = window.open('', '', 'height=800, width=800');
    //     a.document.write(`<html><head><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"
    //     integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous"> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
    //     integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
    //     crossorigin="anonymous" referrerpolicy="no-referrer" /></head>`);
    //     a.document.write(`<body><div>${card1}</div> <hr> <div>${card2}</div></div></body>`);
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
        }
    }

    //Change profile picture
    const [selectedFile, setSelectedFile] = useState('');
    const [isFileLoading, setFileLoading] = useState(false);

    const changePFP = (e) => {
        e.preventDefault();
        setFileLoading(true);
        if (!selectedFile) {
            ToastComp('error', 'Please upload a logo!');
        } else {
            const formdata = {
                "pfp": selectedFile
            }
            axios.post(process.env.REACT_APP_BACKEND + 'staff/change-pfp/' + getStaffID, formdata, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
                .then((res) => {
                    setFileLoading(false)
                    ToastComp(res.data.status, res.data.msg);
                    if (res.data.status === 'success') {
                        reloadWindow();
                    }
                })
                .catch((err) => console.log(err.message))
        }
    }

    return (
        <>
            <div className='row position-relative' id="mainStaffDiv">
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
                                            <button className='btn btn-link text-info btn-sm' data-bs-toggle="modal" data-bs-target="#pfpModal">
                                                <i className='fa fa-edit'></i> Change Profile Picture
                                            </button>
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


            <div class="modal fade" id="pfpModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5 m-0" id="staticBackdropLabel">Upload Profile Picture</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p className='text-muted'>
                                Instructions:
                            </p>
                            <ul className='text-muted'>
                                <li>Only images files are allowed!</li>
                                <li>A logo is square size would look better.</li>
                            </ul>

                            <form className='mt-4 mb-3 text-center pt-4' onSubmit={changePFP} encType="multipart/form-data">
                                <div className='d-flex align-items-center justify-content-center' style={{ padding: '0 20%' }}>
                                    <input type='file' accept='image/*' style={{ display: 'none' }} id='fileInput' onChange={(e) => setSelectedFile(e.target.files[0])}></input>
                                    <button className='btn btn-primary btn-block py-2 rounded-pill' onClick={() => document.getElementById('fileInput').click()} type="button">
                                        <i className='fa fa-cloud-arrow-up'></i> Upload File
                                    </button>
                                </div>
                                {
                                    selectedFile &&
                                    <>
                                        <div className='my-3 d-flex justify-content-center'>
                                            <div className='card mt-2 position-relative p-2' style={{ width: '25%' }}>
                                                <img src={URL.createObjectURL(selectedFile)} alt={selectedFile.name} style={{ width: '100%' }}></img>
                                                <span className='my-2 text-sm'>{selectedFile.name}</span>

                                                <button onClick={() => setSelectedFile('')} className='btn btn-outline-secondary btn-sm text-center rounded-circle' style={{ width: '30px', height: '30px', position: 'absolute', top: '5px', right: '5px' }}><i className='fa fa-xmark'></i></button>
                                            </div>
                                        </div>
                                        <div className='text-center mt-3'>
                                            <button className='btn btn-secondary px-4' type='submit'>
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
            </div>
        </>
    )
}

export default Profile
