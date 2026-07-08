// import React from 'react'
// import api from '../../../utils/api'
// import { useNavigateCustom } from '../../../pages/_layout/elements/custom-link'
// import { useWebsocketUser } from '../../../context/webSocketUser'
// import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
// import { selectUserData } from '../../../redux/actions/login/loginSlice'
// import User from '../../../models/User'
// import { loginAction } from '../../../redux/actions/login/login.action'
// import SubmitButton from '../../../components/SubmitButton'

// const Login = () => {
//   const dispatch = useAppDispatch()
//   const userState = useAppSelector(selectUserData)
//   const { socketUser } = useWebsocketUser()

//   const navigate = useNavigateCustom()

//   const [loginForm, setLoginForm] = React.useState<User>({
//     username: '',
//     password: '',
//     logs: '',
//     admin: true,
//   })

//   React.useEffect(() => {
//     api.get(`${process.env.REACT_APP_IP_API_URL}`).then((res) => {
//       setLoginForm({ ...loginForm, logs: res.data })
//     })
//   }, [])

//   React.useEffect(() => {
//     if (userState.status === 'done') {
//       const { role, _id ,sessionId} = userState.user
//       socketUser.emit('login', {
//         role: userState.user.role,
//         sessionId: userState.user.sessionId,
//         _id,
//         sessionIda:sessionId
//       })

//       if (userState.user.role && ['admin', '1', '2', '3'].includes(userState.user.role)) {
//         return navigate.go('/market-analysis')
//       }

//       return navigate.go('/market-analysis')
//     }
//   }, [userState])

//   const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault()
//     dispatch(loginAction(loginForm))
//   }

//   return (
//     <div className='login'>
//       <div className='wrapper d-flex justify-content-center align-items-center'>
//         <div className='container-flui'>
//           <div className='row'>
//             <div className='col-md-12'>
//               <div  className='loginInner1 container-fluid '>
//                 {/* <div className='log-logo m-b-20 text-center'>
//                   <img src='/imgs/d006 copy.png' className='logo-login' style={{ maxWidth: "250px", maxHeight: "100px" }} />
//                 </div> */}
//                 <div className='featured-box-login featured-box-secundary default log-fld'>
//                 <div className='log-logo m-b-20 text-center'>
//                   <img src='/imgs/logo.png' className='logo-login' style={{ maxWidth: "250px", maxHeight: "100px" }} />
//                 </div>
//                   <form
//                     onSubmit={(e) => handleSubmit(e)}
//                     role='form'
//                     autoComplete='off'
//                     method='post'
//                   >
//                     <div className='form-group m-b-20'>
//                       <input
//                         name='username'
//                         placeholder='User Name'
//                         type='text'
//                         className='form-control'
//                         aria-required='true'
//                         aria-invalid='false'
//                         onChange={handleForm}
//                         required
//                       />
//                       <small className='text-danger' style={{ display: 'none' }}></small>
//                     </div>
//                     <div className='form-group m-b-20'>
//                       <input
//                         name='password'
//                         placeholder='Password'
//                         type='password'
//                         className='form-control'
//                         aria-required='true'
//                         aria-invalid='false'
//                         onChange={handleForm}
//                         required
//                       />
//                       {userState.error ? (
//                         <small className='text-danger'>{userState.error}</small>
//                       ) : (
//                         ''
//                       )}
//                     </div>
//                     <div className='form-group text-center mb-0'>
//                       <SubmitButton type='submit' className='btn btn-submit btn-login' style={{backgroundColor:"#11283E"}}>
//                         Login
//                         {userState.status === 'loading' ? (
//                           <i className='fas fa-spinner fa-spin'></i>
//                         ) : (
//                           <i className='fas fa-sign-in-alt'></i>
//                         )}
//                       </SubmitButton>

//                     </div>
//                     <div className='mt-2 text-center download-apk'></div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login


import React from 'react'
import api from '../../../utils/api'
import { useNavigateCustom } from '../../../pages/_layout/elements/custom-link'
import { useWebsocketUser } from '../../../context/webSocketUser'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { selectUserData } from '../../../redux/actions/login/loginSlice'
import User from '../../../models/User'
import { loginAction } from '../../../redux/actions/login/login.action'
import SubmitButton from '../../../components/SubmitButton'

// unique prefix so this can't collide with any existing project CSS
const P = 'adlg'

