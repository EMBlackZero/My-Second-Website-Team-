import React from 'react';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

function AdminNav(props) {
  return (
    <div className="navbar">
      <a href='/AdminPage' className="titel">รถเช่าผมไม่เล็กนะครับ</a>
      <div className="titelogin">
        
        <DropdownButton
          id="admin-dropdown"
          title="Admin"
          className="dropdown-with-image"
        >
          <Dropdown.Item onClick={props.onlogout}>Logout</Dropdown.Item>
        </DropdownButton>
      </div>
    </div>
  );
}

export default AdminNav;
