import { Skeleton } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import GoBack from '../../Commons/GoBack';
import { ToastComp } from '../../Commons/ToastComp';


function EditProject() {

    useEffect(() => {
        if (document.getElementById('project-parent-nav')) {
            document.getElementById('project-parent-nav').classList.add('active');
        }
    })

    //get project id from url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const projectID = urlParams.get('project_id');

    //Get Project data
    const [projectData, setProjectData] = useState('');
    useEffect(() => {
        const fetchProject = async () => {
            const projectData = await axios.get(process.env.REACT_APP_BACKEND + 'projects/get-project/' + projectID);
            const data = projectData.data;
            setProjectData(data);

            if (data) {
                setName(data.name);
                setDesc(data.desc);
                setClient(data.client);
                setBudget(data.budget);
                setCur(data.currency);
            }

            if (!data) {
                const noDataDiv = document.getElementById('noDataDiv');
                if (noDataDiv) {
                    window.setTimeout(() => {
                        noDataDiv.style.display = 'flex';
                    }, 1500)
                }
            }
        }

        fetchProject();
    }, [projectID])

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

    const [saveStatus, setSaveStatus] = useState(false);

    //Input variables
    const [name, setName] = useState('');
    const [Desc, setDesc] = useState('');
    const [budget, setBudget] = useState('');
    const [cur, setCur] = useState('');
    const [client, setClient] = useState([]);

    //Save the project data
    const updateProject = (e) => {
        e.preventDefault();
        setSaveStatus(true);

        if (name && Desc && projectID && client) {
            const formData = {
                name: name,
                projectID: projectID,
                desc: Desc,
                budget: budget,
                currency: cur,
                client: client,
            }

            axios.post(process.env.REACT_APP_BACKEND + 'projects/edit/' + projectID, formData)
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
                    setSaveStatus(false);
                    ToastComp('error', err.message)
                })
        } else {
            setSaveStatus(false);
            ToastComp('error', 'Please fill in all the fields!');
        }
    }


    return (
        <>
            <div>
                <div className='d-flex justify-content-between my-2'>
                    <h4 className='m-0'>Edit Project</h4>
                    <GoBack />
                </div>
                <div>
                    {
                        projectData ?
                            <form autoComplete='off' onSubmit={updateProject}>
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
                                                    <span>Project Description <span className='text-orange text-bold'>*</span></span>
                                                    <textarea className='form-control mt-2 form-transparent' rows={8} placeholder='Enter some details of the project...' value={Desc} onChange={(e) => setDesc(e.target.value)}></textarea>
                                                </div>
                                            </div>
                                            <div className='col-md-6 col-sm-12 px-3 pt-4'>
                                                <div className='form-group mt-2'>
                                                    <span className='mr-3'>Project ID <span className='text-orange text-bold'>*</span> </span>
                                                    #<input className='form-control form-transparent w-25' placeholder='XXXX' value={projectID} readOnly></input>
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
                            : <div>
                                <div className='row mt-4 d-flex justify-content-center'>
                                    <Skeleton variant='rounded' width={500} height={50} />
                                </div>
                                <div className='row mt-4 pt-3'>
                                    <div className='col-md-6 col-sm-12'>
                                        <Skeleton variant='rounded' height={300} />
                                    </div>
                                    <div className='col-md-6 col-sm-12'>
                                        <Skeleton variant='rounded' height={48} width='60%' />
                                        <Skeleton variant='rounded' height={48} width='70%' className='mt-3' />
                                        <Skeleton variant='rounded' height={48} className='mt-3' />
                                        <Skeleton variant='rounded' height={48} width='70%' className='mt-3' />
                                        <Skeleton variant='rounded' height={52} width='70%' className='mt-3' />
                                        <Skeleton variant='rounded' height={48} width='25%' className='mt-3' />
                                    </div>
                                </div>
                            </div>
                    }
                </div>

                <div style={{ position: 'fixed', display: 'none', justifyContent: 'center', alignItems: 'center', top: 0, left: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.2)', padding: '15px' }} id="noDataDiv">
                    <div className='text-center'>
                        <img src="/images/404.svg" width='25%' alt="Not Found!"></img>
                        <h2>No Data Found!</h2>
                        <p>The staff you're looking for doesn't exist. <br></br> Try searching some other staff..!</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditProject
