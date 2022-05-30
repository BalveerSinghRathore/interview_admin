import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CCol,
  CRow,
  CFormLabel,
  CCardFooter,
} from '@coreui/react'

import Loader from 'src/assets/loader'
import callServer from '../../utils/callServer'
import { useParams } from 'react-router-dom'

const Show = () => {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(false)
  const [skill, setSkill] = useState(false)

  const gUser = async () => {
    await setIsLoading(true)

    let resp = await callServer('Get', `user/${id}`, true, {})
    if (resp) {
      if (resp.data.status == 1) {
        setUser(resp?.data?.user)
        setSkill(resp?.data?.skill)
      } else {
        alert(resp.data.message)
      }
    }

    await setIsLoading(false)
  }

  useEffect(() => {
    gUser()
    console.log('page `usershow` loaded.!')
    console.log('porps', id)
  }, [id])

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Details</strong> <small>user</small>
          </CCardHeader>
          <CCardBody>
            <center className="show-img">
              <img src={user?.image} alt={user?.name || ''} />
            </center>
            <div className="mb-3">
              <CFormLabel>Name</CFormLabel>
              <div className="data-show">{user?.name || ''}</div>
            </div>
            <div className="mb-3">
              <CFormLabel>Email</CFormLabel>
              <div className="data-show">{user?.email || ''}</div>
            </div>
            <div className="mb-3">
              <CFormLabel>Phone number</CFormLabel>
              <div className="data-show">{user?.phone || ''}</div>
            </div>
            <div className="mb-3">
              <CFormLabel>Education</CFormLabel>
              <div className="data-show">{user?.education || ''}</div>
            </div>
            <div className="mb-3 row">
              <CCol xs={6}>
                <CFormLabel>Gender</CFormLabel>
                <div className="data-show">{user?.gender == 'm' ? 'Male' : 'Female'}</div>
              </CCol>
              <CCol xs={6}>
                <CFormLabel>DOB</CFormLabel>
                <div className="data-show">{user?.dob || ''}</div>
              </CCol>
            </div>
            <div className="mb-3">
              <CFormLabel>About</CFormLabel>
              <div className="data-show">{user?.about || ''}</div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Document</strong> <small>Driving licence</small>
          </CCardHeader>
          <CCardBody>
            <center className="show-img">
              <img src={user?.imagedl} alt={user?.dl || ''} />
            </center>
            <div className="mb-3">
              <CFormLabel>Driving licence</CFormLabel>
              <div className="data-show">{user?.dl || ''}</div>
            </div>
          </CCardBody>
        </CCard>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Skills</strong> <small>user</small>
          </CCardHeader>
          <CCardBody>
            <div className="mb-3">
              <div className="data-show">
                {skill && skill.length > 0 ? skill.map((i) => `${i.name}, `) : ''}
              </div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Show
