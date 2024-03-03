import React from 'react'
import { useNavigate } from 'react-router-dom'
import PublicNav from './PublicNav'
import MemberNav from './MemberNav'
import AdminNav from './AdminNav'

function Nav(props) {
  // senddatatoPublicPage.js
  const NavtoPBP=(text)=>{
    props.onSearch(text)
  }
  // senddatatoAdminPage.js
  const NavtoAMP=(text)=>{
    props.onSearch(text)
  }
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem('jwtToken')
    sessionStorage.removeItem('role')
    sessionStorage.removeItem('username')
    sessionStorage.removeItem('iduser')
    sessionStorage.removeItem('wrap')
    navigate('/');
  }
  const role = sessionStorage.getItem('role')
  return (
    <div>
      {!role && <PublicNav  onSearch={NavtoPBP}/>}
      {role === 'Member' && <MemberNav onlogout={handleLogout} onSearch={NavtoPBP}/>}
      {role === 'Admin' && <AdminNav onlogout={handleLogout} onSearch={NavtoAMP}/>}
    </div>
  )
}

export default Nav