import React from "react";
import Slider from "react-slick";
import test from "../../Imgs/test.png";
import "../../CSS/LoginSlider.css";

function SimpleSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true
  };
  return (
    <div className="loginslider-container">
      <Slider {...settings}>
        <div className="loginslider-desc">
          <img className="loginslider-desc-img" src={test}></img>
          <div className="loginslider-desc-text"></div>
        </div>
        <div className="loginslider-desc">
          <img className="loginslider-desc-img" src={test}></img>
          <div className="loginslider-desc-text"></div>
        </div>
        <div className="loginslider-desc">
          <img className="loginslider-desc-img" src={test}></img>
          <div className="loginslider-desc-text"></div>
        </div>
      </Slider>
    </div>
  );
}

export default SimpleSlider;
