import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../CssAll/Public.css";

const PublicPage = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
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
  console.log(data);

  const handleCarDetail = (id) => {
    navigate(`/DetailsPage/${id}`);
  };

  return (
    <>
      <div class="navbar">
        <h1 className="titel">รถเช่าผมไม่เล็กนะครับ</h1>
        <div className="titelogin">
          <a href="/CreateAccount">
            <h1>สมัครสมาชิก</h1>
          </a>
          <a href="/LoginForm">
            <h1>เข้าสู่ระบบ</h1>
          </a>
        </div>
      </div>
      <Button className="bookingcar" variant="dark">
        รายละเอียดการเช่า
      </Button>
      <div className="container">
        <div className="products-con">
          {data.map((item) => (
            <div className="products-item" key={item.id}>
              <div className="products-img">
                <img src={item.attributes.imglink} alt="Car Image"></img>
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
                </Button>{" "}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PublicPage;
