import { FormEvent, useRef, useState } from 'react';
import customError from '../Interfaces/customError';

function Register() {
  const email = useRef<HTMLInputElement>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<customError | undefined | null>();
  const [registered, setRegistered] = useState<boolean>(false);

  const registerUser = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    if (email.current) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
        "to": email.current.value,
        "subject": "Verify your email."
      });

      var requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
        fetch("http://localhost:4000/api/user/register", requestOptions)
          .then(response => response.json())
          .then(result => {
            setLoader(false);
            if(result.status === 'failed'){
              setRegisterError(result);
            }else{
              setRegisterError(null);
              let status = result.response.split(' ')[2];
              if(status === 'OK'){
                setRegistered(true);
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
      <div className="title">Register</div>
      { registerError ? <div className='failure-toast'>{registerError.message}</div> : ''}
      {registered? <div className='success-toast'> A verification email has been sent to <b>{email.current!.value}</b>.</div>:''}
      <div className='field'>
        <div className='label'>Email</div>
        <input type='email' ref={email} required />
      </div>
      {/* <div className='field'>
        <div className='label'>Password</div>
        <input type='password' required />
      </div> */}
      <div className='field'>
        <input type="submit" className='login-btn' value={loader? 'Registering...': 'Register'} disabled = {loader}/>
      </div>
      
    </form>
  );
}

export default Register;