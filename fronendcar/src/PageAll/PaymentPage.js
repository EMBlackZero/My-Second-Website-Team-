import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate,useParams } from "react-router-dom";
import "../CssAll/PaymentCss.css"


function PaymentPage(props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const CarDetail = (id) => {
        navigate(`/DetailsPage/${id}`);   
    };
    
    return (
        <div>
            <div className="navbar">
                <a href='/PublicPage' className="titel">รถเช่าผมไม่เล็กนะครับ</a>
                <div className="titelogin">
                    <a href="/">
                        <h1>Profile</h1>
                    </a>
                    <button onClick={props.onlogout}>Logout</button>

                </div>
            </div>
            <div>
                <button className="buttonback" onClick={() => CarDetail(id)} >
                    <img src="/back.png" />
                </button>
            </div>
            <div className="paytitle">
                <h2>เลือกช่องทางการจ่ายเงิน</h2>
            </div>

            <div className="button-container">
                <button class="image-button">
                    <img src="/creditcard.png" ></img>
                    <span>บัตรเครดิต/เดบิต/มาสเตอร์การ์ด (ชำระออนไลน์)</span>
                </button>

                <button class="image-button">
                    <img src="/money.png" ></img>
                    <span>เงินสด (ชำระหน้าร้าน)</span>
                </button></div>


        </div>



    );
}
export default PaymentPage