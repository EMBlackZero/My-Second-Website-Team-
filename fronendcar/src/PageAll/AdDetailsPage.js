import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Modal, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import "../CssAll/DetailsPage.css";
import AdminNav from "./AdminNav";
import DeletePage from "./DeletePage";

const AdDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editedData, setEditedData] = useState({
    namecar: "",
    description: "",
    imgcar: "",
    remaining: 0,
    price: 0,
  });
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
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

  const handleEdit = () => {
    // Set edited data to current data
    setEditedData(data.attributes);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('role');
    navigate('/');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:1337/api/cars/${id}`, editedData, config);
      const response = await axios.get(`http://localhost:1337/api/cars/${id}?populate=*`);
      setData(response.data.data);
      setShowModal(false);
    } catch (error) {
      console.error("Error editing data:", error);
    }
  };  

  return (
    <div>
      <AdminNav onlogout={handleLogout} />
      <button className="buttonback" onClick={() => navigate("/AdminPage")}>
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
            <DeletePage id={id} />
            <div className="detialcar">
              <img src={"http://localhost:1337" + data?.attributes?.imgcar?.data?.attributes?.url}></img>
            </div>
            <div>
              จำนวนที่เหลือ :{data.attributes && data.attributes.remaining} คัน
            </div>
            <div>
              Price per day : {data.attributes && data.attributes.price} บาท/วัน
            </div>
            <Button className="cheakcar" variant="dark" onClick={handleEdit}>
              แก้ไข
            </Button>
          </div>
        </div>
      </Container>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Car Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formNameCar">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter car name"
                name="namecar"
                value={editedData.namecar}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter car description"
                name="description"
                value={editedData.description}
                onChange={handleFormChange}
              />
            </Form.Group>
            {/* Add other form fields as needed */}
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdDetailsPage;
