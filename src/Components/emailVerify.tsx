import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function EmailVerify() {
    const [redirect, setRedirect] = useState<boolean>(false);
    useEffect(() => {
        var requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`http://localhost:4000/api/user/verify/${window.location.href.split('/')[4]}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                localStorage.setItem('token',window.location.href.split('/')[4]);
                setRedirect(true);
            })
            .catch(error => console.log('error', error));
    }, []);
    return (
        <div className="container">
            {redirect ? <Navigate to="/set/pin" /> : ''}
        </div>
    );
}

export default EmailVerify;