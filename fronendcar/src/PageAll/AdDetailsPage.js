import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Modal, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import "../CssAll/DetailsPage.css";
import AdminNav from "./AdminNav";
import DeletePage from "./DeletePage";
import AdEditeCar from "./AdEditeCar";

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
            <AdEditeCar className="cheakcar" variant="dark" onClick={handleEdit} id={id}
              แก้ไข
           />
          </div>
        </div>
      </Container>
     
    </div>
  );
};

export default AdDetailsPage;
