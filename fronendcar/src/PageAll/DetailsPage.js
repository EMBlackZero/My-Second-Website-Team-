import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import "../CssAll/DetailsPage.css";
import Nav from "./Nav";
import MemberNav from "./MemberNav";
import AdminNav from "./AdminNav";
import PublicNav from "./PublicNav";
import Contact from "./Contact";
import Slide from "./Slide";
import StarRatings from "react-star-ratings";

import Breadcrumb from "react-bootstrap/Breadcrumb";
const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataU, setDataU] = useState([]);
  const [datastar, setDatastar] = useState();

  const [showModal, setShowModal] = useState(false); // เพิ่ม state สำหรับจัดการการแสดง Modal
  const [showModal1, setShowModal1] = useState(false); // เพิ่ม state สำหรับจัดการการแสดง Modal

  const role = sessionStorage.getItem("role");
  const user = sessionStorage.getItem("username");
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/cars/${id}?populate=*`);
        setData(response.data.data);
        const responU = await axios.get(
          `/api/cars/${id}?populate=bookings.user.username`
        );

        setDataU(responU.data.data);
        const ratings = responU.data.data.attributes?.bookings?.data.map(
          (d) => d.attributes.rating 
        );

        const averageRating =
          ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

        setDatastar(averageRating);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);
  console.log(data);
  console.log(dataU);
  console.log(datastar);

  const Comfirmcar = () => {
    sessionStorage.setItem("wrap", `/Comfirmcar1/${id}`);
    role === null ? setShowModal(true) : navigate(`/Comfirmcar1/${id}`);
  };

  return (
    <div>
      <Nav />
      <div className="content">
        <div className="backmenu">
          <button className="buttonback" onClick={() => navigate("/")}>
            <img src="/back.png" />
          </button>
          <Breadcrumb>
            <Breadcrumb.Item href="/">หน้าหลัก</Breadcrumb.Item>
            <Breadcrumb.Item active>รายละเอียด</Breadcrumb.Item>
            <Breadcrumb.Item active style={{ color: "lightgray" }}>
              เลือกช่วงเวลา
            </Breadcrumb.Item>
            <Breadcrumb.Item active style={{ color: "lightgray" }}>
              ชำระเงิน
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Container className="detialpage">
          <div className="layoutobj">
            <div className="layout1">
              <div>รายละเอียดรถ</div>
              <div>Name : {data.attributes && data.attributes.namecar}</div>
              <div>
                Car’s engine detail :{" "}
                <Button onClick={() => setShowModal1(true)}>ตำหนิ</Button>
                <div className="enginedetail" style={{ fontSize: "19px" }}>
                  {data.attributes && data.attributes.description}
                </div>
              </div>
              <div>Comment: <StarRatings
                  rating={datastar}
                  starRatedColor="#ffb400"
                  starHoverColor="#f9c74f"
                  numberOfStars={5}
                  name="rating"
                  starDimension="40px"
                  starSpacing="8px"
                /> </div>
              <div class="comment-wrapper">
                {dataU?.attributes?.bookings?.data.map(
                  (booking) =>
                    booking.attributes.comment !== null && (
                      <textarea
                        rows="2"
                        cols="20"
                        id="comment"
                        className="insCom"
                        key={booking.id}
                        readOnly
                      >
                        {`${booking.attributes.user.data.attributes.username} : ${booking.attributes.comment}`}
                      </textarea>
                    )
                )}
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
                Price per day : {data.attributes && data.attributes.price}{" "}
                บาท/วัน
              </div>

              <Button className="cheakcar" variant="dark" onClick={Comfirmcar}>
                เช่ารถ
              </Button>
            </div>
          </div>
        </Container>
        <Contact></Contact>
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
            <Button variant="dark" onClick={() => navigate("/LoginForm")}>
              Login
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showModal1} onHide={() => setShowModal1(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-white">รายละเอียดการเช่า</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-login">
              <Slide id={id} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal1(false)}>
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default DetailsPage;
