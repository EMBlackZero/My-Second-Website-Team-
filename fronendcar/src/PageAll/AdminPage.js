import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import "../CssAll/Public.css";
import AdcreateCar from "./AdcreateCar";
import Nav from "./Nav";

const AdminPage = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/cars?populate=*", config)
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
      });
  }, []);
  
  useEffect(()=>{
    console.log('data',data);
  },[data])
  

  const handleCarDetail = (id) => {
    navigate(`/AdDetailsPage/${id}`);
  };
  const GotoHistory = () => {
    navigate('/AdminHistory');
  };
  // getdatafromnav
  const handlesearch=(txt)=>{
    console.log('adminpage get from serch',txt)
  }

  return (
    <>
      <Nav onSearch={handlesearch}/>
      <Button
        className="bookingcar"
        variant="dark"
        onClick={() => GotoHistory()}
      >
        ประวัติรถที่เช่าทั้งหมด
      </Button>
      <AdcreateCar/>

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
                <div className="namecar">{item.namecar}</div>
                <div className="pricecar"> {item.price}</div>
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
    </>
  );
};

export default AdminPage;
