import React, { useEffect, useState } from 'react'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { reloadWindow, ToastComp } from '../../Commons/ToastComp';
import axios from 'axios';

function CompanyData() {

    useEffect(() => {
        if (document.getElementById('company-data-nav')) {
            document.getElementById('company-data-nav').classList.add('active');
        }
        if (document.getElementById('settings-nav')) {
            document.getElementById('settings-nav').classList.add('active');
        }
        if (document.getElementById('settings-menu')) {
            document.getElementById('settings-menu').classList.add('menu-open');
        }
    })

    //get Company data
    const [company, setCompany] = useState([]);
    useEffect(() => {
        const getCompany = async () => {
            const comp = await axios.get(process.env.REACT_APP_BACKEND + 'company/');
            const data = comp.data;
            setCompany(data);

            if (data) {
                setCompName(data.company_name);
                setCompMail(data.company_mail);
                setAddress(data.address);
                setUrl(data.company_url);
            }
        }

        getCompany()
    }, [])

    //Loading indicator
    const [isLoading, setIsLoading] = useState(false);
    const [isFileLoading, setFileLoading] = useState(false);

    //Input variables
    const [compName, setCompName] = useState('');
    const [compMail, setCompMail] = useState('');
    const [address, setAddress] = useState('');
    const [url, setUrl] = useState('');

    //company data form
    const compForm = (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (!compName || !address || !compMail || !url) {
            ToastComp('error', 'Please fill in all the company details!');
            setIsLoading(false);
        } else {
            const formData = {
                company_name: compName,
                company_mail: compMail,
                address: address,
                company_url: url
            }

            axios.post(process.env.REACT_APP_BACKEND + (!company ? 'company/add' : 'company/update'), formData)
                .then((res) => {
                    setIsLoading(false);
                    ToastComp(res.data.status, res.data.msg);
                    if (res.data.status === 'success') {
                        reloadWindow();
                    }
                })
                .catch((err) => {
                    setIsLoading(false);
                    ToastComp('error', err.message);
                })
        }
    }

    //File variables
    const [selectedFile, setSelectedFile] = useState('');

    //Logo upload form
    const uploadLogo = (e) => {
        e.preventDefault();
        setFileLoading(true);
        if (!selectedFile) {
            ToastComp('error', 'Please upload a logo!');
        } else {
            const formdata = {
                "logo": selectedFile
            }
            axios.post(process.env.REACT_APP_BACKEND + 'company/upload-logo', formdata, {
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
            <h4>Company Data</h4>
            <div className='row mt-4'>
                <div className='col-md-6 col-sm-12'>
                    <div className='card'>
                        <div className='card-header'>
                            <h5 className='card-title'>Company's Information</h5>
                        </div>
                        <div className='card-body p-3'>
                            <form autoComplete='off' onSubmit={compForm}>
                                <div className='form-group mb-3'>
                                    <span>Company Name</span>
                                    <input type="text" className="form-control mt-2" placeholder="Company Name" value={compName} onChange={(e) => setCompName(e.target.value)} />
                                </div>
                                <div className='form-group mb-3'>
                                    <span>Email Address</span>
                                    <input type="email" className="form-control mt-2" placeholder="Company's Email Address" value={compMail} onChange={(e) => setCompMail(e.target.value)} />
                                </div>
                                <div className='form-group mb-3'>
                                    <span>Website</span>
                                    <input type="text" className="form-control mt-2" placeholder="Company's Website" value={url} onChange={(e) => setUrl(e.target.value)} />
                                </div>
                                <div className='form-group mb-3'>
                                    <span>Address</span>
                                    <textarea className="form-control mt-2" placeholder="Company Address" style={{ resize: 'none' }} value={address} onChange={(e) => setAddress(e.target.value)} ></textarea>
                                </div>
                                <div className='my-3'>
                                    <button className='btn btn-primary d-flex align-items-center justify-content-center' type='submit'>
                                        {
                                            isLoading ?
                                                <div className="spinner-border spinner-border-sm mr-3" role="status"></div>
                                                : <SaveRoundedIcon className='mr-1'></SaveRoundedIcon>
                                        }
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className='col-md-6 col-sm-12'>
                    <div className='card'>
                        <div className='card-header'>
                            <h5 className='card-title'>Company Logo</h5>
                        </div>
                        <div className='card-body'>
                            <p className='text-muted'>
                                Instructions:
                            </p>
                            <ul className='text-muted'>
                                <li>Only images files are allowed!</li>
                                <li>A logo is square size would look better.</li>
                            </ul>

                            <form className='mt-4 mb-3 text-center pt-4' onSubmit={uploadLogo} encType="multipart/form-data">
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

export default CompanyData
