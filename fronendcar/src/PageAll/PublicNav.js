import React from 'react'

function PublicNav() {
  return (
    <div className="navbar">
        <a href='/PublicPage' className="titel">รถเช่าผมไม่เล็กนะครับ</a>
        <div className="titelogin">
          <a href="/CreateAccount">
            <h1>สมัครสมาชิก</h1>
          </a>
          <a href="/LoginForm">
            <h1>เข้าสู่ระบบ</h1>
          </a>
        </div>
      </div>
  )
}

export default PublicNav