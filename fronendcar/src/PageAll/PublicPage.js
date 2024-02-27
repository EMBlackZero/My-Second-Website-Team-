import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap"; 
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import "../CssAll/Public.css";
import Nav from "./Nav";


axios.defaults.baseURL =
  process.env.REACT_APP_BASE_URL || "http://localhost:1337";
  
const PublicPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // เพิ่ม state สำหรับจัดการการแสดง Modal
  const role = sessionStorage.getItem("role");
  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");

  const navigate = useNavigate();

  
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:1337/api/cars?populate=*")
      .then(({ data }) => {
        console.log('data.data',data.data)
        const mapToset = data.data.map((e)=>{
            return {
              key:e.id,
              id: e.id,
              ...e.attributes,
              imgcar : e.attributes.imgcar.data.attributes.url
            }
        })
        setData(mapToset)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  

  useEffect(() => {
    console.log("role", role);
    console.log("data", data);
  }, [data,role]);

  const handlePriceFilter = () => {
    if (maxPrice === "" && minPrice === "") {
      axios
        .get("http://localhost:1337/api/cars?populate=*")
        .then(({ data }) => {
          const mapToset = data.data.map((e)=>{
            return {
              key:e.id,
              id: e.id,
              ...e.attributes,
              imgcar : e.attributes.imgcar.data.attributes.url
            }
          })
          setData(mapToset)
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
      return; // Moved the return statement here to ensure it's executed after making the API call
    }

    axios
      .get(
        `http://localhost:1337/api/cars?filters[price][$lte]=${maxPrice}&filters[price][$gte]=${minPrice}&populate=*`
      )
      .then(({ data }) => {
        const mapToset = data.data.map((e)=>{
          return {
            key:e.id,
            id: e.id,
            ...e.attributes,
            imgcar : e.attributes.imgcar.data.attributes.url
          }
        })
        setData(mapToset);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    console.log("yyyyy");
  };

  const handleCarDetail = (id) => {
    navigate(`/DetailsPage/${id}`);
  };

  const gotologin = () =>{
    navigate('/LoginForm')
  }

  const goHistory = () => {
      role === null ? setShowModal(true) : navigate("/History");
  };

  return (
    <div>
      {isLoading && (
        <div className="spinner-container">
          <Spinner animation="border" variant="secondary" />
        </div>
      )}
      <Nav />
      <div className="price-filter">
        <div className="item-infilter">minimum price: </div>
        <input
          type="text"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="item-infilter"
        />
        <div className="item-infilter">maximum price: </div>
        <input
          type="text"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="item-infilter"
        />
        <button onClick={handlePriceFilter} className="btn-infilter">Filter</button>
      </div>

      <Button className="bookingcar" variant="dark" onClick={() => goHistory()}>
        รายละเอียดการเช่า
      </Button>
      <div className="container">
        <div className="products-con">
          {data.map((item) => (
            <div className="products-item" key={item.id}>
              <div className="products-img">
                <img
                  src={
                    "http://localhost:1337" + item?.imgcar}
                  alt="Car Image"
                ></img>
              </div>
              {/* <div className="car">
                <div className="namecar">{item.attributes.namecar}</div>
                <div className="pricecar"> {item.attributes.price}</div>
                <div className="pricecar"> {item.attributes.imgcar.data.attributes.url}</div>

                <div className="pric2ecar"> บาท</div>
              </div> */}
              <div className="name_price">
                <p>{item.namecar}</p>
                <p>{item.price} บาท</p>
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
      <footer></footer>
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
          <Button variant="dark" onClick={() => gotologin()}>Login</Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PublicPage;
