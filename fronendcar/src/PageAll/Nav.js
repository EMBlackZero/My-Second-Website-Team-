import React from 'react'

function Nav() {
  return (
    <div class="navbar">
        <h1 className="titel">รถเช่าผมไม่เล็กนะครับ</h1>
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

export default Nav