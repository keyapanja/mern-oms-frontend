import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ToastComp } from '../../Commons/ToastComp';
import GoBack from '../../Commons/GoBack';
import Select from 'react-select';

function AddProject() {

    useEffect(() => {
        if (document.getElementById('add-project-nav')) {
            document.getElementById('add-project-nav').classList.add('active');
        }
        if (document.getElementById('project-parent-nav')) {
            document.getElementById('project-parent-nav').classList.add('active');
        }
        if (document.getElementById('project-menu')) {
            document.getElementById('project-menu').classList.add('menu-open');
        }
    })

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

    //fetching staffs from database
    const [secStaffList, secsetStaffList] = useState([]);
    useEffect(() => {
        const getStaff = async () => {
            const staffData = await axios.get(process.env.REACT_APP_BACKEND + 'staff');
            const data = staffData.data;

            let arr = [];
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                const obj = {
                    value: {
                        staffID: element.staffID,
                        name: element.fullname,
                        pfp: element.pfp,
                        designation: element.designation
                    },
                    label: element.fullname
                }
                arr.push(obj);
            }
            secsetStaffList(arr);

        }

        getStaff();
    }, [])

    var StaffList = [];
    if (secStaffList.length > 0) {
        StaffList = secStaffList
    }

    const [saveStatus, setSaveStatus] = useState(false);

    //Project ID
    const [projectID, setProjectID] = useState('');
    const [idLoader, setIdLoader] = useState(false);
    const [idMsg, setIdMsg] = useState('');
    const checkProjectID = (id) => {
        if (id && id !== '') {
            setProjectID(id.toUpperCase());
            setIdLoader(true);

            axios.post(process.env.REACT_APP_BACKEND + 'projects/check-projectID/' + id)
                .then((res) => {
                    setIdMsg(res.data)
                    window.setTimeout(() => {
                        setIdLoader(false)
                    }, 1000)
                })
                .catch((err) => {
                    ToastComp('error', err.message);
                })
        } else {
            setProjectID('');
            setIdLoader(false);
            setIdMsg('');
        }
    }

    //Input variables
    const [name, setName] = useState('');
    const [Desc, setDesc] = useState('');
    const [budget, setBudget] = useState('');
    const [cur, setCur] = useState('');
    const [teamStaff, setTeamStaff] = useState([]);
    const [client, setClient] = useState([]);

    //Save the project data
    const saveProject = (e) => {
        e.preventDefault();
        setSaveStatus(true);

        if (name && client && Desc && projectID && teamStaff) {
            const formData = {
                name: name,
                projectID: projectID,
                desc: Desc,
                budget: budget,
                currency: cur,
                client: client,
                team: teamStaff.map((item) => item.value)
            }

            axios.post(process.env.REACT_APP_BACKEND + 'projects/add', formData)
                .then((res) => {
                    setSaveStatus(false);
                    ToastComp(res.data.status, res.data.msg);
                    if (res.data.status === 'success') {
                        window.setTimeout(() => {
                            window.location.href = '/admin/projects';
                        }, 2100)
                    }
                })
                .catch((err) => {
                    ToastComp('error', err.message)
                })
        } else {
            setSaveStatus(false);
            ToastComp('error', 'Please fill in all the fields!');
        }
    }

    return (
        <>
            <div className='d-flex justify-content-between my-2'>
                <h4 className='m-0'>Add New Project</h4>
                <GoBack />
            </div>
            <div>
                <form autoComplete='off' onSubmit={saveProject}>
                    <div className='row'>
                        <div className='col-12 text-center'>
                            <label className='float-label w-50'>
                                <input type="text" id="name" placeholder="Project Name" className='float-input form-control' value={name} onChange={(e) => setName(e.target.value)} style={{ textAlign: 'center' }} />
                                <span className='float-span' style={{ textAlign: 'center' }}>Project Name <span className='text-orange text-bold'>*</span></span>
                            </label>
                        </div>
                        <div className='col-12 mt-2'>
                            <div className='row'>
                                <div className='col-md-6 col-sm-12 px-3'>
                                    <div className='form-group'>
                                        <label>Project Description <span className='text-orange text-bold'>*</span></label>
                                        <textarea className="form-control" value={Desc} onChange={(e) => setDesc(e.target.value)} >
                                        </textarea>
                                    </div>
                                </div>
                                <div className='col-md-6 col-sm-12 px-3 pt-4'>
                                    <div className='form-group mt-2'>
                                        <span className='mr-3'>Project ID <span className='text-orange text-bold'>*</span> </span>
                                        #<input className='form-control form-transparent w-25' placeholder='XXXX' value={projectID} onChange={(e) => checkProjectID(e.target.value.toUpperCase())}></input>
                                        <div className='d-inline'>
                                            {
                                                idLoader && <div className="spinner-border spinner-border-sm ml-2 mr-2" role="status"></div>
                                            }
                                            {
                                                idMsg && idMsg !== '' &&
                                                <span className={`text-${idMsg.status} text-sm`}>{idMsg.msg}</span>
                                            }
                                        </div>
                                    </div>
                                    <div className='form-group'>
                                        <span>Client / Company <span className='text-orange text-bold'>*</span> </span>
                                        <input className='form-control form-transparent w-50' value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client / Company Name"></input>
                                    </div>
                                    <div className='row'>
                                        <div className='form-group px-2'>
                                            <span>Estimated Budget</span>
                                            <input className='form-control form-transparent' type='number' placeholder='00,000' value={budget} onChange={(e) => setBudget(e.target.value)}></input>

                                            <select id="currency" className='form-control d-inline-block bg-light border-0' style={{ width: 'auto', WebkitAppearance: 'menulist' }} value={cur} onChange={(e) => setCur(e.target.value)}>
                                                <option value="">Currency</option>
                                                {
                                                    CurrencyList.length > 0 ?
                                                        CurrencyList.map((item) => {
                                                            return <option key={item._id}>{item.currency}</option>
                                                        })
                                                        : <option>Currency</option>
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className='form-group mt-2'>
                                        <Select
                                            isMulti
                                            closeMenuOnSelect={false}
                                            hideSelectedOptions={true}
                                            name="team"
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            options={StaffList}
                                            onChange={(e) => setTeamStaff(e)}
                                            placeholder='Select from Staff...'
                                        />
                                    </div>

                                    <div className='mt-4'>
                                        <button className='btn btn-primary float-left px-4' type="submit" disabled={saveStatus} >
                                            Save Project
                                            {saveStatus ?
                                                <div className="spinner-border spinner-border-sm ml-2" role="status"></div>
                                                :
                                                <i className='fa fa-file-circle-plus ml-2'></i>
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default AddProject
