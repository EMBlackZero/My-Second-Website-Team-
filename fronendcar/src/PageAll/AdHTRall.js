import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import axios from "axios";
import { Button, Spinner, Modal } from "react-bootstrap";
import "../CssAll/History.css";
import Contact from "./Contact";
import { v4 as uuidv4 } from "uuid";
axios.defaults.baseURL =
  process.env.REACT_APP_BASE_URL || "http://localhost:1337";
const URL_CAR = "/api/cars";
const URL_BOOKING = "/api/bookings";


function AdHTRall() { //แสดงหมด
  const navigate = useNavigate();
  const [dataHistory, setDataHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // เพิ่ม state สำหรับจัดการการแสดง Modal
  const [confirmid, setconfirmid] = useState(); // เพิ่ม state สำหรับจัดการการแสดง Modal

  //ฟังชันดึงข้อมูล
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
        const img = find_img.data.data.attributes.imgcar.data; // รูปรถ
        const img2 = e.attributes.payment.data; // รูปสลิป

        return {
          id: e.id,
          key: e.id,
          image: img,
          payment: img2,
          ...e.attributes,
        };
      });
      const alldata = await Promise.all(maptoSet); // เซ็ตข้อมูลที่จะใชช้ฟิลเตอในอนาคต
      setDataHistory(alldata)
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };


  //เปิดหน้าต่างแก้ไขและเซตค่าไอดีที่แก้
  const edit_reservation = async(id)=>{
    setShowModal(true)
    setconfirmid(id)
    console.log('you will modify booking id',id)
  }

  //Event
  const handlesearch = (txt) => {
    const query = txt;
    if (query === "") {
      // ถ้าว่างๆก็ รีหน้าใหม่
      fetchHistory();
    } else {
      // Filter data based on search query
      const filtered = dataHistory.filter((e) => e.id == txt);

      setDataHistory(filtered);
    }
  };
  const admin_confirm = async(id) =>{
    const response = await axios.put(`${URL_BOOKING}/${id}`, {
      data: { adminconfirm: true },
    });
    console.log(response);
    setShowModal(false);
    fetchHistory();
  }
  const admin_sendback = async(id)=>{
    const response = await axios.put(`${URL_BOOKING}/${id}`, {
      data: { status : true },
    });
    console.log(response);
    setShowModal(false);
    fetchHistory();
  }
  const cancelconfirm = async (id) => {
    const response = await axios.put(`${URL_BOOKING}/${id}`, {
      data: { adminconfirm: false },
    });
    console.log(response);
    setShowModal(false);
    fetchHistory()
  };

  //เฟทช์ข้อมูลตอนเข้าหน้านี้
  useEffect(() => {
    fetchHistory();
  }, []);

  //จัดการ path
  const goto_admin_confirm = () =>{
    navigate('/AdminHistory/confirmed')
  }
  const goto_history_all = () =>{
    navigate('/AdminHistory/allhistory')
  }
  const goto_admin_not_confirm = () =>{
    navigate('/AdminHistory')
  }
  const goto_returned_car = () =>{
    navigate('/AdminHistory/returned')
  }
  const goto_unreturn_car = () =>{
    navigate('/AdminHistory/unreturn')
  }

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
            <Button variant="dark" onClick={goto_history_all}>
            การเช่าทั้งหมด
            </Button>
            <Button variant="light" onClick={goto_admin_not_confirm}>
              รอการยืนยัน
            </Button>
            <Button variant="primary" onClick={goto_admin_confirm}>
              ยืนยันแล้ว
            </Button>
            <Button variant="danger" onClick={goto_unreturn_car} >
              รถที่ยังไม่คืน
            </Button>
            <Button variant="success" onClick={goto_returned_car} >
              คืนแล้ว
            </Button>
            
            
          </div>
        </div>
        <div className="containerHTR">
          <h2>ประวัติการเช่าทั้งหมด</h2>
          
          {dataHistory.map((booking) => (
            <div key={uuidv4()} className="container-Booking">
              <div className="booking-img">
                <img
                  src={
                    "http://localhost:1337" + booking?.image?.attributes?.url
                  }
                ></img>
                <div className="adminconfirm">
                  สถานะการเช่า :{" "}
                  {booking.adminconfirm === true ? (
                    <p className="confirm">ยืนยันแล้ว</p>
                  ) : (
                    <p className="notconfirm">รอการยืนยัน</p>
                  )}
                </div>
              </div>
              <div className="booking-detail">
                <p>หมายเลข : {booking.id}</p>
                <p>รุ่นรถ - ยี่ห้อ : {booking.car.data.attributes.namecar}</p>
                <p>วันที่เริ่มจอง : {booking.startdate}</p>
                <p>วันคืนรถ : {booking.enddate}</p>
                <div className="status">
                  สถานะ :{" "}
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
                      onClick={() => edit_reservation(booking.id)}
                      key={uuidv4()}
                    >
                      จัดการการเช่า
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
          <Modal.Title>ตรวจสอบสลิปโอนเงิน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-login">
            {dataHistory
              .filter((booking) => booking.id === confirmid)
              .map((booking) => (
                <div key={uuidv4()}>
                  <h4>รหัสคำสั่งจอง : {booking.id}</h4>
                  <p>สลิปของลูกค้า</p>
                  <div className="booking-img">
                    <img
                      key={uuidv4()}
                      src={
                        "http://localhost:1337" +
                        booking?.payment?.data.attributes?.url
                      }
                      alt="Payment"
                    />
                  </div>
                </div>
              ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {dataHistory
            .filter((booking) => booking.id === confirmid)
            .map((booking) => (
              <div key={uuidv4()}>
                {/* ถ้ายังไม่ยืนยันจะแสดงปุ่มนี้ */}
                {booking.adminconfirm !== true && (
                  <Button
                    key={uuidv4()}
                    variant="dark"
                    onClick={() => admin_confirm(booking.id)}
                  >
                    ยืนยันการเช่า
                  </Button>
                )}
                {/* ถ้ายืนยันแล้วจะแสดงปุ่มนี้ */}

                {booking.adminconfirm === true && (
                  <Button
                    key={uuidv4()}
                    variant="secondary"
                    onClick={() => cancelconfirm(booking.id)}
                  >
                    ยกเลิกยืนยันการเช่า
                  </Button>
                )}

                {booking.adminconfirm === true && booking.status !== true && (
                  <Button
                    key={uuidv4()}
                    variant="dark"
                    onClick={() => admin_sendback(booking.id)}
                    className="btn-marginleft"
                  >
                    คืนรถ
                  </Button>
                )}

                <Button
                  variant="danger"
                  className="btn-marginleft"
                  onClick={() => setShowModal(false)}
                >
                  ยกเลิก
                </Button>
              </div>
            ))}
        </Modal.Footer>
      </Modal>
      <Contact />
    </div>
  )
}

export default AdHTRall