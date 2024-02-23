import { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

const AdcreateCar = ({ id }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [carName, setCarName] = useState("");
  const [carDescription, setCarDescription] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [quantityLeft, setQuantityLeft] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };
  console.log(imageFile);
  const handlecarName = (event) => {
    setCarName(event.target.value);
  };

  const handlecarDescription = (event) => {
    setCarDescription(event.target.value);
  };

  const handlecarPrice = (event) => {
    setCarPrice(event.target.value);
  };

  const handlequantityLeft = (event) => {
    setQuantityLeft(event.target.value);
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
        namecar: carName,
        description: carDescription,
        price: parseInt(carPrice),
        remaining: parseInt(quantityLeft),
        imgcar: parseInt(fileId),
      };

      const carResponse = await axios.post(
        `http://localhost:1337/api/cars`,
        { data: formData2 },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          },
        }
      );

      console.log("Car entry created/updated successfully:", carResponse.data);

      handleClose();
    } catch (error) {
      console.error("Error saving changes:", error);
      // Handle errors here
    }
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        เพิ่มรถ
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>รายละเอียด</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="carName">
              <Form.Label>ชื่อรุ่น</Form.Label>
              <Form.Control
                type="text"
                placeholder="ชื่อรุ่น"
                value={carName}
                onChange={handlecarName}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="carDescription">
              <Form.Label>รายละเอียดภายใน</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="รายละเอียดภายใน"
                value={carDescription}
                onChange={handlecarDescription}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="carPrice">
              <Form.Label>ราคา</Form.Label>
              <Form.Control
                type="number"
                placeholder="ราคา"
                value={carPrice}
                onChange={handlecarPrice}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="quantityLeft">
              <Form.Label>จำนวนที่เหลือ</Form.Label>
              <Form.Control
                type="number"
                placeholder="จำนวนที่เหลือ"
                value={quantityLeft}
                onChange={handlequantityLeft}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="imageFile">
              <Form.Label>รูปรถ</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdcreateCar;
