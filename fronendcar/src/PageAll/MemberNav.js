import React from 'react'
import Button from 'react-bootstrap/Button';
  
function MemberNav(props) {
  const username = sessionStorage.getItem('username')
  return (
    <div className="navbar">
        <a href='/PublicPage' className="titel">รถเช่าผมไม่เล็กนะครับ</a>
        <div className="titelogin">
          <a href="/">
            <h1>{username}</h1>
          </a>
          <Button variant="danger" onClick={props.onlogout}>Logout</Button>
          
        </div>
      </div>
  )
}

export default MemberNav