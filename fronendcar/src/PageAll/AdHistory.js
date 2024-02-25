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

function AdHistory() {
  const navigate = useNavigate()
  const [dataHistory, setDataHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
      setDataHistory(await Promise.all(maptoSet));
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
  }, [dataHistory]);

  return (
    <div>
      {isLoading && (
        <div className="spinner-container">
          <Spinner animation="border" variant="secondary" />
        </div>
      )}
      <Nav />
      <button className="buttonback" onClick={() => navigate("/AdminPage")}>
        <img src="/back.png" />
      </button>
      <div className="containerHTR">
        <h2>History</h2>
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
                status : {booking.status === false ? "ยังไม่คืน" : "คืนแล้ว"}
              </p>
              <p>ผู้เช่า : {booking.user.data.attributes.username}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdHistory;
