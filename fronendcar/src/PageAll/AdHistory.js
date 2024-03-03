import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import axios from "axios";
import { Button, Spinner } from "react-bootstrap";
import "../CssAll/History.css";
import Contact from "./Contact";

axios.defaults.baseURL =
  process.env.REACT_APP_BASE_URL || "http://localhost:1337";
const URL_CAR = "/api/cars";
const URL_BOOKING = "/api/bookings";

function AdHistory() {
  const navigate = useNavigate()
  const [dataHistory, setDataHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataforfilter, setDataforfilter] = useState([]);

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
      setDataforfilter(await Promise.all(maptoSet)); //ตอนโหลดมาครั้งแรกเซตทั้งหมดเอาไว้
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteradminnotconfirm = () => {
    const notconfirm = dataHistory.filter((e) => {
      return e.adminconfirm !== true;
    });
    console.log("nc", notconfirm);
    setDataforfilter(notconfirm);
  };
  const filteradminconfirm = () => {
    const confirm = dataHistory.filter((e) => {
      return e.adminconfirm === true;
    });
    console.log("nc", confirm);
    setDataforfilter(confirm);
  };
  const allpurchase = () => {
    setDataforfilter(dataHistory);
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
      <div className="content">
      <div className="Topmenu">
          <div className="backmenu">
            <button className="buttonback" onClick={() => navigate("/AdminPage")}>
              <img src="/back.png" />
            </button>
          </div>
          <div className="filtermenu">
            <Button variant="light" onClick={filteradminnotconfirm}>
              รอการยืนยัน
            </Button>
            <Button variant="primary" onClick={filteradminconfirm}>
              ยืนยันแล้ว
            </Button>
            <Button variant="dark" onClick={allpurchase}>
              คำสั่งซื้อทั้งหมด
            </Button>
          </div>
        </div>
      <div className="containerHTR">
        <h2>History</h2>
        {dataforfilter.map((booking) => (
          <div key={booking.id} className="container-Booking">
            <div className="booking-img">
              <img
                src={"http://localhost:1337" + booking?.image?.attributes?.url}
              ></img>
              <div className="adminconfirm">
                  สถานะคำสั่งซื้อ :{" "}
                  {booking.adminconfirm === true ? (
                    <p className="confirm">ยืนยันแล้ว</p>
                  ) : (
                    <p className="notconfirm">รอการยืนยัน</p>
                  )}
                </div>
            </div>
            <div className="booking-detail">
              <p>Name : {booking.car.data.attributes.namecar}</p>
              <p>Start : {booking.startdate}</p>
              <p>End : {booking.enddate}</p>
              <div className="status">
                status : {" "}
                  {booking.status === false ? (
                    <p className="notReturn">ยังไม่คืน</p>
                  ) : (
                    <p className="Return">คืนแล้ว</p>
                  )}
              </div>
              <p>ผู้เช่า : {booking.user.data.attributes.username}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
      <Contact/>
    </div>
  );
}

export default AdHistory;
