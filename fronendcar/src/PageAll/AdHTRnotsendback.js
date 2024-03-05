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


function AdHTRnotsendback() { //หน้านี้จะโชวที่ยังไม่ส่งคืน
  return (
    <div>AdHTRnotsendback</div>
  )
}

export default AdHTRnotsendback