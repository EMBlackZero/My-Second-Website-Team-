import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../CssAll/LoginCss.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("001");
  const [password, setPassword] = useState("123456");
  const [submitEnabled, setSubmitEnabled] = useState(true);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitEnabled(false);

    try {
      let result = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: username,
        password: password,
      });

      //เก็บ jwt ในฟังก์ชั่นเพื่อเรียกใช้งานในหน้า component อื่น
      const saveTokenToLocalStorage = (token) => {
        localStorage.setItem("jwtToken", token); //เก็บ jwt token
      };
      saveTokenToLocalStorage(result.data.jwt);

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      };

      //เช็ค role
      const userResult = await axios.get(
        "http://localhost:1337/api/users/me?populate=role",
        config
      );

      // Step 4: Check user's role and navigate accordingly
      if (userResult.data.role) {
        if (userResult.data.role.name === "Member") {
          localStorage.setItem("role", userResult.data.role.name);
          navigate("/");
        }
        if (userResult.data.role.name === "Admin") {
          localStorage.setItem("role", userResult.data.role.name);
          navigate("/");
        }
      }

      console.log(userResult);
    } catch (e) {
      console.log(e);
      console.log("wrong username & password");
      setSubmitEnabled(true);
    }
  };

  return (
    <div className="login">
      <h1 className="name1">เข้าสู่ระบบ</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </Form.Group>

        <Button /* className="blackButton" */
          style={{
            display: "block",
            margin: "auto",
            marginTop: "20px",
            background: "linear-gradient(to bottom, #000000, #737373)",
            color: "white", // ตั้งค่าสีข้อความเป็นสีขาว
          }}
          type="submit"
          disabled={!submitEnabled}
        >
          เข้าสู่ระบบ
        </Button>
        <a href="/ลิงก์ไปยังหน้าที่ต้องการ">
          <h1 className="noaccount">ยังไม่มีบัญชี?</h1>
        </a>
        <div className="imlogo-container">
          <img class="imlogo" src="fb_icon.png"></img>
          <img class="imlogo" src="line-icon.png"></img>
          <img class="imlogo" src="Google__logo.png"></img>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
