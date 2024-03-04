import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Modal, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import "../CssAll/DetailsPage.css";
import Nav from "./Nav";
import DeletePage from "./DeletePage";
import AdEditeCar from "./AdEditeCar";
import Contact from "./Contact";

const AdDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataU, setDataU] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
        const responU = await axios.get(`/api/cars/${id}?populate=bookings.user.username`);
        setDataU(responU.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Nav />
      <div className="content">
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
              <div>
              Comment:
              </div>
              <div class="comment-wrapper">
              {dataU?.attributes?.bookings?.data.map((booking) => (
              <textarea rows="2" cols="20" id="comment" className="insCom" key={booking.id} readOnly>
                {`${booking.attributes.user.data.attributes.username}: ${booking.attributes.comment}`}
                </textarea>
              ))}
              </div>
            </div>
            <div className="layout2">
              <DeletePage id={id} />
              <div className="detialcar">
                <img
                  src={
                    "http://localhost:1337" +
                    data?.attributes?.imgcar?.data?.attributes?.url
                  }
                ></img>
              </div>
              <div>
                จำนวนที่เหลือ :{data.attributes && data.attributes.remaining}{" "}
                คัน
              </div>
              <div>
                Price per day : {data.attributes && data.attributes.price}{" "}
                บาท/วัน
              </div>
              <AdEditeCar className="cheakcar" id={id} แก้ไข />
            </div>
          </div>
        </Container>
      </div>
      <Contact/>
    </div>
  );
};

export default AdDetailsPage;
