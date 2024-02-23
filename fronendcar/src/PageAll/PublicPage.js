import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal, Row } from "react-bootstrap";
import "../CssAll/Public.css";
import Nav from "./Nav";

const PublicPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // เพิ่ม state สำหรับจัดการการแสดง Modal
  const role = sessionStorage.getItem("role");
  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");

  const navigate = useNavigate();

  const [refresh, setrefresh] = useState(true);
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };

  useEffect(() => {
    try {
      setIsLoading(true);
      axios
        .get("http://localhost:1337/api/cars?populate=*")
        .then(({ data }) => setData(data.data))
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } catch (error) {
      console.error("Error in useEffect:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("role", role);
    console.log("data", data);
  }, [data]);

  const handlePriceFilter = () => {
    if (maxPrice === "" && minPrice === "") {
      axios
        .get("http://localhost:1337/api/cars?populate=*")
        .then(({ data }) => setData(data.data))
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
        setData(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    console.log("yyyyy");
  };

  const handleCarDetail = (id) => {
    navigate(`/DetailsPage/${id}`);
  };
  const goHistory = () => {
    navigate("/History");
  };

  return (
    <>
      <Nav />
      <div className="price-filter">
        <row>minimum price: </row>
        <input
          type="text"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <row>maximum price: </row>
        <input
          type="text"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button onClick={handlePriceFilter}>Filter</button>
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-white">รายละเอียดการเช่า</Modal.Title>
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
