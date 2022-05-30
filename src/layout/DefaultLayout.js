import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { Navigate } from 'react-router-dom'

const DefaultLayout = () => {
  const isUserLoggedIn = localStorage.getItem('interview-token')

  if (isUserLoggedIn == null) return <Navigate from="/" to={'/login'} />

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
