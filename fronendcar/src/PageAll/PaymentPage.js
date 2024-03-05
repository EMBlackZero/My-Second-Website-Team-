import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useNavigate, useParams } from "react-router-dom";
import "../CssAll/PaymentCss.css";
import Nav from "./Nav";
import Contact from "./Contact";
import Breadcrumb from "react-bootstrap/Breadcrumb";

function PaymentPage(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    if (file && allowedTypes.includes(file.type)) {
      setImageFile(file);
    } else {
      alert("Please select a valid image file (JPEG or PNG).");
      event.target.value = null;
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("files", imageFile);

      const uploadResponse = await axios.post(
        "http://localhost:1337/api/upload",
        formData
      );

      const fileId = uploadResponse.data[0].id;

      const formData2 = {
        payment: parseInt(fileId),
      };

      const putResponse = await axios.put(
        `http://localhost:1337/api/bookings/${id}?populate=*`,
        { data: formData2 },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          },
        }
      );

      const remaining = await axios.get(
        `http://localhost:1337/api/cars/${putResponse.data.data.attributes.car.data.id}/decrease_remaining`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          },
        }
      );

      handleClose();
      navigate(`/SuccessfulPayment/${id}`);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const backtoCarDetail = () => {
    axios.delete(`http://localhost:1337/api/bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
      },
    });
    const cardetailPage_previous = sessionStorage.getItem("wrap")
    navigate(cardetailPage_previous);
  };

  return (
    <div>
      <Nav />
      <div className="content">
        <div className="backmenu">
          <button className="buttonback" onClick={backtoCarDetail}>
            <img src="/back.png" alt="Back" />
          </button>
          <Breadcrumb>
            <Breadcrumb.Item href="/">หน้าหลัก</Breadcrumb.Item>
            <Breadcrumb.Item href={`/DetailsPage/${id}`}>
              รายละเอียด
            </Breadcrumb.Item>
            <Breadcrumb.Item onClick={backtoCarDetail}>เลือกช่วงเวลา</Breadcrumb.Item>
            <Breadcrumb.Item active>ชำระเงิน</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="paytitle">
          <h2>เลือกช่องทางการชำระเงิน</h2>
        </div>

        <div className="button-container">
          <button className="image-button" onClick={handleShow}>
            <img src="/creditcard.jpg" alt="Credit Card" />
            <span>บัตรเครดิต / เดบิต / มาสเตอร์การ์ด</span>
          </button>

          <button className="image-button" onClick={handleShow}>
            <img src="/money.jpg" alt="Cash" />
            <span>เงินสด (ต้องจ่ายค่ามัดจำ 1000 บาท)</span>
          </button>
        </div>

        <Contact />

        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>หลักฐานการชำระเงิน</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="qr-code">
                <img
                  src="/myqr.jpg"
                  alt="qr-code"
                  style={{ width: "400px", height: "400px" }}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="imageFile">
                <Form.Control type="file" onChange={handleImageChange} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              ปิด
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              บันทึก
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default PaymentPage;
