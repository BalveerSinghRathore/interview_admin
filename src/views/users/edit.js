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
  CFormSelect,
  CFormLabel,
  CFormTextarea,
  CFormFeedback,
  CCardFooter,
} from '@coreui/react'

import Loader from 'src/assets/loader'
import callServer from '../../utils/callServer'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'

const Create = () => {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmit, setSubmit] = useState(false)
  const [isSkill, setIsSkill] = useState(false)
  const [user, setUser] = useState(false)
  const [skill, setSkill] = useState([])

  const fileSupported = ['image/jpg', 'image/jpeg', 'image/png']

  const gUser = async () => {
    await setIsLoading(true)

    let resp = await callServer('Get', `user/${id}`, true, {})
    if (resp) {
      if (resp.data.status == 1) {
        setUser(resp?.data?.user)
      } else {
        alert(resp.data.message)
      }
    }

    await setIsLoading(false)
  }

  const validate = Yup.object().shape({
    name: Yup.string().trim().max(545).required().label('Name'),
    email: Yup.string().trim().email().max(545).required().label('Email'),
    phone_code: Yup.string().trim().required().label('Country Code'),
    phone: Yup.string().trim().required().label('Phone number'),
    about: Yup.string().trim().max(1500).required().label('About'),
    dob: Yup.string().trim().required().label('DOB'),
    skills: Yup.array().required().label('Skills'),
    gender: Yup.string().trim().required().label('Gender'),
    dl: Yup.string().trim().max(545).required().label('Driving licence'),
    education: Yup.string().trim().max(545).required().label('Education'),
    imguser: Yup.mixed()
      .nullable()
      .test('fileSize', 'File too large', (value) => !value || (value && value.size <= 5000000))
      .test(
        'fileFormat',
        'Unsupported Format',
        (value) => !value || (value && fileSupported.includes(value.type)),
      )
      .label('Image'),
    imgdl: Yup.mixed()
      .nullable()
      .test('fileSize', 'File too large', (value) => !value || (value && value.size <= 5000000))
      .test(
        'fileFormat',
        'Unsupported Format',
        (value) => !value || (value && fileSupported.includes(value.type)),
      )
      .label('Driving licence'),
  })
  const submit = async (values) => {
    setSubmit(true)

    let s_result = await callServer('PATCH', `user/${id}`, true, values)

    if (s_result) {
      alert(s_result.data.message)
      gUser()
    } else if (s_result && s_result.status != 401) {
      alert('Something went wrong!!')
    }
    setSubmit(false)
  }
  const gSkill = async () => {
    setIsSkill(true)
    let resp = await callServer('Get', 'skill', true, {
      params: {
        page: 1,
        limit: 100,
      },
    })
    if (resp) {
      if (resp.data.status == 1) {
        setSkill(resp?.data?.skill)
      } else {
        alert(resp.data.message)
      }
    }
    setIsSkill(false)
  }

  useEffect(() => {
    gSkill()
    gUser()
    console.log('page loaded.!')
  }, [id])

  return (
    <CRow>
      <CCol xs={3}></CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Create</strong> <small>user</small>
          </CCardHeader>
          {isLoading ? (
            <center>
              <Loader type="page" />
            </center>
          ) : (
            <Formik
              initialValues={{
                name: user?.name || '',
                email: user?.email || '',
                phone_code: user?.phone_code || '',
                phone: user?.phone || '',
                about: user?.about || '',
                education: user?.education || '',
                dob: user?.dob || '',
                gender: user?.gender || '',
                dl: user?.dl || '',
                imguser: '',
                skills: user?.skill_ids || [],
                imgdl: '',
              }}
              validationSchema={validate}
              onSubmit={(value) => {
                const formData = new FormData()
                formData.append('name', value.name)
                formData.append('email', value.email)
                formData.append('phone_code', value.phone_code)
                formData.append('phone', value.phone)
                formData.append('about', value.about)
                formData.append('education', value.education)
                formData.append('dob', value.dob)
                formData.append('gender', value.gender)
                formData.append('skills', value.skills)
                formData.append('dl', value.dl)
                formData.append('img-user', value.imguser)
                formData.append('img-driving_licence', value.imgdl)
                submit(formData)
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
              }) => (
                <CForm onSubmit={handleSubmit} encType="multipart/form-data">
                  <CCardBody>
                    <center className="show-img">
                      <img src={user?.image} alt={user?.name || ''} />
                    </center>
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
                    <div className="mb-3">
                      <CFormLabel htmlFor="iEmail">Email</CFormLabel>
                      <CFormInput
                        type="email"
                        id="iEmail"
                        placeholder="Email here..."
                        name="email"
                        onChange={handleChange}
                        value={values.email}
                        onBlur={handleBlur}
                      />
                      <CFormFeedback className="help-block error-msg">
                        {errors.email && touched.email && errors.email}
                      </CFormFeedback>
                    </div>
                    <div className="mb-3 row">
                      <CCol xs={5}>
                        <CFormLabel htmlFor="iCountryCode">Country Code</CFormLabel>
                        <CFormInput
                          type="text"
                          id="iCountryCode"
                          placeholder="Country Code here..."
                          name="phone_code"
                          onChange={handleChange}
                          value={values.phone_code}
                          onBlur={handleBlur}
                        />
                        <CFormFeedback className="help-block error-msg">
                          {errors.phone_code && touched.phone_code && errors.phone_code}
                        </CFormFeedback>
                      </CCol>
                      <CCol xs={7}>
                        <CFormLabel htmlFor="iPhone">Phone number</CFormLabel>
                        <CFormInput
                          type="text"
                          id="iPhone"
                          placeholder="Phone here..."
                          name="phone"
                          onChange={handleChange}
                          value={values.phone}
                          onBlur={handleBlur}
                        />
                        <CFormFeedback className="help-block error-msg">
                          {errors.phone && touched.phone && errors.phone}
                        </CFormFeedback>
                      </CCol>
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="iDob">DOB</CFormLabel>
                      <CFormInput
                        type="date"
                        id="iDob"
                        placeholder="Email here..."
                        name="dob"
                        onChange={handleChange}
                        value={values.dob}
                        onBlur={handleBlur}
                      />
                      <CFormFeedback className="help-block error-msg">
                        {errors.dob && touched.dob && errors.dob}
                      </CFormFeedback>
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="iGender">Gender</CFormLabel>
                      <CFormSelect
                        id="iGender"
                        name="gender"
                        onChange={handleChange}
                        value={values.gender}
                        onBlur={handleBlur}
                      >
                        <option value="m">Male</option>
                        <option value="f">Female</option>
                      </CFormSelect>
                      <CFormFeedback className="help-block error-msg">
                        {errors.gender && touched.gender && errors.gender}
                      </CFormFeedback>
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="iSkill">Skills</CFormLabel>
                      <CFormSelect
                        id="iSkill"
                        name="skills"
                        multiple
                        onChange={handleChange}
                        value={values.skills}
                        onBlur={handleBlur}
                      >
                        {isSkill
                          ? ''
                          : skill.map((i) => (
                              <option value={i.id} key={i.id}>
                                {i.name}
                              </option>
                            ))}
                      </CFormSelect>
                      <CFormFeedback className="help-block error-msg">
                        {errors.skills && touched.skills && errors.skills}
                      </CFormFeedback>
                    </div>
                    <div className="mb-3">
                      <center className="show-img">
                        <img src={user?.imagedl} alt={user?.dl || ''} />
                      </center>
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="iDl">Driving licence</CFormLabel>
                      <CFormInput
                        type="text"
                        id="iDl"
                        placeholder="Driving licence here..."
                        name="dl"
                        onChange={handleChange}
                        value={values.dl}
                        onBlur={handleBlur}
                      />
                      <CFormFeedback className="help-block error-msg">
                        {errors.dl && touched.dl && errors.dl}
                      </CFormFeedback>
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="iEducation">Education</CFormLabel>
                      <CFormInput
                        type="text"
                        id="iEducation"
                        placeholder="Education here..."
                        name="education"
                        onChange={handleChange}
                        value={values.education}
                        onBlur={handleBlur}
                      />
                      <CFormFeedback className="help-block error-msg">
                        {errors.education && touched.education && errors.education}
                      </CFormFeedback>
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="iAbout">About</CFormLabel>
                      <CFormTextarea
                        id="iAbout"
                        rows="3"
                        name="about"
                        placeholder="About here..."
                        onChange={handleChange}
                        value={values.about}
                        onBlur={handleBlur}
                      ></CFormTextarea>
                      <CFormFeedback className="help-block error-msg">
                        {errors.about && touched.about && errors.about}
                      </CFormFeedback>
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="ifUser">User image</CFormLabel>
                      <CFormInput
                        type="file"
                        name="imguser"
                        id="ifUser"
                        onChange={(event) => {
                          setFieldValue('imguser', event.currentTarget.files[0])
                        }}
                      />
                      <CFormFeedback className="help-block error-msg">
                        {errors.imguser && touched.imguser && errors.imguser}
                      </CFormFeedback>
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="ifDl">Driving licence</CFormLabel>
                      <CFormInput
                        type="file"
                        name="imgdl"
                        id="ifDl"
                        onChange={(event) => {
                          setFieldValue('imgdl', event.currentTarget.files[0])
                        }}
                      />
                      <CFormFeedback className="help-block error-msg">
                        {errors.imgdl && touched.imgdl && errors.imgdl}
                      </CFormFeedback>
                    </div>
                  </CCardBody>
                  <CCardFooter>
                    <CButton color="primary" type={isSubmit ? 'button' : 'submit'}>
                      {isSubmit ? <Loader /> : 'Save'}
                    </CButton>
                  </CCardFooter>
                </CForm>
              )}
            </Formik>
          )}
        </CCard>
      </CCol>
      <CCol xs={3}></CCol>
    </CRow>
  )
}

export default Create
