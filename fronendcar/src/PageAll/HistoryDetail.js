import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Spinner } from "react-bootstrap";
import Nav from "./Nav";
import axios from "axios";
import "../CssAll/Historydetail.css";
import Form from "react-bootstrap/Form";

const URL_CAR = "/api/cars";
const URL_BOOKING = "/api/bookings";

function HistoryDetail() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [havecomment, setHavecomment] = useState(false)
  const [send,setSend] = useState(false)
  const navigate = useNavigate();

  const fetchHistorydetail = async () => {
    try {
      setIsLoading(true);

      const [response] = await Promise.all([
        axios.get(`${URL_BOOKING}/${id}?populate=*`),
      ]);
      console.log("response", response.data.data);
      const find_img = await axios.get(
        `${URL_CAR}/${response.data.data.attributes.car.data.id}?populate=*`
      );
      console.log(
        "findimage",
        find_img.data.data.attributes.imgcar.data.attributes.url
      );

      const Detailcar = response.data.data.attributes.car.data.attributes;

      console.log("response", response.data.data);
      console.log("detail", Detailcar.description);
      console.log(
        "find_img",
        find_img.data.data.attributes.imgcar.data.attributes.url
      );

      const usedata = {
        key: response.data.data.id,
        id: response.data.data.id,
        ...response.data.data.attributes,
        detail: response.data.data.attributes.car.data.attributes.description,
        image: find_img.data.data.attributes.imgcar.data.attributes.url,
      };
      console.log("data", usedata);
      setData(usedata);
      setComment(response.data.data.attributes.comment)
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
    console.log("data", data);
    if (data.comment){
      console.log('you comment',data.comment)
      setHavecomment(true)
    }else{
      console.log('Not comment')
    }
  }, [data]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment){
      axios.put(
        `${URL_BOOKING}/${id}?populate=*`,
        { data: { comment: comment } },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          },
        }
      );
      console.log("Submitted comment:", comment);
      setSend(true)
    }else{
      console.log('please comment')
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
              {havecomment === true && <p className="commented">ความคิดเห็นที่คุณเขียนไว้ !</p> }
              <textarea
                name="field3"
                placeholder="เขียนความรู้ศึกของคุณหลังจากใช้งานรถคันนี้"
                value={comment} // Bind the value of the textarea to the comment state
                onChange={handleCommentChange} // Handle change in textarea
              ></textarea>
            </fieldset>
            
            {havecomment === true && <input type="submit" value="ส่งใหม่" /> }
            {havecomment === false && <input  type="submit" value="ส่ง" /> }
            {send === true && <h4 className="sended">เราได้รับรีวิวของคุณแล้ว</h4>}
          </form>
          
        </div>
        
      </div>
      

      <footer></footer>
    </div>
  );
}

export default HistoryDetail;
