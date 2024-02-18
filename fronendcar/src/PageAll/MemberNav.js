import React from 'react'

function MemberNav(props) {
  return (
    <div className="navbar">
        <a href='/PublicPage' className="titel">รถเช่าผมไม่เล็กนะครับ</a>
        <div className="titelogin">
          <a href="/">
            <h1>Profile</h1>
          </a>
          <button onClick={props.onlogout}>Logout</button>
          
        </div>
      </div>
  )
}

export default MemberNav