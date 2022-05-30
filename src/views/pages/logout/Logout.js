import React from 'react'
import { Navigate } from 'react-router-dom'

const Logout = () => {
  localStorage.removeItem('interview-token')
  return <Navigate to="/login" exact />
}

export default Logout
