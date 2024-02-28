import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container,Modal } from "react-bootstrap";
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
  const [showModal, setShowModal] = useState(false); // เพิ่ม state สำหรับจัดการการแสดง Modal
  const role = sessionStorage.getItem("role");
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/cars/${id}?populate=*`
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);
  console.log(data);
  const Comfirmcar = () => {
    sessionStorage.setItem("wrap",`/Comfirmcar1/${id}`)
    role === null ? setShowModal(true) : navigate(`/Comfirmcar1/${id}`);
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
            <div>รายละเอียดรถ</div>
            <div>Name : {data.attributes && data.attributes.namecar}</div>
            <div>
              Car’s engine detail :
              <div className="enginedetail" style={{ fontSize: "19px" }}>
                {data.attributes && data.attributes.description}
              </div>
            </div>
          </div>
          <div className="layout2">
            <div className="detialcar">
              <img
                src={
                  "http://localhost:1337" +
                  data?.attributes?.imgcar?.data?.attributes?.url
                }
              ></img>
            </div>
            <div>
              จำนวนที่เหลือ :{data.attributes && data.attributes.remaining} คัน
            </div>
            <div>
              Price per day : {data.attributes && data.attributes.price} บาท/วัน
            </div>

            <Button className="cheakcar" variant="dark" onClick={Comfirmcar}>
              เช่ารถ
            </Button>
          </div>
        </div>
      </Container>
      <footer></footer>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-white">รายละเอียดการเช่า</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-login">
            <img className="alert" src="/alert.png" />
            <p>ไม่พบบัญชีกรุณาเข้าสู่ระบบนะครับ</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => navigate('/LoginForm')}>
            Login
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DetailsPage;
