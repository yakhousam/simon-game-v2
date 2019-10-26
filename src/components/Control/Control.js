import React from 'react'
import "./control.css"

const Control = () => {
  return (
    <div className="control">
      <h1 className='title'>Simon</h1>
      <div className='monitor'>
        <span>Good</span>
      </div>
      <div className='btn-wrap'>
        <div className='btn'>P</div>
        <div className='btn'>S</div>
        <div className='btn'></div>
      </div>
    </div>
  )
}

export default Control
