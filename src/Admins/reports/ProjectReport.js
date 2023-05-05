import React, { useEffect, useState } from 'react'
import GoBack from '../../Commons/GoBack';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Projects Chart by Month (' + new Date().getFullYear() + ')',
            class: 'text-info'
        },
    },
};

function ProjectReport() {

    //Fetch project counts per month
    const [result, setResult] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND + 'reports/projects')
            .then((res) => {
                setResult(res.data)
            })
    })

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'No. of Projects',
                data: result,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ]
    }

    useEffect(() => {
        if (document.getElementById('project-report-nav')) {
            document.getElementById('project-report-nav').classList.add('active');
        }
        if (document.getElementById('report-parent-nav')) {
            document.getElementById('report-parent-nav').classList.add('active');
        }
        if (document.getElementById('report-menu')) {
            document.getElementById('report-menu').classList.add('menu-open');
        }
    })

    return (
        <>
            <div className='row mt-1'>
                <div className='col-12'>
                    <div className='card'>
                        <div className='card-header'>
                            <div className='card-title'>Projects Report</div>
                            <div className='card-tools'>{<GoBack />}</div>
                        </div>

                        <div className='card-body p-4'>
                            <div className='px-4'>
                                {
                                    <Line options={options} data={data} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProjectReport
