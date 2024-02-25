import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import axios from "axios";
import { Button, Spinner } from "react-bootstrap";
import "../CssAll/History.css";

axios.defaults.baseURL =
  process.env.REACT_APP_BASE_URL || "http://localhost:1337";
const URL_CAR = "/api/cars";
const URL_BOOKING = "/api/bookings";

function History() {
  const navigate = useNavigate()
  const [dataHistory, setDataHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const iduser = sessionStorage.getItem('iduser')

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${URL_BOOKING}?populate=*`);
      console.log("response", response.data.data);
      const maptoSet = response.data.data.map(async (e) => {
        const find_img = await axios.get(
          `${URL_CAR}/${e.attributes.car.data.id}?populate=*`
        );
        console.log("find_img", find_img.data.data.attributes.imgcar.data);
        const img = find_img.data.data.attributes.imgcar.data;
        return {
          id: e.id,
          key: e.id,
          image: img,
          ...e.attributes,
        };
      });
      
      const alldata = await Promise.all(maptoSet)
      const filter = alldata.filter((e)=> {
        return e.user.data.id === parseInt(iduser)
      })
      console.log('filter',filter)
      setDataHistory(filter);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    console.log("datahistory", dataHistory);
    console.log('iduser',iduser)
  }, [dataHistory]);

  return (
    <div>
      {isLoading && (
        <div className="spinner-container">
          <Spinner animation="border" variant="secondary" />
        </div>
      )}
      <Nav />
      <button className="buttonback" onClick={() => navigate("/PublicPage")}>
        <img src="/back.png" />
      </button>
      <div className="containerHTR">
        <h2>Your History</h2>
        {dataHistory.map((booking) => (
          <div key={booking.id} className="container-Booking">
            <div className="booking-img">
              <img
                src={"http://localhost:1337" + booking?.image?.attributes?.url}
              ></img>
            </div>
            <div className="booking-detail">
              <p>Name : {booking.car.data.attributes.namecar}</p>
              <p>Start : {booking.startdate}</p>
              <p>End : {booking.enddate}</p>
              <p>
                Where :{" "}
                <a href="https://maps.app.goo.gl/ymMhmqjas8LMjVtf8">
                  เปิดในเเมพ
                </a>
              </p>
              <p>
                status : {booking.status === false ? "ยังไม่คืน" : "คืนแล้ว"}
              </p>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
