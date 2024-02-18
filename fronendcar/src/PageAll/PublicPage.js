import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import "../CssAll/Public.css";
import Nav from "./Nav";

const PublicPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // เพิ่ม state สำหรับจัดการการแสดง Modal
  const role = sessionStorage.getItem('role')
  const navigate = useNavigate();
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };

  const fetchdataHome = async () => {
    try {
      setIsLoading(true);
      axios
      .get("http://localhost:1337/api/cars?populate=*")
      .then(({ data }) => setData(data.data))

    }catch (error) {
      console.error("Error fetching announce detail:", error);
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
    fetchdataHome()
  }, []);

  useEffect(()=>{
      console.log('role',role)
      console.log('data',data);
  },[data,role])
  

  const handleCarDetail = (id) => {
    navigate(`/DetailsPage/${id}`);
  };
  const goHistory = () =>{
    navigate('/History')
  }

  return (
    <>   
    {isLoading && (
        <div className="spinner-container">
          <Spinner animation="border" variant="secondary" />
        </div>
      )}


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
      <footer></footer>
      
    </>
  );
};

export default PublicPage;
