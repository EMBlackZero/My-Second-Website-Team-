import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../CssAll/LoginCss.css";
const CreateAccount = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleSubscribeChange = () => {
    setSubscribe(!subscribe);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      window.alert("รหัสผ่านไม่ถูกต้อง");
      return; // ไม่ทำการส่งข้อมูลถ้ารหัสผ่านไม่ตรงกัน
    }

    try {
      let result = await axios.post("http://localhost:1337/api/users", {
        username: username,
        email: email,
        password: password,
        provider: "local",
        confirmed: true,
        blocked: false,
        role: 1,
      });

    } catch (e) {
      console.log(e);
      console.log("wrong username & password");
    }
    navigate("/LoginForm")
  };

  return (
    <div className="login">
      <h1 className="name1">สมัครสมาชิก</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>ชื่อ</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicemail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>รหัสผ่าน</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicConfirmPassword">
          <Form.Label>ยืนยันรหัสผ่าน</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicCheckbox">
          <Form.Check
            style={{
              marginTop: "10px",
            }}
            type="checkbox"
            label="ยอมรับเงื่อนไขการให้บริการ"
            checked={subscribe}
            onChange={handleSubscribeChange}
          />
        </Form.Group>

        <Button
          className="Buttonlogin"
          style={{
            display: "block",
            margin: "auto",
            marginTop: "20px",
            background: "linear-gradient(to bottom, #000000, #737373)",
            color: "white",
          }}
          type="submit"
          disabled={!subscribe}
        >
          สมัครสมาชิก
        </Button>

        <a href="/LoginForm">
          <h1 className="account">เป็นสมาชิกอยู่แล้ว</h1>
        </a>
      </Form>
    </div>
  );
};

export default CreateAccount;
