import React from 'react'
import { useNavigate } from 'react-router-dom'
import PublicNav from './PublicNav'
import MemberNav from './MemberNav'
import AdminNav from './AdminNav'

function Nav() {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem('jwtToken')
    sessionStorage.removeItem('role')
    sessionStorage.removeItem('username')
    navigate('/');
  }
  const role = sessionStorage.getItem('role')
  return (
    <div>
      {!role && <PublicNav/>}
      {role === 'Member' && <MemberNav onlogout={handleLogout}/>}
      {role === 'Admin' && <AdminNav onlogout={handleLogout}/>}
    </div>
  )
}

export default Nav