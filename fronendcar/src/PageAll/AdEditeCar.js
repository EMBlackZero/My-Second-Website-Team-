import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useNavigate, useParams } from "react-router-dom";
const AdEditeCar = ({ id }) => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [carName, setCarName] = useState("");
  const [carDescription, setCarDescription] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [quantityLeft, setQuantityLeft] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // useEffect สำหรับดึงข้อมูลรถจากเซิร์ฟเวอร์
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/cars/${id}?populate=*`
        );
        const fetchedData = response.data.data;
        setData(fetchedData);
        setCarName(fetchedData.attributes.namecar);
        setCarDescription(fetchedData.attributes.description);
        setCarPrice(fetchedData.attributes.price);
        setQuantityLeft(fetchedData.attributes.remaining);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  // ฟังก์ชัน handleImageChange สำหรับจัดการเมื่อมีการเลือกรูปภาพใหม่
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  // ฟังก์ชัน handlecarName สำหรับจัดการเมื่อมีการเปลี่ยนแปลงชื่อรุ่นรถ
  const handlecarName = (event) => {
    setCarName(event.target.value);
  };

  // ฟังก์ชัน handlecarDescription สำหรับจัดการเมื่อมีการเปลี่ยนแปลงรายละเอียดรถ
  const handlecarDescription = (event) => {
    setCarDescription(event.target.value);
  };

  // ฟังก์ชัน handlecarPrice สำหรับจัดการเมื่อมีการเปลี่ยนแปลงราคารถ
  const handlecarPrice = (event) => {
    setCarPrice(event.target.value);
  };

  // ฟังก์ชัน handlequantityLeft สำหรับจัดการเมื่อมีการเปลี่ยนแปลงจำนวนที่เหลือของรถ
  const handlequantityLeft = (event) => {
    setQuantityLeft(event.target.value);
  };

  // ฟังก์ชัน handleSaveChanges สำหรับบันทึกข้อมูลหลังจากทำการแก้ไข
  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const formData = {
      namecar: carName,
      description: carDescription,
      price: parseInt(carPrice),
      remaining: parseInt(quantityLeft),      
    };

    try {
      const response = await axios.put(
        `http://localhost:1337/api/cars/${id}?populate=*`,
        { data: formData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      // สามารถทำต่อได้เช่นแสดงข้อความบันทึกสำเร็จ หรือปิด Modal
    } catch (error) {
      console.error("Error creating entry:", error);
      // จัดการข้อผิดพลาดที่เกิดขึ้น
    }
    window.location.reload();
    handleClose();
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        แก้ไข
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
            ปิด
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            บันทึก
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdEditeCar;
