import React from "react";
import Slider from "react-slick";
import test from "../../Imgs/test.png";
import "../../CSS/HomeSlider.css";

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
    <div className="homeslider-container">
      <Slider {...settings}>
        <div className="homeslider-desc">
          <img className="homeslider-desc-img" src={test}></img>
        </div>
        <div className="homeslider-desc">
          <img className="homeslider-desc-img" src={test}></img>
        </div>
        <div className="homeslider-desc">
          <img className="homeslider-desc-img" src={test}></img>
        </div>
      </Slider>
    </div>
  );
}

export default SimpleSlider;
