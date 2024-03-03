import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Form, Modal } from "react-bootstrap"; // Import Form from react-bootstrap
import React, { useState, useEffect } from "react";
import "../CssAll/DetailsPage.css";
import Nav from "./Nav";
import MemberNav from "./MemberNav";
import AdminNav from "./AdminNav";
import PublicNav from "./PublicNav";
import Contact from "./Contact";

const Comfirmcar1 = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [Length, setLength] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const idu = sessionStorage.getItem("iduser");

  const [renterInfo, setRenterInfo] = useState({
    startdate: "",
    enddate: "",
    Total: "",
    car: parseInt(id),
    user: parseInt(idu),
  });
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
          `http://localhost:1337/api/cars/${id}?populate=*`
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);
  //console.log(data.attributes.bookings.data);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setRenterInfo({ ...renterInfo, [name]: value });
  };
  const Check = () => {
    const filteredData = data.attributes.bookings.data.filter(
      (item) =>
        (new Date(renterInfo.startdate) <=
          new Date(item.attributes.startdate) &&
          new Date(renterInfo.enddate) >=
            new Date(item.attributes.startdate)) ||
        (new Date(renterInfo.startdate) <= new Date(item.attributes.enddate) &&
          new Date(renterInfo.enddate) >= new Date(item.attributes.enddate)) ||
        (new Date(renterInfo.startdate) <= new Date(item.attributes.enddate) &&
          new Date(renterInfo.enddate) <= new Date(item.attributes.enddate)) &&
          item.attributes.status === false
    );
    setLength(filteredData.length === undefined ? 0 : filteredData.length);
  };
  console.log("test", Length);

  const handleSubmit = () => {
    // Convert start date and end date strings to Date objects
    const startDate = new Date(renterInfo.startdate);
    const endDate = new Date(renterInfo.enddate);

    // Calculate the difference in milliseconds
    const differenceMs = endDate - startDate;

    // Convert milliseconds to days
    const differenceDays = differenceMs / (1000 * 60 * 60 * 24);

    // Calculate the total price
    const totalPrice =
      (data.attributes && data.attributes.price) * differenceDays;

    // Set the Total value in the renterInfo state
    setRenterInfo({ ...renterInfo, Total: totalPrice });

    console.log("Difference in days:", differenceDays);
    setShow(true);
  };
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      // Upload the image to Strapi

      const carResponse = await axios.post(
        `http://localhost:1337/api/bookings`,
        { data: renterInfo },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          },
        }
      );

      console.log(
        "Car entry created/updated successfully:",
        carResponse.data.data.id
      );

      navigate(`/PaymentPage/${carResponse.data.data.id}`);
    } catch (error) {
      console.error("Error saving changes:", error);
      // Handle errors here
    }
  };

  return (
    <div>
      <Nav />
      <div className="content">
      <button className="buttonback" onClick={() => navigate("/")}>
        <img src="/back.png" />
      </button>
      <Container className="detialpage">
        <div className="layoutobj">
          <div className="layout1">
            <div>รายละเอียดข้อมูลเพื่อเช่ารถ</div>
            <Form>
              <Form.Group controlId="date">
                <Form.Label>เริ่ม</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="โปรดกรอก เลือกวันที่"
                  name="startdate"
                  value={renterInfo.startdate}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="date">
                <Form.Label>สิ้นสุด</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="โปรดกรอก เลือกวันที่"
                  name="enddate"
                  disabled={renterInfo.startdate === ""}
                  value={renterInfo.enddate}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Button
                variant="dark"
                disabled={renterInfo.enddate === ""}
                onClick={() => Check()}
                style={{ display: "block", margin: "auto", marginTop: "21px" }}
              >
                เช็คจำนวนรถ
              </Button>

              <Button
                variant="dark"
                disabled={
                  (data.attributes && data.attributes.remaining) - Length > 0
                    ? false
                    : true
                }
                onClick={handleSubmit}
                style={{ display: "block", margin: "auto", marginTop: "21px" }}
              >
                ตกลง
              </Button>
            </Form>
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
              จำนวนที่เหลือ:{" "}
              {isNaN((data.attributes && data.attributes.remaining) - Length)
                ? " "
                : (data.attributes && data.attributes.remaining) - Length < 0
                ? 0
                : (data.attributes && data.attributes.remaining) - Length}{" "}
              คัน
            </div>
            <div>
              Price per day : {data.attributes && data.attributes.price} บาท/วัน
            </div>
          </div>
        </div>
      </Container>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>ราคารวม</Modal.Title>
        </Modal.Header>
        <Modal.Body>ราคารวมทั้งหมด{renterInfo.Total}บาท</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ยกเลิก
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            ยืนยัน
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
      <Contact/>
      
    </div>
  );
};

export default Comfirmcar1;
