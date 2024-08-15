import React from "react";
import Slider from "react-slick";
import main1 from "../../Imgs/main1.png";
import main2 from "../../Imgs/main2.png";
import tutorial1 from "../../Imgs/tutorial_1.png";
import tutorial2 from "../../Imgs/tutorial_2.png";
import tutorial3 from "../../Imgs/tutorial_3.png";
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
          <img className="homeslider-desc-img" src={main1}></img>
        </div>
        <div className="homeslider-desc">
          <img className="homeslider-desc-img" src={main2}></img>
        </div>
        <div className="homeslider-desc">
          <img className="homeslider-desc-img" src={tutorial1}></img>
        </div>
        <div className="homeslider-desc">
          <img className="homeslider-desc-img" src={tutorial2}></img>
        </div>
        <div className="homeslider-desc">
          <img className="homeslider-desc-img" src={tutorial3}></img>
        </div>
      </Slider>
    </div>
  );
}

export default SimpleSlider;
