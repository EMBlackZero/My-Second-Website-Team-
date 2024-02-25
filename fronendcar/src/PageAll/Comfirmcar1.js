import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap"; // Import Form from react-bootstrap
import React, { useState, useEffect } from "react";
import "../CssAll/DetailsPage.css";
import Nav from "./Nav";
import MemberNav from "./MemberNav";
import AdminNav from "./AdminNav";
import PublicNav from "./PublicNav";

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [renterInfo, setRenterInfo] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const role = sessionStorage.getItem('role')
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/cars/${id}?populate=*`
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);
  console.log(data);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRenterInfo({ ...renterInfo, [name]: value });
  };

  const handleSubmit = () => {
    console.log(renterInfo);
    navigate(`/Comfirmcar2/${id}`);
  };

  return (
    <div>
      <Nav />
      <button className="buttonback" onClick={() => navigate("/PublicPage")}>
        <img src="/back.png" />
      </button>
      <Container className="detialpage">
        <div className="layoutobj">
          <div className="layout1">
            <div>รายละเอียดข้อมูลเพื่อเช่ารถ</div>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>ชื่อ-นามสกุล</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="โปรดกรอกชื่อจริง-นามสกุล"
                  name="name"
                  value={renterInfo.name}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Label>ที่อยู่ Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="โปรดกรอก E-mail ของท่าน"
                  name="email"
                  value={renterInfo.email}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formPhone">
                <Form.Label>เบอร์โทรติดต่อ</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="โปรดกรอกเบอร์โทรศัพท์ของท่าน"
                  name="phone"
                  value={renterInfo.phone}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formPhone">
                <Form.Label>ที่อยู่</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="โปรดกรอกที่อยู่ของท่าน"
                  name="phone"
                  value={renterInfo.phone}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Button variant="dark" onClick={handleSubmit}>
                ถัดไป
              </Button>
            </Form>
          </div>
          <div className="layout2">
            <div className="detialcar">
              <img src={"http://localhost:1337"+data?.attributes?.imgcar?.data?.attributes?.url  }></img>
            </div>
            <div>
              Price per day : {data.attributes && data.attributes.price} บาท/วัน
            </div>
          </div>
        </div>
      </Container>
      <footer></footer>
    </div>
  );
};

export default DetailsPage;
