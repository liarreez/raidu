import React from "react";
import Slider from "react-slick";
import test from "../../Imgs/test.png";
import login1 from "../../Imgs/login_1.png";
import login2 from "../../Imgs/login_2.png";
import login3 from "../../Imgs/login_3.png";
import login4 from "../../Imgs/login_4.png";
import "../../CSS/LoginSlider.css";

function SimpleSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true,
    autoplay: true,
    autoplaySpeed: 6000, // 6초마다 슬라이드 전환
  };
  return (
    <div className="loginslider-container">
      <Slider {...settings}>
        <div className="loginslider-desc">
          <img className="loginslider-desc-img" src={login1}></img>
          <div className="loginslider-desc-text"></div>
        </div>
        <div className="loginslider-desc">
          <img className="loginslider-desc-img" src={login2}></img>
          <div className="loginslider-desc-text"></div>
        </div>
        <div className="loginslider-desc">
          <img className="loginslider-desc-img" src={login3}></img>
          <div className="loginslider-desc-text"></div>
        </div>
        <div className="loginslider-desc">
          <img className="loginslider-desc-img" src={login4}></img>
          <div className="loginslider-desc-text"></div>
        </div>
      </Slider>
    </div>
  );
}

export default SimpleSlider;
