import React, { FormEvent, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import customError from '../Interfaces/customError';

function Login() {
  const email = useRef<HTMLInputElement>(null);
  const firstDigit = useRef<HTMLInputElement>(null);
  const secondDigit = useRef<HTMLInputElement>(null);
  const thirdDigit = useRef<HTMLInputElement>(null);
  const fourthDigit = useRef<HTMLInputElement>(null);
  const submitButton = useRef<HTMLInputElement>(null);

  const [loader, setLoader] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<customError | undefined | null>();
  const [redirect, setRedirect] = useState<boolean>(false);

  const registerUser = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    let emailInput = localStorage.getItem('email') ? localStorage.getItem('email') : email.current!.value
    if (emailInput) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
        "email": emailInput,
        "pin": firstDigit.current!.value + secondDigit.current!.value + thirdDigit.current!.value + fourthDigit.current!.value
      });

      var requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      console.log(raw)
      fetch("http://localhost:4000/api/user/login", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          setLoader(false);
          if (result.status === 'failed') {
            setLoginError(result);
          } else {
            setLoginError(null);
            if (result.status === 'success') {
              localStorage.setItem('token',result.token);
              setRedirect(true);
            }
          }
        })
        .catch(error => console.log('error', error));
    } else {
      //email is mandatory
    }
  }
  return (
    <form className='login-form' onSubmit={registerUser}>
      {redirect ? <Navigate to="/user" /> : ''}
      <div className="title">Register</div>
      {loginError ? <div className='failure-toast'>{loginError.message}</div> : ''}
      <div className='field'>
        <div className='label'>Email</div>
        {/* {localStorage.setItem('email','jayeshkumar044@gmail.com')} */}
        {localStorage.getItem('email') ? localStorage.getItem('email') : <input type='email' ref={email} required />}
      </div>
      <div className='field'>
        <div className='label'>PIN</div>
        <div className="pin">
          <input type='number' ref={firstDigit} onChange={e => { if (e.target.value.length && secondDigit.current) { secondDigit.current!.disabled = false; secondDigit.current!.focus(); } }} onFocus={e => { e.target.value = '' }} autoFocus={true}/>
          <input type='number' ref={secondDigit} onKeyDown={(e: any) => { if (e.key === 'Backspace') { firstDigit.current?.focus(); }; }} onChange={e => { if (e.target.value.length) { thirdDigit.current!.disabled = false; thirdDigit.current?.focus(); } }} onFocus={e => { e.target.value = '' }} disabled />
          <input type='number' ref={thirdDigit} onKeyDown={(e: any) => { if (e.key === 'Backspace') { secondDigit.current?.focus(); }; }} onChange={e => { if (e.target.value.length) { fourthDigit.current!.disabled = false; fourthDigit.current?.focus(); } }} onFocus={e => { e.target.value = '' }} disabled />
          <input type='number' ref={fourthDigit} onKeyDown={(e: any) => { if (e.key === 'Backspace') { thirdDigit.current?.focus(); e.target.value = '' }; }} onChange={e => { if (e.target.value.length) { submitButton.current?.focus(); } }} onFocus={e => { e.target.value = '' }} disabled />
        </div>
      </div>
      {/* <div className='field'>
        <div className='label'>Password</div>
        <input type='password' required />
      </div> */}
      <div className='field'>
        <input type="submit" ref={submitButton} className='login-btn' value={loader ? 'logging...' : 'Log in'} disabled={loader} />
      </div>

    </form>
  );
}

export default Login;