const Login = () => {
  const dispatch = useAppDispatch()
  const userState = useAppSelector(selectUserData)
  const { socketUser } = useWebsocketUser()
  const navigate = useNavigateCustom()

  const [showPassword, setShowPassword] = React.useState(false)

  const [loginForm, setLoginForm] = React.useState<User>({
    username: '',
    password: '',
    logs: '',
    admin: true,
  })

  React.useEffect(() => {
    api.get(`${process.env.REACT_APP_IP_API_URL}`).then((res) => {
      setLoginForm(prev => ({ ...prev, logs: res.data }))
    })
  }, [])

  React.useEffect(() => {
    if (userState.status === 'done') {
      const { role, _id, sessionId } = userState.user

      socketUser.emit('login', {
        role,
        sessionId,
        _id,
      })

      navigate.go('/market-analysis')
    }
  }, [userState])

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(loginAction(loginForm))
  }

  return (
    <div className={`${P}-page`}>
      {/* Scoped stylesheet — !important so nothing in the project overrides this page */}
      <style>{`
        .${P}-page {
          min-height: 100vh !important;
          width: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          background: linear-gradient(180deg, #1a2438 0%, #1e3a63 45%, #1e5799 100%) !important;
        }
        .${P}-center {
          flex: 1 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 40px 20px !important;
        }
        .${P}-card {
          width: 100% !important;
          max-width: 380px !important;
          background: #ffffff !important;
          border-radius: 4px !important;
          padding: 40px 26px 32px !important;
          box-shadow: 0 12px 30px rgba(0,0,0,0.35) !important;
        }
        .${P}-logo-wrap {
          display: flex !important;
          justify-content: center !important;
          margin-bottom: 28px !important;
        }
        .${P}-logo {
          max-width: 250px !important;
          max-height: 100px !important;
        }
        .${P}-input-group {
          margin-bottom: 18px !important;
          position: relative !important;
        }
        .${P}-input {
          width: 100% !important;
          border: 1px solid #dcdfe3 !important;
          border-radius: 8px !important;
          padding: 6px 16px !important;
          font-size: 15 spx !important;
          color: #333 !important;
          outline: none !important;
          box-sizing: border-box !important;
          background: #fff !important;
        }
        .${P}-input::placeholder {
          color: #9aa0a6 !important;
        }
        .${P}-eye {
          position: absolute !important;
          right: 14px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          cursor: pointer !important;
          color: #777 !important;
        }
        .${P}-error {
          display: block !important;
          color: #e63950 !important;
          margin-top: 6px !important;
        }
        .${P}-login-btn {
          width: 100% !important;
          background: #c82333 !important;
          color: #fff !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 10px 0 !important;
          font-size: 18px !important;
          cursor: pointer !important;
          margin-top: 6px !important;
        }
        .${P}-login-btn:active {
          filter: brightness(0.95) !important;
        }
        .${P}-footer {
          background: #f7b500 !important;
          color: #fff !important;
          text-align: center !important;
          padding: 16px 12px !important;
          font-size: 16px !important;
        }
      `}</style>

      <div className={`${P}-center`}>
        <div className={`${P}-card`}>
          <div className={`${P}-logo-wrap`}>
            <img src="https://admin.sixrun.co/assets/logo-DFFs84w_.png" className={`${P}-logo`} alt="SixRun" />
          </div>

          <form onSubmit={handleSubmit} autoComplete="off">
            {/* USERNAME */}
            <div className={`${P}-input-group`}>
              <input
                name="username"
                placeholder="Username"
                type="text"
                className={`${P}-input`}
                onChange={handleForm}
                required
              />
            </div>

            {/* PASSWORD WITH EYE */}
            <div className={`${P}-input-group`}>
              <input
                name="password"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                className={`${P}-input`}
                onChange={handleForm}
                required
              />

              <i
                className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} ${P}-eye`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>

              {userState.error && (
                <small className={`${P}-error`}>{userState.error}</small>
              )}
            </div>

            {/* BUTTON */}
            <SubmitButton
              type="submit"
              className={`${P}-login-btn`}
            >
              Login&nbsp;
              {userState.status === 'loading' ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                ''
              )}
            </SubmitButton>
          </form>
        </div>
      </div>

      <div className={`${P}-footer`}>
        Note : This site is not for Indian Territory
      </div>
    </div>
  )
}

export default Login