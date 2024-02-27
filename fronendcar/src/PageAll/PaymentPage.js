import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useNavigate, useParams } from "react-router-dom";
import "../CssAll/PaymentCss.css";
import Nav from "./Nav";

function PaymentPage(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const CarDetail = (id) => {
    navigate(`/DetailsPage/${id}`);
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [imageFile, setImageFile] = useState(null);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };
  const handleSaveChanges = async (e) => {
    e.preventDefault();

    try {
      // Upload the image to Strapi
      const formData = new FormData();
      formData.append("files", imageFile);

      const uploadResponse = await axios.post(
        "http://localhost:1337/api/upload",
        formData
      );
      const fileId = uploadResponse.data[0].id;

      // Create or update the car entry in Strapi
      const formData2 = {
        payment: parseInt(fileId),
      };


      const putResponse = await axios.put(
        `http://localhost:1337/api/bookings/${id}?populate=*`,
        { data: formData2 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      console.log('asd',putResponse.data.data.attributes.car.data.id)
      //decrease_remaining
      const remaining = await axios.get(
        `http://localhost:1337/api/cars/${putResponse.data.data.attributes.car.data.id}/decrease_remaining`,config
        
      );
      
      handleClose();
    } catch (error) {
      console.error("Error saving changes:", error);
      // Handle errors here
    }
  };

  return (
    <div>
      <Nav/>
      <div>
        <button className="buttonback" onClick={() => CarDetail(id)}>
          <img src="/back.png" />
        </button>
      </div>
      <div className="paytitle">
        <h2>เลือกช่องทางการจ่ายเงิน</h2>
      </div>

      <div className="button-container">
        <button class="image-button" onClick={() => handleShow()}>
          <img src="/creditcard.png"></img>
          <span>บัตรเครดิต/เดบิต/มาสเตอร์การ์ด (ชำระออนไลน์)</span>
        </button>

        <button class="image-button" onClick={() => handleShow()}>
          <img src="/money.png"></img>
          <span>เงินสด (ชำระหน้าร้าน)</span>
        </button>
      </div>
      <footer></footer>
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
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default PaymentPage;
