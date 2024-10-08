import React, { useEffect, useState } from 'react'
import './Login.css'
import login from '../../assets/login11.png'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from "jwt-decode";


import person from '../../assets/loginPerson.png'
import lock from '../../assets/lock.png'
import { gapi } from 'gapi-script';

function loginPage() {

  const { register, handleSubmit, formState: { errors } } = useForm()

  const navigate = useNavigate()

  const [googleUserData,setGoogleUserData] = useState({})

  const onSubmit = (values) => {
    try {
      const res = axios.post('https://studio-backend-alpha.vercel.app/login', values)
        .then((res) => {
          if (res.status == 200) {
            localStorage.setItem("userID",res.data._id)
            localStorage.setItem("user",true)
            navigate('/recs')
          }
          else {
            alert("Invalid Credentials")
          }
        })

    }
    catch (err) {
      alert("Invalid Credentials")
    }
  }

  const [done, setDone] = useState(false)

  async function createUserSignup() {
    const response = await axios.post(`https://studio-backend-alpha.vercel.app/googleAuthSignup/${username}`, googleUserData)
      .then(response => {
        localStorage.setItem("userID", response.data._id)
        localStorage.setItem("user", true)
        navigate('/recs')
      })
      .catch(err => console.log(err))
  }

  async function handleUsername() {
    setDone(true)
    const test = await axios.post('https://studio-backend-alpha.vercel.app/userExists', { "username": username })
      .then(test => {
        if (test.status == 200) {
          createUserSignup()
        }
        else {
          setDone(false)
          alert("Username Not Available")
        }
      })
      .catch(err => console.log(err))
  }

  const [showUsername, setShowUsername] = useState(true)

  const clientID = "934760259390-idpvnt9md5ov9pr4lnoufcb0obh56eue.apps.googleusercontent.com"

  async function createUser(data) {
    setGoogleUserData(data)
    setShowUsername(false)
  }

  async function loginUser(data) {
    const response = await axios.post('https://studio-backend-alpha.vercel.app/googleAuthLogin', data)
      .then(response => {
        if (response.status === 201) {
          localStorage.setItem("userID", response.data._id)
          localStorage.setItem("user", true)
        }
        navigate('/recs')
      })
      .catch(err => console.log(err))
  }

  async function onSuccess(res) {
    const decoded = jwtDecode(res.credential)
    const data = await axios.post('https://studio-backend-alpha.vercel.app/googleAuthID', decoded)
      .then(data => {
        if (data.status === 200) {
          createUser(decoded)
        }
        else if (data.status === 201) {
          loginUser(decoded)
        }
      })
      .catch(err => console.log(err))
  }

  function onFailure(res) {
    console.log("Login Failed, Res -> ", res)
  }

  const getData = async (token) => {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token.clientId}`
      }
    })
    .then(response => {

    })
    .catch(err => console.log(err))
    // return await response.json();
  }

  // useEffect(() => {
  //   function start() {
  //     gapi.client.init({
  //       clientId: clientID,
  //       scope: "email"
  //     }).then(() => {
  //       console.log('Google API client initialized')
  //     }, (error) => {
  //       console.error('Error initializing Google API client:', error)
  //     })
  //   }

  //   gapi.load('client:auth2', start)
  // }, [])

  const [username, setUsername] = useState('')

  const handleChange = (event) => {
    setUsername(event.target.value)
  }

  useEffect(() => {
    document.title = `Login - Studio`
  }, [])

  return (
    <div className='areaCenterLogin mons'>
      <img src={login} alt="" className='loginPageImg' />

      {showUsername && <form className="loginRectangle" onSubmit={handleSubmit(onSubmit)}>
        <h2>LOGIN</h2>

        <div className="inputLoginArea">
          <label htmlFor="username">
            Username
          </label>
          <input type="text" name='username' placeholder='Enter your Username'
            {...register("username", { required: 'Username is Required' })} />
          <img src={person} className='userPlaceholder' />
          {errors.username && <p className='red'>{errors.username.message}</p>}
          {!errors.username && <p className='transperent'>x</p>}
        </div>

        <div className="inputLoginArea">
          <label htmlFor="username">
            Password
          </label>
          <input type="password" name='password' placeholder='Enter your Password'
            {...register("password", { required: 'Password is Required' })} />
          <img src={lock} className='userPlaceholder' />
          {errors.password && <p className='red'>{errors.password.message}</p>}
          {!errors.username && <p className='transperent'>x</p>}
        </div>


        <div className="line-container">
          <div className="myLine"></div>
          <div className="or">OR</div>
          <div className="myLine"></div>
        </div>

        <div className="custom-google-login-button">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onFailure}
          className='padding'
          text="continue_with"
          size='medium'
          width='250'
        />
      </div>


        <h4 onClick={() => navigate('/signup')}>Not a User? <span className='underline'> SIGNUP HERE
        </span>
        </h4>


        <button type='submit' value='submit' className='signupButton' >
          LOGIN
        </button>
      </form>}

      {!showUsername && <div className="loginRectangle">
        <h2>LOGIN</h2>

        <div className="inputLoginArea inputLoginArea2">
          <label htmlFor="username">
            Username
          </label>
          <input value={username} onChange={handleChange} placeholder="Enter your username" />
          <img src={person} className='userPlaceholder' />
        </div>

        {done ? <button className='submitUsername'>
          SUBMIT
        </button> : <button className='submitUsername' onClick={() => handleUsername()}>
          SUBMIT
        </button>}
      </div>}
    </div>
  )
}

export default loginPage