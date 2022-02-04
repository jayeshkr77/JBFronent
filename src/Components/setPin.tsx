import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import customError from '../Interfaces/customError';

function SetPin() {
    const [pin, setPin] = useState<string>('')
    const [loader, setLoader] = useState<boolean>(false);
    const [pinError, setPinError] = useState<customError | undefined | null>();
    const [redirect, setRedirect] = useState<boolean>(false);

    const pinValidation = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target && event.target.value.length < 5) {
            setPin(event.target.value);
        }
    }
    const setupPin = (event: FormEvent) => {
        event.preventDefault();
        setLoader(true);
        if (pin.length !== 4) {
            setPinError({ status: 'success', message: 'Pin should be of 4 digit' });
            setLoader(false);
        } else {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", localStorage.getItem('token') as string);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "pin": pin,
            });

            var requestOptions: RequestInit = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("http://localhost:4000/api/user/setpin", requestOptions)
                .then(response => response.text())
                .then(result => {
                    // console.log(result);
                    setRedirect(true);
                    setLoader(false);
                })
                .catch(error => console.log('error', error));
            
        }
    }
    return (
        <div className="container">
            {redirect ? <Navigate to="/user" /> : ''}
            <form className='login-form' onSubmit={setupPin}>
                <div className="title"> Setup your pin to login.</div>
                {pinError ? <div className='failure-toast'>{pinError.message}</div> : ''}
                {/* {registered ? <div className='success-toast'> A verification email has been sent to <b>{email.current!.value}</b>.</div> : ''} */}
                <div className='field'>
                    <div className='label'>PIN</div>
                    <input type='number' value={pin} onChange={pinValidation} placeholder='4 digit pin' required />
                </div>
                <div className='field'>
                    <input type="submit" className='login-btn' value={loader ? 'Setting up your pin...' : 'Set'} disabled={loader} />
                </div>

            </form>
        </div>
    );
}

export default SetPin;