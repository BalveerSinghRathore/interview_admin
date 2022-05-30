import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormFeedback,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

import { Formik } from 'formik'
import * as Yup from 'yup'
import Loader from 'src/assets/loader'
import callServer from '../../../utils/callServer'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [toLogin, setToLogin] = useState(false)

  const userToken = localStorage.getItem('interview-token')
  if (userToken) {
    return <Navigate to="/dashboard" exact />
  } else {
    // dispatch({ type: 'set', userAuth: null })
  }

  const validation = Yup.object({
    password: Yup.string()
      .trim()
      .label('Password')
      .min(6, 'Must be 6 characters or high')
      .max(15, 'Must be 15 characters or less')
      .required('Password is a required'),
    email: Yup.string().trim().label('Email').email().required('Email is a required'),
  })
  const submit = async (values) => {
    await setIsLoading(true)
    let s_result = await callServer('POST', 'login', false, values)

    if (s_result) {
      if (s_result.data.status == 1) {
        // dispatch({
        //     type: "set",
        //     userAuth: {
        //         name: s_result.data.name,
        //         isComplete: s_result.data.isComplete,
        //         image: s_result.data.image,
        //     },
        // });
        localStorage.setItem('interview-token', s_result.data.token)
        setToLogin(true)
      } else {
        alert(s_result.data.message)
      }
    } else {
      alert('Something went wrong!!')
    }

    await setIsLoading(false)
  }

  if (toLogin) {
    return <Navigate to="/dashboard" exact />
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validation}
                    onSubmit={(values) => submit(values)}
                  >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                      <CForm onSubmit={handleSubmit}>
                        <h1>Login</h1>
                        <p className="text-medium-emphasis">Sign In to your account</p>
                        <CRow>
                          <CInputGroup className="mb-1">
                            <CInputGroupText>
                              <CIcon icon={cilUser} />
                            </CInputGroupText>
                            <CFormInput
                              name="email"
                              placeholder="Email"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.email}
                            />
                          </CInputGroup>
                          <CFormFeedback className="help-block mb-3 error-msg">
                            {errors.email && touched.email && errors.email}
                          </CFormFeedback>
                        </CRow>
                        <CRow>
                          <CInputGroup className="mb-1">
                            <CInputGroupText>
                              <CIcon icon={cilLockLocked} />
                            </CInputGroupText>
                            <CFormInput
                              name="password"
                              type="password"
                              placeholder="Password"
                              autoComplete="current-password"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.password}
                            />
                          </CInputGroup>
                          <CFormFeedback className="help-block mb-3 error-msg">
                            {errors.password && touched.password && errors.password}
                          </CFormFeedback>
                        </CRow>
                        <CRow>
                          <CCol xs={6}>
                            <CButton
                              color="primary"
                              type={isLoading ? 'button' : 'submit'}
                              className="px-4"
                            >
                              {isLoading ? <Loader /> : 'Login'}
                            </CButton>
                          </CCol>
                          <CCol xs={6} className="text-right">
                            <CButton color="link" className="px-0">
                              Forgot password?
                            </CButton>
                          </CCol>
                        </CRow>
                      </CForm>
                    )}
                  </Formik>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <CButton color="primary" className="mt-3" active tabIndex={-1}>
                      Register Now!
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
