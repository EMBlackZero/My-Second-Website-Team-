import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner, Button, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../CssAll/Public.css";
import Nav from "./Nav";

axios.defaults.baseURL =
  process.env.REACT_APP_BASE_URL || "http://localhost:1337";

const PublicPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:1337/api/cars?populate=*")
      .then(({ data }) => {
        const mapToset = data.data.map((e) => {
          return {
            key: e.id,
            id: e.id,
            ...e.attributes,
            imgcar: e.attributes.imgcar.data.attributes.url,
          };
        });
        setData(mapToset);
        setFilteredData(mapToset); // Initially, set filtered data to all data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handlePriceFilter = () => {
    let apiUrl = "http://localhost:1337/api/cars?populate=*";
    if (minPrice !== "") {
      apiUrl += `&filters[price][$gte]=${minPrice}`;
    }
    if (maxPrice !== "") {
      apiUrl += `&filters[price][$lte]=${maxPrice}`;
    }
    axios
      .get(apiUrl)
      .then(({ data }) => {
        const mapToset = data.data.map((e) => {
          return {
            key: e.id,
            id: e.id,
            ...e.attributes,
            imgcar: e.attributes.imgcar.data.attributes.url,
          };
        });
        setData(mapToset);
        setFilteredData(mapToset); // Update filtered data when price filter is applied
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleCarDetail = (id) => {
    navigate(`/DetailsPage/${id}`);
  };

  const gotologin = () => {
    navigate("/LoginForm");
  };

  const goHistory = () => {
    role === null ? setShowModal(true) : navigate("/History");
  };

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    if (query === "") {
      // If the search query is empty, reset filtered data to all data
      setFilteredData(data);
    } else {
      // Filter data based on search query
      const filtered = data.filter((item) =>
        item.namecar.toLowerCase().includes(query)
      );
      setFilteredData(filtered);
    }
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
        <button onClick={handlePriceFilter} className="btn-infilter">
          Filter
        </button>
      </div>
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by car brand"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
      
      <Button
        className="bookingcar"
        variant="dark"
        onClick={() => goHistory()}
      >
        รายละเอียดการเช่า
      </Button>
      <div className="container">
        <div className="products-con">
          {filteredData.map((item) => (
            <div className="products-item" key={item.id}>
              <div className="products-img">
                <img
                  src={"http://localhost:1337" + item?.imgcar}
                  alt="Car Image"
                ></img>
              </div>
              <div className="name_price">
                <p>{item.namecar}</p>
                <p>{item.price} บาท</p>
              </div>
              <div className="Bcar">
                <Button
                  variant="dark"
                  onClick={() => handleCarDetail(item.id)}
                >
                  ดูรายละเอียดรถ
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer></footer>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-white">
            รายละเอียดการเช่า
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-login">
            <img className="alert" src="/alert.png" alt="Alert" />
            <p>ไม่พบบัญชีกรุณาเข้าสู่ระบบนะครับ</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => gotologin()}>
            Login
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PublicPage;
