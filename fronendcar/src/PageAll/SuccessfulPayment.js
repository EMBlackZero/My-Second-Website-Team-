import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import Nav from "./Nav";
import axios from "axios";
import "../CssAll/Historydetail.css";

const URL_CAR = "/api/cars";
const URL_BOOKING = "/api/bookings";

function SuccessfulPayment() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSuccessfulPayment = async () => {
    try {
      setIsLoading(true);

      const [response] = await Promise.all([
        axios.get(`${URL_BOOKING}/${id}?populate=*`),
      ]);

      const findImg = await axios.get(
        `${URL_CAR}/${response.data.data.attributes.car.data.id}?populate=*`
      );

      const detailCar = response.data.data.attributes.car.data.attributes;

      const usedata = {
        key: response.data.data.id,
        id: response.data.data.id,
        ...response.data.data.attributes,
        detail: response.data.data.attributes.car.data.attributes.description,
        image: findImg.data.data.attributes.imgcar.data.attributes.url,
      };

      setData(usedata);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuccessfulPayment(); // corrected function call
  }, []);

  return (
    <div>
      {isLoading && (
        <div className="spinner-container">
          <Spinner animation="border" variant="secondary" />
        </div>
      )}
      <Nav />
      <div className="content">
        <div className="history-detail-container">
          <div className="history-detail-detail">
            <h1>ชำระเงินเสร็จสิ้น</h1>
            <h2>หมายเลขคำสั่งจอง {data.id}</h2>
            <h4>ราคาทั้งหมด {data.Total} บาท</h4>
            {data.startdate && data.enddate && (
              <h4>
                ระยะเวลาทั้งหมด{" "}
                {(new Date(data.enddate).getTime() -
                  new Date(data.startdate).getTime()) /
                  (1000 * 3600 * 24)}{" "}
                วัน
              </h4>
            )}
            <p>- {data.detail}</p>
          </div>
          <div className="history-datail-image">
            <img src={"http://localhost:1337" + data?.image} alt="Car" />
          </div>
          <div className="button-container">
            <Button variant="dark" onClick={() => navigate("/History")}>
              ไปหน้าประวัติการเช่ารถ
            </Button>
            <Button variant="dark" onClick={() => navigate("/PublicPage")}>
              กลับหน้าหลัก
            </Button>
          </div>
        </div>
      </div>

      <footer></footer>
    </div>
  );
}

export default SuccessfulPayment;
