import { FormEvent, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import customError from '../Interfaces/customError';

function SetPin() {
    const firstDigit = useRef<HTMLInputElement>(null);
    const secondDigit = useRef<HTMLInputElement>(null);
    const thirdDigit = useRef<HTMLInputElement>(null);
    const fourthDigit = useRef<HTMLInputElement>(null);
    const submitButton = useRef<HTMLInputElement>(null);

    const [loader, setLoader] = useState<boolean>(false);
    const [pinError, setPinError] = useState<customError | undefined | null>();
    const [redirect, setRedirect] = useState<boolean>(false);

    const setupPin = (event: FormEvent) => {
        event.preventDefault();
        setLoader(true);
        if (!(firstDigit.current!.value && secondDigit.current!.value && thirdDigit.current!.value && fourthDigit.current!.value)) {
            setPinError({ status: 'failed', message: 'Pin should be of 4 digit' });
            setLoader(false);
        } else {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", localStorage.getItem('token') as string);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "pin": firstDigit.current!.value+secondDigit.current!.value+thirdDigit.current!.value+fourthDigit.current!.value,
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
                    setRedirect(true);
                    setLoader(false);
                })
                .catch(error => {setPinError({ status: 'failed', message: 'Look like there is some network issue' }); console.log('error', error);});
            
        }
    }
    return (
        <div className="container">
            {redirect ? <Navigate to="/user" /> : ''}
            <form className='login-form' onSubmit={setupPin}>
                <div className="title"> Setup your pin to login.</div>
                {pinError ? <div className='failure-toast'>{pinError.message}</div> : ''}
                <div className='field'>
                    <div className='label'>PIN</div>
                    <div className="pin">
                        <input type='number' ref={firstDigit} onChange={e => { if(e.target.value.length && secondDigit.current) {secondDigit.current!.disabled = false; secondDigit.current!.focus();}}} onFocus={e=>{e.target.value =''}} autoFocus/>
                        <input type='number' ref={secondDigit} onKeyDown={(e:any) => {if(e.key === 'Backspace'){ firstDigit.current?.focus();};}}  onChange={e => { if(e.target.value.length) {thirdDigit.current!.disabled = false; thirdDigit.current?.focus();}}} onFocus={e=>{e.target.value =''}}  disabled/>
                        <input type='number' ref={thirdDigit} onKeyDown={(e:any) => {if(e.key === 'Backspace'){ secondDigit.current?.focus();};}}  onChange={e => { if(e.target.value.length) {fourthDigit.current!.disabled = false; fourthDigit.current?.focus();}}} onFocus={e=>{e.target.value =''}} disabled/>
                        <input type='number' ref={fourthDigit} onKeyDown={(e:any) => {if(e.key === 'Backspace'){ thirdDigit.current?.focus(); e.target.value = ''};}}  onChange={e => { if(e.target.value.length) {submitButton.current?.focus();}}} onFocus={e=>{e.target.value =''}} disabled/>
                    </div>
                </div>
                <div className='field'>
                    <input type="submit" className='login-btn' ref={submitButton} value={loader ? 'Setting up your pin...' : 'Set'} disabled={loader} />
                </div>

            </form>
        </div>
    );
}

export default SetPin;