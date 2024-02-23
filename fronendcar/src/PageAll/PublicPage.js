import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal, Row } from "react-bootstrap";
import "../CssAll/Public.css";
import Nav from "./Nav";

const PublicPage = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false); // เพิ่ม state สำหรับจัดการการแสดง Modal
  const role = sessionStorage.getItem('role')
  const navigate = useNavigate();
  const [refresh,setrefresh] = useState(true)
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/cars?populate=*")
      .then(({ data }) => setData(data.data))
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(()=>{
      console.log('role',role)
      console.log('data',data);
  },[data])
  

  const handleCarDetail = (id) => {
    navigate(`/DetailsPage/${id}`);
  };
  const goHistory = () =>{
    navigate('/History')
  }

  return (
    <>   
      <Nav/>
      <Button
        className="bookingcar"
        variant="dark"
        onClick={() => goHistory()}
      >
        รายละเอียดการเช่า
      </Button>
      <div className="container">
        <div className="products-con">
          {data.map((item) => (
            <div className="products-item" key={item.id}>
              <div className="products-img">
                <img
                  src={
                    "http://localhost:1337" +
                    item?.attributes?.imgcar?.data?.attributes?.url
                  }
                  alt="Car Image"
                ></img>
              </div>
              <div className="car">
                <div className="namecar">{item.attributes.namecar}</div>
                <div className="pricecar"> {item.attributes.price}</div>
                {/*<div className="pricecar"> {item.attributes.imgcar.data.attributes.url}</div>*/}

                <div className="pric2ecar"> บาท</div>
              </div>
              <div className="Bcar">
                <Button variant="dark" onClick={() => handleCarDetail(item.id)}>
                  ดูรายละเอียดรถ
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-white">
            รายละเอียดการเช่า
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>sgdfgdfgfgdfg</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PublicPage;