import React, { useEffect, useState } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import { ToastComp } from '../../Commons/ToastComp';
import { formatDate } from '../../Commons/FormatTime';
import GoBack from '../../Commons/GoBack';

function AddStaff() {

    //Style the date pickers according to selected theme
    const currentTheme = window.localStorage.getItem('currentOMSTheme');

    if (currentTheme === 'dark') {
        const calendarIcon = document.getElementsByClassName('css-i4bv87-MuiSvgIcon-root');
        if (calendarIcon && calendarIcon.length > 0) {
            for (let index = 0; index < calendarIcon.length; index++) {
                const element = calendarIcon[index];
                element.style.color = 'whitesmoke';

            }
        }

        const dateInput = document.getElementsByClassName('css-nxo287-MuiInputBase-input-MuiOutlinedInput-input');
        if (dateInput && dateInput.length > 0) {
            for (let index = 0; index < dateInput.length; index++) {
                const element = dateInput[index];
                element.style.color = 'whitesmoke';
            }
        }

        const border = document.getElementsByClassName('css-1d3z3hw-MuiOutlinedInput-notchedOutline');
        if (border && border.length > 0) {
            for (let index = 0; index < border.length; index++) {
                const element = border[index];
                element.style.borderColor = '#6c757d';
            }
        }
    }

    useEffect(() => {
        if (document.getElementById('add-staff-nav')) {
            document.getElementById('add-staff-nav').classList.add('active');
        }
        if (document.getElementById('staff-parent-nav')) {
            document.getElementById('staff-parent-nav').classList.add('active');
        }
        if (document.getElementById('staff-menu')) {
            document.getElementById('staff-menu').classList.add('menu-open');
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

    //fetch currecies from database
    const [CurrencyList, setCurrencyList] = useState([]);
    useEffect(() => {
        const fetchCurr = async () => {
            const currency = await axios.get(process.env.REACT_APP_BACKEND + 'settings/get-currencies');
            const data = currency.data;
            setCurrencyList(data);
        }

        fetchCurr();
    }, [])

    //Change the designations according to the selected department
    const [newDesgs, setNewDesgs] = useState([]);
    const showDesgs = (newdept) => {
        setDepts(newdept);
        const designations = desgList;
        const newArr = [];
        for (let index = 0; index < designations.length; index++) {
            const element = designations[index];
            if (element.dept[0].dept_Id === newdept) {
                newArr.push(element);
            }
        }
        setNewDesgs(newArr);
    }

    const [isloading, setIsLoading] = useState(false);

    //Input values
    const [dob, setdob] = useState('');
    const [name, setName] = useState('');
    const [fname, setFname] = useState('');
    const [gender, setGender] = useState('');
    const [hq, setHq] = useState('');
    const [course, setCourse] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [skills, setSkills] = useState('');
    const [exp, setExp] = useState('Fresher');
    const [totalYears, setTotalYears] = useState(0);
    const [depts, setDepts] = useState('');
    const [Desg, setDesg] = useState('');
    const [joining, setJoining] = useState(new Date());
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('');
    const [salarytype, setsalarytype] = useState('');

    //Random employee ID
    const [staffID, setStaffID] = useState('');
    const changeID = (val) => {
        setName(val);
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
            setStaffID(newID.toUpperCase() + '-' + Math.floor(Math.random() * 1000));
        } else {
            setStaffID('');
            if (document.getElementById('loaderDiv')) {
                document.getElementById('loaderDiv').style.display = 'none';
            }
        }
    }


    //Submit the form after validation
    const saveStaff = (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (name && fname && gender && dob && hq && phone && email && depts && Desg && joining && amount && currency && salarytype && exp) {
            const formData = {
                'staffID': staffID,
                'fullname': name,
                'father': fname,
                'gender': gender,
                'dob': formatDate(dob),
                'qualification': hq,
                'course': course,
                'address': address,
                'mobile': phone,
                'email': email,
                'department': depts,
                'designation': Desg,
                'joiningDate': formatDate(joining),
                'salary': amount,
                'currency': currency,
                'salaryType': salarytype,
                'skills': skills,
                'ExpLevel': exp,
                'ExpYears': totalYears
            }

            axios.post(process.env.REACT_APP_BACKEND + 'staff/add', formData)
                .then((res) => {
                    setIsLoading(false);
                    ToastComp(res.data.status, res.data.msg);
                    if (res.data.status === 'success') {
                        window.setTimeout(() => {
                            window.location.href = '/admin/employees';
                        }, 2100)
                    }
                })
                .catch((err) => {
                    setIsLoading(false);
                    ToastComp('error', err.message);
                })
        } else {
            setIsLoading(false);
            ToastComp('warning', 'Please fill in all the required fields!')
        }
    }

    return (
        <>
            <div className='d-flex justify-content-between'>
                <h4>Add New Employee</h4>
                <GoBack />
            </div>
            <form className='mt-4' onSubmit={saveStaff}>
                <div className='card'>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-12 d-flex justify-content-end align-items-center'>
                                <div className="spinner-border spinner-border-sm text-secondary mr-3" id="loaderDiv" style={{ display: 'none' }} role="status"></div>
                                <em>Staff ID: #{staffID || '----'}</em>
                            </div>
                            <h5 className='col-12 my-4'>General Information</h5>
                            <div className='col-md-6 col-sm-12'>
                                <div className='form-group mb-3'>
                                    <label>Full Name <span className='text-orange'>*</span></label>
                                    <input required className='form-control' placeholder="Employee's Full Name" value={name} onChange={(e) => changeID(e.target.value)}></input>
                                </div>
                            </div>
                            <div className='col-md-6 col-sm-12'>
                                <div className='form-group mb-3'>
                                    <label>Father's Name <span className='text-orange'>*</span></label>
                                    <input required className='form-control' placeholder="Employee's Father's Name" value={fname} onChange={(e) => setFname(e.target.value)}></input>
                                </div>
                            </div>
                            <div className='col-md-6 col-sm-12'>
                                <div className='form-group mb-3'>
                                    <label>Gender <span className='text-orange'>*</span></label>
                                    <select className='form-select form-control' id="gender" value={gender} onChange={(e) => setGender(e.target.value)} required>
                                        <option selected disabled value=''>--Select a Gender--</option>
                                        <option value='Male'>Male</option>
                                        <option value='Female'>Female</option>
                                    </select>
                                </div>
                            </div>
                            <div className='col-md-6 col-sm-12'>
                                <div className='form-group mb-3'>
                                    <label>Date of Birth <span className='text-orange'>*</span></label>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateField']}>
                                            <DatePicker
                                                // label="Select DOB"
                                                format="DD/MM/YYYY"
                                                fullWidth
                                                required
                                                size='small'
                                                sx={{ width: '100%' }}
                                                disableFuture
                                                value={dob}
                                                onChange={(newval) => setdob(newval)}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </div>
                            </div>
                            <div className='col-md-6 col-sm-12'>
                                <div className='form-group mb-3'>
                                    <label>Highest Qualification <span className='text-orange'>*</span></label>
                                    <select className='form-control form-select' value={hq} onChange={(e) => setHq(e.target.value)}>
                                        <option value='' disabled>--Select One--</option>
                                        <option value='10th'>10th</option>
                                        <option value='12th'>12th</option>
                                        <option value='Graduation/Diploma'>Graduation/Diploma</option>
                                        <option value="Post Graduation">Post Graduation</option>
                                        <option value="Doctorate">Doctorate</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                            </div>
                            {
                                hq &&
                                <div className='col-md-6 col-sm-12'>
                                    <div className='form-group mb-3'>
                                        <label>Course / Stream</label>
                                        <input className='form-control' placeholder='Course / Stream' value={course} onChange={(e) => setCourse(e.target.value)} ></input>
                                    </div>
                                </div>
                            }
                            <div className='col-12'>
                                <div className='form-group mb-3'>
                                    <label>Address</label>
                                    <textarea className='form-control' placeholder="Employee's Address" style={{ resize: 'none' }} value={address} onChange={(e) => setAddress(e.target.value)}></textarea>
                                </div>
                            </div>

                            <h5 className='col-12 my-4'>Contact Details</h5>
                            <div className='col-md-6 col-sm-12'>
                                <div className='form-group mb-3'>
                                    <label>Mobile Number <span className='text-orange'>*</span></label>
                                    <input required className='form-control' placeholder="Employee's Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode='numeric'></input>
                                </div>
                            </div>
                            <div className='col-md-6 col-sm-12'>
                                <div className='form-group mb-3'>
                                    <label>Email Address <span className='text-orange'>*</span></label>
                                    <input required type='email' className='form-control' placeholder="Employee's Personal Email Address" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                                    <div className='text-sm text-muted'><i className='fa fa-info-circle'></i> An Email will be sent to this email address with a link to create new staff account.</div>
                                </div>
                            </div>

                            <h5 className='col-12 my-4'>Employment Details</h5>
                            <div className='col-md-6 col-sm-12'>
                                <label>Experience Level <span className='text-orange'>*</span></label>
                                <select className='form-control form-select mb-2' value={exp} onChange={(e) => setExp(e.target.value)} required>
                                    <option value='Fresher'>Fresher</option>
                                    <option value='Experienced'>Experienced</option>
                                </select>
                                {
                                    exp === 'Experienced' &&
                                    <>
                                        <span className='mb-0'>Total Years of Experience</span>
                                        <input className='form-control mt-0' type="number" min={0} value={totalYears} onChange={(e) => setTotalYears(e.target.value)}></input>
                                    </>
                                }
                            </div>
                            <div className='col-md-6 col-sm-12'>
                                <div className='form-group mb-3'>
                                    <label>Skills</label>
                                    <textarea rows={4} style={{ resize: 'none' }} className='form-control' placeholder="Employee's Skills" value={skills} onChange={(e) => setSkills(e.target.value)} inputMode='numeric'></textarea>
                                </div>
                            </div>
                            <div className='col-md-6 col-sm-12'>
                                <div className="form-group mb-3">
                                    <label>Department <span className='text-orange'>*</span></label>
                                    <select className="form-select form-control" value={depts} onChange={(e) => showDesgs(e.target.value)} required>
                                        <option selected disabled value=''>--Select a Department--</option>
                                        {
                                            DeptList.length > 0 &&
                                            DeptList.map((item) => {
                                                return <option key={item._id} value={item.dept_Id}>{item.name} ({item.dept_Id})</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className='col-md-6 col-sm-12'>
                                <div className="form-group mb-3">
                                    <label>Designation <span className='text-orange'>*</span></label>
                                    <select className="form-select form-control" value={Desg} onChange={(e) => setDesg(e.target.value)} required>
                                        <option selected disabled value=''>--Select a Designation--</option>
                                        {
                                            newDesgs.length > 0 ?
                                                newDesgs.map((item) => {
                                                    return <option key={item._id} value={item.name}>{item.name}</option>
                                                })
                                                : desgList.map((item) => {
                                                    return <option key={item._id} value={item.name}>{item.name}</option>
                                                })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className='col-md-6 col-sm-12'>
                                <div className='form-group mb-3'>
                                    <label>Joining Date <span className='text-orange'>*</span></label>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateField']}>
                                            <DatePicker
                                                // label="Select Joining Date"
                                                format="DD/MM/YYYY"
                                                fullWidth
                                                required
                                                size='small'
                                                sx={{ width: '100%' }}
                                                val={dayjs(joining)}
                                                onChange={(newval) => setJoining(newval)}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </div>
                            </div>
                            <div className='col-md-6 col-sm-12'>
                                <div className='form-group mb-3'>
                                    <label>Salary <span className='text-orange'>*</span></label>
                                    <div className='row'>
                                        <div className='col-md-7 col-sm-6'>
                                            <input required className='form-control' placeholder="Salary Amount" value={amount} onChange={(e) => setAmount(e.target.value)}></input>
                                        </div>
                                        <div className='col-md-2 col-sm-2'>
                                            <select className='form-control form-select' value={currency} onChange={(e) => setCurrency(e.target.value)} required>
                                                <option selected disabled value=''>Currency</option>
                                                {
                                                    CurrencyList.length > 0 &&
                                                    CurrencyList.map((item) => {
                                                        return <option key={item._id} value={item.currency}>{item.currency}</option>
                                                    })
                                                }
                                            </select>
                                            {
                                                CurrencyList.length === 0 && <a href="/admin/settings/currency" className='text-sm' target='_blank'>+ Add Currency</a>
                                            }
                                        </div>
                                        <div className='col-md-3 col-sm-4'>
                                            <select className='form-control form-select' value={salarytype} onChange={(e) => setsalarytype(e.target.value)} required>
                                                <option selected disabled value=''>Salary Type</option>
                                                <option value='Per Month'>Per Month</option>
                                                <option value='Per Week'>Per Week</option>
                                                <option value='Per Day'>Per Day</option>
                                                <option value='Per Hour'>Per Hour</option>
                                                <option value='Per Project'>Per Project</option>
                                            </select>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row' style={{ padding: '10px 25%', margin: '10px 0 30px' }}>
                        <button className='btn btn-block btn-primary' disabled={isloading}>
                            Save
                            {
                                isloading ?
                                    <div class="spinner-border spinner-border-sm text-light ml-2" role="status"></div>
                                    :
                                    <i className='fa fa-floppy-disk ml-1'></i>
                            }
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default AddStaff
