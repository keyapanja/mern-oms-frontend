import axios from "axios";
import { useEffect, useState } from "react";

function GetUserPermissions(username) {
    //Fetch logged user data
    const [getUser, setUser] = useState('');
    useEffect(() => {
        const getUser = async () => {
            const userdata = await axios.get(process.env.REACT_APP_BACKEND + 'users/logged-user-data/' + username);
            const data = userdata.data[0];
            setUser(data);
        }

        getUser();
    }, [username])

    if (getUser) {
        return getUser;
    }
}

export default GetUserPermissions
