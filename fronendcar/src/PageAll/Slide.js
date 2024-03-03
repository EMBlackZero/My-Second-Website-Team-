import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import { useParams } from "react-router-dom";
import axios from "axios";

const Slide = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/cars/${id}?populate=*`
        );
        setData(response.data.data.attributes.imgslide);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      <Carousel>
        {data.data?.map((item) => (
          <Carousel.Item key={item.id}>
            <img
              className="d-block w-100"
              src={"http://localhost:1337" + item?.attributes?.url}
              alt={`Slide `}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
};

export default Slide;
