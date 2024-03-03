import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spinner, Form } from "react-bootstrap";
import Nav from "./Nav";
import axios from "axios";
import "../CssAll/Historydetail.css";
import StarRatings from 'react-star-ratings';

const URL_CAR = "/api/cars";
const URL_BOOKING = "/api/bookings";

function HistoryDetail() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [havecomment, setHavecomment] = useState(false);
  const [send, setSend] = useState(false);
  const navigate = useNavigate();

  const fetchHistorydetail = async () => {
    try {
      setIsLoading(true);

      const [response] = await Promise.all([
        axios.get(`${URL_BOOKING}/${id}?populate=*`),
      ]);

      const find_img = await axios.get(
        `${URL_CAR}/${response.data.data.attributes.car.data.id}?populate=*`
      );

      const Detailcar = response.data.data.attributes.car.data.attributes;

      const usedata = {
        key: response.data.data.id,
        id: response.data.data.id,
        ...response.data.data.attributes,
        detail: response.data.data.attributes.car.data.attributes.description,
        image: find_img.data.data.attributes.imgcar.data.attributes.url,
      };

      setData(usedata);
      setComment(response.data.data.attributes.comment);
      setRating(response.data.data.attributes.rating);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorydetail();
  }, []);

  useEffect(() => {
    if (data.comment) {
      setHavecomment(true);
    }
  }, [data]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment && rating) {
      await axios.put(
        `${URL_BOOKING}/${id}?populate=*`,
        {
          data: {
            comment: comment,
            rating: rating
          },
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          },
        }
      );
      setSend(true);
    } else {
      console.log('กรุณาใส่ความคิดเห็นและให้คะแนนดาว');
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="spinner-container">
          <Spinner animation="border" variant="secondary" />
        </div>
      )}
      <Nav />
      <button className="buttonback" onClick={() => navigate("/History")}>
        <img src="/back.png" alt="button" />
      </button>
      <div className="history-detail-container">
        <div className="history-detail-detail">
          <h1>History Detail</h1>
          <h2>หมายเลขคำสั่งจอง {data.id}</h2>
          <h4>รายละเอียดรถของท่าน</h4>
          <p>- {data.detail}</p>
        </div>
        <div className="history-datail-image">
          <img src={"http://localhost:1337" + data?.image} alt="Car"></img>
        </div>
      </div>
      <div className="add-comment">
        <div className="form-style-5">
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>
                <span className="number">1</span> แสดงความคิดเห็น
              </legend>
              {havecomment && <p>ความคิดเห็นที่คุณเขียนไว้</p>}
              <textarea
                name="field3"
                placeholder="เขียนความรู้ศึกของคุณหลังจากใช้งานรถคันนี้"
                value={comment}
                onChange={handleCommentChange}
              ></textarea>
            </fieldset>
            <fieldset>
              <legend>
                <span className="number">2</span> ให้คะแนนดาว
              </legend>
              <StarRatings
                rating={rating}
                starRatedColor="#ffb400"
                starHoverColor="#f9c74f"
                changeRating={handleRatingChange}
                numberOfStars={5}
                name='rating'
                starDimension="40px"
                starSpacing="7px"
              />
            </fieldset>
            {havecomment && <input type="submit" value="ส่งใหม่" />}
            {!havecomment && <input type="submit" value="ส่ง" />}
            {send && <h4 className="sended">เราได้รับรีวิวของคุณแล้ว</h4>}
          </form>
        </div>
      </div>
      <footer></footer>
    </div>
  );
}

export default HistoryDetail;
