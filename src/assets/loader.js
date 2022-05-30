import React from 'react'

const Loader = (porps) => {
  return (
    <div className={porps.type && porps.type == 'page' ? 'lds-ring page' : 'lds-ring'}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default Loader
