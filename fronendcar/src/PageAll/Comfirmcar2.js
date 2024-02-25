import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../CssAll/DetailsPage.css";
import Nav from "./Nav";

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [renterInfo, setRenterInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [totalDays, setTotalDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/cars/${id}?populate=*`
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRenterInfo({ ...renterInfo, [name]: value });
  };

  const handleSubmit = () => {
    console.log(renterInfo);
    navigate(`/PaymentPage/${id}`, { state: { totalPrice } });
  };

  const calculateTotalDays = () => {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setTotalDays(diffDays);
    const totalPrice = (data.attributes && data.attributes.price) * diffDays;
    setTotalPrice(totalPrice);
  };

  return (
    <div>
      <Nav />
      <button className="buttonback" onClick={() => navigate("/PublicPage")}>
        <img src="/back.png" alt="Back" />
      </button>
      <Container className="detialpage">
        <div className="layoutobj">
          <div className="layout1">
            <div>รายจำนวนวันในการเช่า</div>
            <Form>
              <Form.Group>
                <Form.Label>เลือกวันที่เช่ารถ</Form.Label>
                <div>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd/MM/yyyy"
                    className="custom-datepicker"
                  />
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="dd/MM/yyyy"
                    onBlur={calculateTotalDays}
                    className="custom-datepicker"
                  />
                </div>
              </Form.Group>

              <Button variant="dark" onClick={handleSubmit}>
                ยืนยัน
              </Button>
            </Form>
          </div>
          <div className="layout2">
            <div className="detialcar">
              <img src={"http://localhost:1337" + data?.attributes?.imgcar?.data?.attributes?.url} alt="Car" />
            </div>
            <div>
              Price per day : {data.attributes && data.attributes.price} บาท/วัน
            </div>
            <div>
              Total days: {totalDays}
            </div>
            <div>
              Total price: {totalPrice} บาท
            </div>
          </div>
        </div>
      </Container>
      <footer></footer>
    </div>
  );
};

export default DetailsPage;
