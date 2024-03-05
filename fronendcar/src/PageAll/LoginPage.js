import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CssAll/LoginCss.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("001");
  const [password, setPassword] = useState("123456");
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [show, setShow] = useState(false);

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
      const result = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: username,
        password: password,
      });

      //เก็บ jwt ในฟังก์ชั่นเพื่อเรียกใช้งานในหน้า component อื่น
      const saveTokenTosessionStorage = (token) => {
        sessionStorage.setItem("jwtToken", token); //เก็บ jwt token
      };
      saveTokenTosessionStorage(result.data.jwt);
      sessionStorage.setItem("username", result.data.user.username);
      sessionStorage.setItem("iduser", result.data.user.id);
      const config = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
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
          sessionStorage.setItem("role", userResult.data.role.name);
          navigate("/");
        }
        if (userResult.data.role.name === "Admin") {
          sessionStorage.setItem("role", userResult.data.role.name);
          navigate("/AdminPage");
        }
      }

      console.log("userresult", userResult);
    } catch (e) {
      console.log(e);
      console.log("wrong username & password");
      alert("Your username or password is wrong");
      setSubmitEnabled(true);
    }
  };

  return (
    <div>
      <div className="login">
        <h1 className="name1">เข้าสู่ระบบ</h1>
        <div className="carlogo1">
          <img src="carlogo.png"></img>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicUsername">
            <Form.Label>Email or Username</Form.Label>
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

          <a href="/CreateAccount">
            <h1 className="account">ยังไม่มีบัญชี?</h1>
          </a>
        </Form>
        <button className="icon-button" onClick={() => navigate("/")}>
          <img src="back.png"></img>
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
