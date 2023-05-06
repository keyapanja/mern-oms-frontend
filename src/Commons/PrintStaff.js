import { formatCurrency } from "./FormatTime";

export function PrintStaff(data) {
    // console.log(data);
    var a = window.open('', '', 'width=600');
    a.document.open();
    a.document.write(`<!DOCTYPE html>
    <html>
    
    <head>
        <title>${data.fullname} - ${data.staffID}</title>
    </head>
    
    <body style="padding: 15px;">
        <div style="width: 100%; display: flex; justify-content: center; align-items: center; margin: 20px auto">
            <div style="text-align: center;">
                <h1 style="margin: 10px 0;">${data.fullname}</h1>
                <h3 style="margin: 10px 0">${data.designation}</h3>
            </div>
        </div>
        <div style="padding: 15px;">
            <h2>Personal Information</h2>
            <table style="width: 100%; text-align: left; font-size: 1.05rem;">
                <tr>
                    <th style="width: 33%;">Father's Name</th>
                    <th style="width: 33%">Date of Birth</th>
                    <th style="width: 33%;">Highest Qualification</th>
                </tr>
                <tr>
                    <td style="padding: 5px;">${data.father}</td>
                    <td style="padding: 5px;">${data.dob}</td>
                    <td style="padding: 5px;">${data.qualification}</td>
                </tr>
            </table>
            <table style="width: 100%; text-align: left; font-size: 1.05rem; margin-top: 10px;">
                <tr>
                    <th style="width: 33%;">Address</th>
                </tr>
                <tr>
                    <td style="padding: 5px;">${data.address}</td>
                </tr>
            </table>
        </div>
        <div style="padding: 0 15px">
            <h2>Contact Information</h2>
            <table style="width: 100%; text-align: left; font-size: 1.05rem;">
                <tr>
                    <th style="width: 33%;">Mobile Number</th>
                    <th style="width: 33%">Personal Email</th>
                    <th style="width: 33%;">Company Email</th>
                </tr>
                <tr>
                    <td style="padding: 5px;">${data.mobile}</td>
                    <td style="padding: 5px;">${data.email}</td>
                    <td style="padding: 5px;">${data.CompanyMail}</td>
                </tr>
            </table>
        </div>
        <div style="padding: 10px 15px;">
            <h2>Employment Information</h2>
            <table style="width: 100%; text-align: left; font-size: 1.05rem;">
                <tr>
                    <th style="width: 33%;">Department</th>
                    <th style="width: 33%">Joining Date</th>
                    <th style="width: 33%;">Salary</th>
                </tr>
                <tr>
                    <td style="padding: 5px;">${data.Dept[0].name}</td>
                    <td style="padding: 5px;">${data.joiningDate}</td>
                    <td style="padding: 5px;">${formatCurrency(data.salary, data.currency)}</td>
                </tr>
            </table>
            <table style="width: 100%; text-align: left; font-size: 1.05rem; margin-top: 10px;">
                <tr>
                    <th style="width: 33%;">Experience</th>
                    <th style="width: 67%;">Skills</th>
                </tr>
                <tr>
                    <td style="padding: 5px;">${data.ExpLevel + ' (' + data.ExpYears + ' years)'}</td>
                    <td style="padding: 5px;">${data.skills}</td>
                </tr>
            </table>
        </div>
    </body>
    
    </html>`);
    a.document.close();
    a.print();
    
    return a;
}

