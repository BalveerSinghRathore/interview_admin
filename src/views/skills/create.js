import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormFeedback,
  CCardFooter,
} from '@coreui/react'

import Loader from 'src/assets/loader'
import callServer from '../../utils/callServer'
import { Formik } from 'formik'
import * as Yup from 'yup'

const Create = () => {
  const [isLoading, setIsLoading] = useState(false)

  const validate = Yup.object().shape({
    name: Yup.string().trim().max(545).required().label('Name'),
  })
  const submit = async (values) => {
    setIsLoading(true)

    let s_result = await callServer('POST', 'skill', true, values)

    if (s_result) {
      alert(s_result.data.message)
    } else if (s_result && s_result.status != 401) {
      alert('Something went wrong!!')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    console.log('page loaded.!')
  }, [])

  return (
    <CRow>
      <CCol xs={3}></CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Create</strong> <small>skill</small>
          </CCardHeader>
          <Formik
            initialValues={{ name: '' }}
            validationSchema={validate}
            onSubmit={(value, { resetForm }) => {
              submit(value)
              resetForm()
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <CForm onSubmit={handleSubmit}>
                <CCardBody>
                  <div className="mb-3">
                    <CFormLabel htmlFor="iName">Name</CFormLabel>
                    <CFormInput
                      type="text"
                      id="iName"
                      placeholder="Name here..."
                      name="name"
                      onChange={handleChange}
                      value={values.name}
                      onBlur={handleBlur}
                    />
                    <CFormFeedback className="help-block error-msg">
                      {errors.name && touched.name && errors.name}
                    </CFormFeedback>
                  </div>
                </CCardBody>
                <CCardFooter>
                  <CButton color="primary" type={isLoading ? 'button' : 'submit'}>
                    {isLoading ? <Loader /> : 'Save'}
                  </CButton>
                </CCardFooter>
              </CForm>
            )}
          </Formik>
        </CCard>
      </CCol>
      <CCol xs={3}></CCol>
    </CRow>
  )
}

export default Create
