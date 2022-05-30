import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButtonGroup,
  CButton,
  CCol,
  CRow,
  CBadge,
  CPagination,
  CPaginationItem,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CCollapse,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilCenterFocus, cilPenAlt } from '@coreui/icons'

import Loader from 'src/assets/loader'
import callServer from '../../utils/callServer'
import { useSearchParams, Link } from 'react-router-dom'

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState([])
  const [pagination, setPagination] = useState([])
  const [keyword, setKeyword] = useState(searchParams.get('keyword'))
  const [order, setOrder] = useState(searchParams.get('order'))
  const [visible, setVisible] = useState(false)

  const page = searchParams.get('page')
  const sKeyword = searchParams.get('keyword')
  const sOrder = searchParams.get('order')
  var pageCount = page == 1 ? 0 : (page - 1) * 10
  var paginationQuery = `&keyword=${sKeyword}&order=${sOrder}`

  const gUser = async () => {
    await setIsLoading(true)

    let resp = await callServer('Get', 'user', true, {
      params: {
        page,
        keyword,
        order,
        limit: 5,
      },
    })
    if (resp) {
      if (resp.data.status == 1) {
        setPagination(resp.data.pages)
        setUser(resp?.data?.user)
      } else {
        alert(resp.data.message)
      }
    }

    await setIsLoading(false)
  }

  const qStatus = async (id) => {
    let s_result = await callServer('PATCH', `user/status/${id}`, true)

    if (s_result) {
      alert(s_result.data.message)
      setUser((u) => u.map((i) => (i.id == id ? { ...i, status: !i.status } : i)))
    } else if (s_result && s_result.status != 401) {
      alert('Something went wrong!!')
    }
  }

  const qDelete = async (id) => {
    let s_result = await callServer('DELETE', `user/${id}`, true)

    if (s_result) {
      alert(s_result.data.message)
      gUser()
    } else if (s_result && s_result.status != 401) {
      alert('Something went wrong!!')
    }
  }

  const search = (e) => {
    e.preventDefault()
    console.log('searched!')

    searchParams.set('keyword', keyword)
    searchParams.set('order', order)
    setSearchParams(searchParams)
  }

  useEffect(() => {
    gUser()

    console.log('page loaded.!')
  }, [page, sKeyword, sOrder])

  let fPage = ''
  let lPage = ''
  if (page > 1) {
    fPage = (
      <li className="page-item">
        <Link
          to={{
            pathname: '/users/listing',
            search: `?page=${pagination.firstPage}${paginationQuery}`,
          }}
          className="page-link"
        >
          Previous
        </Link>
      </li>
    )
  } else {
    fPage = <CPaginationItem disabled>Previous</CPaginationItem>
  }
  if (pagination.lastPage != page) {
    lPage = (
      <li className="page-item">
        <Link
          to={{
            pathname: '/users/listing',
            search: `?page=${pagination.lastPage}${paginationQuery}`,
          }}
          className="page-link"
        >
          Last
        </Link>
      </li>
    )
  } else {
    lPage = <CPaginationItem disabled>Last</CPaginationItem>
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader onClick={() => setVisible(!visible)}>
            <strong>Filter</strong> <small>users</small>
          </CCardHeader>
          <CCollapse visible={visible}>
            <CCardBody>
              <p className="text-medium-emphasis small">
                Search via <code>name</code>.
              </p>

              <CForm className="row g-3" onSubmit={(e) => search(e)}>
                <div className="col-auto">
                  <CFormLabel htmlFor="sKeyword">Keyword</CFormLabel>
                  <CFormInput
                    type="text"
                    name="keyword"
                    id="sKeyword"
                    placeholder="keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>

                <div className="col-auto">
                  <CFormLabel htmlFor="sSort">Sort</CFormLabel>
                  <CFormSelect
                    placeholder="order"
                    id="sSort"
                    onChange={(e) => setOrder(e.target.value)}
                    value={order}
                  >
                    <option value="n_a">asc -Name</option>
                    <option value="n_d">desc -Name</option>
                    <option value="c_d">Newest first</option>
                    <option value="c_a">Newest last</option>
                  </CFormSelect>
                </div>
                <div className="row">
                  <CFormLabel htmlFor=""> </CFormLabel>
                  <CButton type="submit" className="mb-0 form-control">
                    Filter
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCollapse>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Listing</strong> <small>users</small>
          </CCardHeader>
          <CCardBody>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">DOB</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Gender</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Created at</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {isLoading ? (
                  <CTableRow>
                    <CTableHeaderCell colSpan="8">
                      <center>
                        <Loader type="page" />
                      </center>
                    </CTableHeaderCell>
                  </CTableRow>
                ) : user && user.length > 0 ? (
                  user.map((i) => {
                    let status = 'De-active'
                    let statusColor = 'danger'
                    if (i.status) {
                      status = 'Active'
                      statusColor = 'success'
                    }
                    return (
                      <CTableRow key={i.id}>
                        <CTableHeaderCell scope="row">{++pageCount}</CTableHeaderCell>
                        <CTableDataCell>{i.name}</CTableDataCell>
                        <CTableDataCell>{i.email}</CTableDataCell>
                        <CTableDataCell>{i.dob}</CTableDataCell>
                        <CTableDataCell>{i.gender}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={statusColor} onClick={() => qStatus(i.id)}>
                            {status}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{i.created_at}</CTableDataCell>
                        <CTableDataCell>
                          <CButtonGroup size="sm" role="group" aria-label="Small button group">
                            <CButton color="success text-white">
                              <Link to={`/users/show/${i.id}`}>
                                <CIcon icon={cilCenterFocus} />
                              </Link>
                            </CButton>
                            <CButton color="warning text-white">
                              <Link to={`/users/edit/${i.id}`}>
                                <CIcon icon={cilPenAlt} />
                              </Link>
                            </CButton>
                            <CButton color="danger text-white" onClick={() => qDelete(i.id)}>
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </CButtonGroup>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })
                ) : (
                  <CTableRow>
                    <CTableHeaderCell colSpan="5">
                      <center>Sorry, no users found.</center>
                    </CTableHeaderCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
            <CPagination className="justify-content-end" aria-label="Page navigation example">
              {fPage}
              {pagination?.pages && pagination?.pages.length > 0
                ? pagination?.pages.map((p) => (
                    <li className={`page-item ${p == page ? 'active' : ''}`} key={p}>
                      <Link
                        to={{
                          pathname: '/users/listing',
                          search: `?page=${p}${paginationQuery}`,
                        }}
                        className="page-link"
                      >
                        {p}
                      </Link>
                    </li>
                  ))
                : null}
              {lPage}
            </CPagination>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Index
