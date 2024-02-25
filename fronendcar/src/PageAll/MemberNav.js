import React from "react";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "../CssAll/LoginCss.css";

function MemberNav(props) {
  const username = sessionStorage.getItem("username");
  return (
    <div className="navbar">
      <a href="/PublicPage" className="titel">
        รถเช่าผมไม่เล็กนะครับ
      </a>
      <div className="titelogin">
        <DropdownButton
          id="dropdown-basic-button"
          title={username}
          className="dropdown-with-image"
        >
          <Dropdown.Item onClick={props.onlogout}>Logout</Dropdown.Item>
        </DropdownButton>
      </div>
    </div>
  );
}

export default MemberNav;
