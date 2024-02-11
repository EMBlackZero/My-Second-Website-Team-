import React from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import "../CssAll/Public.css";

const PublicPage = () => {
  return (
    <>
      <div class="navbar">
        <h1 className="titel">รถเช่าผมไม่เล็กนะครับ</h1>
        <div className="titelogin">
          <a href="/LoginForm">
            <h1 >สมัครสมาชิก</h1>
          </a>
          <a href="/LoginForm">
            <h1 >เข้าสู่ระบบ</h1>
          </a>
        </div>
      </div>
      <Button className="bookingcar" variant="dark">
        รายละเอียดการเช่า
      </Button>
      <div className="container">
        <div className="products-con">
          <div className="products-item">
            <div className="products-img">
              <img src="https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&height=900&width=1600&fit=bounds"></img>
            </div>
            <div className="namecar">เฟอรารี่</div>
            <div className="pricecar">
              <button></button>
            </div>
          </div>
          <div className="products-item">
            <div className="products-img">
              <img src="https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&height=900&width=1600&fit=bounds"></img>
            </div>
            <div className="namecar">เฟอรารี่</div>
            <div className="pricecar">
              <button></button>
            </div>
          </div>
          <div className="products-item">
            <div className="products-img">
              <img src="https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&height=900&width=1600&fit=bounds"></img>
            </div>
            <div className="namecar">เฟอรารี่</div>
            <div className="pricecar">
              <button></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicPage;
