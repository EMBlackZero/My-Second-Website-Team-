import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "../CssAll/SuccessPaymentCss.css";
import Nav from "./Nav";

function SuccessfulPaymentPage(props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const CarDetail = (id) => {
        navigate(`/DetailsPage/${id}`);
    };

    const config = {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
        },
    };


    return (
        <div>
            <Nav />

            <div className="paytitle">
                <h2>ใบเสร็จการจองรถเช่า</h2>
            </div>
            <div className="title">
                <h1>ขั้นตอนการจองรถเช่าเสร็จสิ้น</h1>
            </div>
            <div>
                <h4>ท่านได้ทำการจองรถเช่าเรียบร้อยเเล้ว กรุณานำใบเสร็จนี้มาเเสดงก่อนรับรถ</h4>
                
            </div>
            <div>
                <button className="buttonback" onClick={() => CarDetail(id)}>
                    กลับสู่หน้าหลัก
                </button>
            </div>
        </div>
    );
}
export default SuccessfulPaymentPage;
