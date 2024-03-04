import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import axios from "axios";
import { Button, Spinner, Modal } from "react-bootstrap";
import "../CssAll/History.css";
import Contact from "./Contact";

axios.defaults.baseURL =
  process.env.REACT_APP_BASE_URL || "http://localhost:1337";
const URL_CAR = "/api/cars";
const URL_BOOKING = "/api/bookings";

function AdHistory() {
  const navigate = useNavigate();
  const [dataHistory, setDataHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // เพิ่ม state สำหรับจัดการการแสดง Modal
  const [confirmid, setconfirmid] = useState(); // เพิ่ม state สำหรับจัดการการแสดง Modal

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
        const img2 = e.attributes.payment.data;

        return {
          id: e.id,
          key: e.id,
          image: img,
          payment: img2,
          ...e.attributes,
        };
      });
      setDataHistory(await Promise.all(maptoSet)); // เซ็ตข้อมูลที่จะใชช้ฟิลเตอในอนาคต
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
  const filteradminstatus = () => {
    const confirm = dataHistory.filter((e) => {
      return e.status === true;
    });
    console.log("nc", confirm);
    setDataforfilter(confirm);
  };
  const allpurchase = () => {
    setDataforfilter(dataHistory);
  };
  const adminconfirm = async (t, id, st) => {
    console.log(id);
    if (t === true) {
      setShowModal(t);
      setconfirmid(id);
    } else if (t === false && st === "1") {
      console.log(confirmid);
      setShowModal(false);
      await axios.put(`${URL_BOOKING}/${confirmid}`, {
        data: {
          adminconfirm: true,
        },
      });
    } else if (t === false && st === "2") {
      console.log(confirmid);
      setShowModal(false);
      await axios.put(`${URL_BOOKING}/${confirmid}`, {
        data: {
          status: true,
        },
      });
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    //เตรียมข้อมูลเสร็จเรียบร้อยมาหาว่าอันไหนรอคอนเฟิมเพื่อแสดงผล
    console.log("datahistory", dataHistory);
    const notconfirm = dataHistory.filter((e) => {
      //ตอนโหลดมาครั้งแรกเซตเป็นยังไม่คอนเฟิมเอาไว้
      return e.adminconfirm !== true;
    });
    console.log("nc", notconfirm);
    setDataforfilter(notconfirm);
  }, [dataHistory]);
  const handlesearch = (txt) => {
    const query = txt;
    if (query === '') {
      // If the search query is not a number or empty, reset filtered data to all data
      setDataforfilter(dataHistory);
    } else {
      // Filter data based on search query
      const filtered = dataHistory.filter((e) => e.id == txt);

      setDataforfilter(filtered);
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="spinner-container">
          <Spinner animation="border" variant="secondary" />
        </div>
      )}
      <Nav at={"1"} onSearch={handlesearch} />
      <div className="content">
        <div className="Topmenu">
          <div className="backmenu">
            <button
              className="buttonback"
              onClick={() => navigate("/AdminPage")}
            >
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
            <Button variant="primary" onClick={filteradminstatus}>
              คืนแล้ว
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
                  src={
                    "http://localhost:1337" + booking?.image?.attributes?.url
                  }
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
                <p>ID : {booking.id}</p>
                <p>Name : {booking.car.data.attributes.namecar}</p>
                <p>Start : {booking.startdate}</p>
                <p>End : {booking.enddate}</p>
                <div className="status">
                  status :{" "}
                  {booking.status === false ? (
                    <p className="notReturn">ยังไม่คืน</p>
                  ) : (
                    <p className="Return">คืนแล้ว</p>
                  )}
                </div>
                <p>ผู้เช่า : {booking.user.data.attributes.username}</p>
                <div>
                  {
                    <Button
                      className="review-btn"
                      variant="dark"
                      onClick={() => adminconfirm(true, booking.id)}
                    >
                      ยืนยันสถานะ
                    </Button>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-white">รายละเอียดการเช่า</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-login">
            {dataforfilter
              .filter((booking) => booking.id === confirmid)
              .map((booking) => (
                <div className="booking-img">
                  <img
                    key={booking.id}
                    src={
                      "http://localhost:1337" +
                      booking?.payment?.data.attributes?.url
                    }
                    alt="Payment"
                  />
                </div>
              ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => adminconfirm(false, "", "1")}>
            ยืนยันการเช่า
          </Button>
          <Button variant="dark" onClick={() => adminconfirm(false, "", "2")}>
            คืนรถ
          </Button>
          <Button variant="danger" onClick={() => setShowModal(false)}>
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>
      <Contact />
    </div>
  );
}

export default AdHistory;
