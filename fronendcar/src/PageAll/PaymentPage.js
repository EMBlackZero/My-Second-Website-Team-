import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useNavigate, useParams } from "react-router-dom";
import "../CssAll/PaymentCss.css";
import Nav from "./Nav";
import Contact from "./Contact";

function PaymentPage(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
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

  const CarDetail = () => {
    axios.delete(`http://localhost:1337/api/bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
      },
    });
    navigate(sessionStorage.getItem("wrap"));
  };

  return (
    <div>
      <Nav />
      <div className="content">
      <div>
        <button className="buttonback" onClick={CarDetail}>
          <img src="/back.png" alt="Back" />
        </button>
      </div>
      <div className="paytitle">
        <h2>เลือกช่องทางการชำระเงิน</h2>
      </div>

      <div className="button-container">
        <button className="image-button" onClick={handleShow}>
          <img src="/creditcard.png" alt="Credit Card" />
          <span>บัตรเครดิต/เดบิต/มาสเตอร์การ์ด (ชำระออนไลน์)</span>
        </button>

        <button className="image-button" onClick={handleShow}>
          <img src="/money.png" alt="Cash" />
          <span>เงินสด (ชำระหน้าร้าน)</span>
        </button>
      </div>

      <Contact/>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>หลักฐานการชำระเงิน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
