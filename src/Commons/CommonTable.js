import React, { useState } from 'react'
import DataTable, { createTheme } from 'react-data-table-component';

function loader() {
    return <div style={{ height: '30vh', width: '100%' }} className="d-flex justify-content-center align-items-center">
        <div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status"></div>
    </div>
}

createTheme('darkTheme', {
    text: {
        primary: 'whitesmoke',
        secondary: '#ccc',
    },
    background: {
        default: 'transparent',
    },
    context: {
        background: '#cb4b16',
        text: '#FFFFFF',
    },
    divider: {
        default: '#474f58',
    },
    action: {
        button: 'rgba(0,0,0,.54)',
        hover: 'rgba(0,0,0,.1)',
        disabled: 'rgba(0,0,0,.12)',
    },
}, 'dark');

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
            padding: '15px 7px',
            fontSize: '14px',
        },
    },
};

function CommonTable(title, columns, data, searchItems) {

    const currentTheme = window.localStorage.getItem('currentOMSTheme');

    const [pending, setPending] = useState(true);

    if (data) {
        window.setTimeout(() => {
            setPending(false);
        }, 1200)
    }

    const [searchTxt, setSearchTxt] = useState('');
    const searchBox = <div>
        <input className='form-control' placeholder='Search...' value={searchTxt} onChange={(e) => filterData(e.target.value)}></input>
    </div>;

    //Filter 
    const [filteredData, setFilteredData] = useState([]);
    const filterData = (search) => {
        setSearchTxt(search);
        setFilteredData(data);
        if (search !== '') {
            const result = data.filter(data => {
                return (searchItems[0] && data[searchItems[0]].toLowerCase().match(searchTxt.toLowerCase()))
                    || (searchItems[1] && data[searchItems[1]].toLowerCase().match(searchTxt.toLowerCase()))
                    || (searchItems[2] && data[searchItems[2]].toLowerCase().match(searchTxt.toLowerCase()));
            })

            setFilteredData(result);
        }
    }

    return (
        <>
            <DataTable
                title={title}
                columns={columns}
                data={searchTxt ? filteredData : data}
                progressPending={pending}
                progressComponent={loader()}
                pagination
                theme={currentTheme === 'dark' ? 'darkTheme' : ''}
                highlightOnHover
                persistTableHead
                customStyles={customStyles}
                subHeader
                subHeaderComponent={searchBox}
            />
        </>
    )
}

export default CommonTable
