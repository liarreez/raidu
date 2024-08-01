import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopNav from "../Component/TopNav";
import FadeAnime from "../Component/FadeAnime";
import "../../CSS/Home.css";
import HomeSlider from "../Component/HomeSlider";
import AnimatedNumber from "../Component/AnimatedNumber";
import NivoBar from "../Component/NivoBar";

import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

import monster from "../../Imgs/monster.gif";
import flag from "../../Imgs/flag.gif";
import test from "../../Imgs/test.png";
import helmet from "../../Imgs/helmet.gif";
import burgerking from "../../Imgs/burgerking.png";

import SpringAnime from "../Component/SpringAnime";
import Rerenderer from "../Component/Rerenderer";
import FirstRenderer from "../Component/FirstRenderer";

// 토벌 현황 서버에서 받아와서 100자리에 담아주면 됩니다.
const raidPercentage = 100;

class StepProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      percent: 0,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState((prevState) => {
        if (prevState.percent < raidPercentage) {
          return { percent: prevState.percent + 1 };
        } else {
          clearInterval(this.interval);
          return null;
        }
      });
    }, 50); // 3초 동안 20% 증가 => 3000ms / 20 = 150ms마다 1% 증가
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <ProgressBar
        percent={this.state.percent}
        filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
        unfilledBackground="linear-gradient(to left, #55108e, #edcfff)"
        width="800px"
        height="20px"
      >
        <Step transition="scale">
          {({ accomplished }) => (
            <div className="ratio-icon">
              <img
                style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                width="60"
                src={monster}
              />
            </div>
          )}
        </Step>
        <Step transition="scale">
          {({ accomplished }) => (
            <div className="ratio-icon">
              <img
                style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                width="50"
                src={flag}
              />
            </div>
          )}
        </Step>
        <Step transition="scale">
          {({ accomplished }) => (
            <div className="ratio-icon">
              <img
                style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                width="60"
                src={monster}
              />
            </div>
          )}
        </Step>
      </ProgressBar>
    );
  }
}

const Main = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = {
      "region" : null
    }
    const fetchUserData = async () => {
      try {
        // const response = await axios.get(""); // 여기에 API 주소 넣을 것
        // const data = response.data;
        // setUser(data);
        if (data.region === null) {
          console.log("region값 비어있음...첫방문 페이지로 전환");
          // navigate("/firstvisit");
        }
      } catch (error) {
        console.error("유저 정보 불러오기 실패...");
        console.log(error);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <FadeAnime>
      <div className="home-page-wrapper">
        <div className="home-topnav">
          <TopNav />
        </div>

        <div className="home-content-wrapper">
          <div className="home-content">
            {/* 사이트 맵 */}
            <div className="home-slider">
              <HomeSlider />
            </div>
            <div className="home-num-container">
              <FirstRenderer>
                <FadeAnime>
                  <AnimatedNumber targetNumber={12345} fontSize={50} />
                </FadeAnime>
              </FirstRenderer>
            </div>

            {/* <- 레이드 / 훈련장 -> */}

            <div className="home-button-group">
              <div className="home-button-left">
                <h3>레이드</h3>
                <img src={test} alt="레이드" />
              </div>

              <div className="home-button-right">
                <h3>훈련장</h3>
                <img src={test} alt="훈련장" />
              </div>
            </div>

            <div className="home-button-icon">
              <img src={helmet} alt="헬멧" />
            </div>

            {/* 현황판 */}
            <div style={{ height: "700px", width: "950px" }}>
              <Rerenderer>
                <SpringAnime>
                  <div className="home-stat-container">
                    <div className="home-season-title">Season1</div>
                    <div className="home-season-content">
                      <div className="content-chart-container">
                        <div className="chart-title">시즌 기여도</div>
                        <div className="chart-chart">
                          <NivoBar />
                        </div>
                        <div className="chart-symbol">
                          <div className="symbol-container"></div>
                        </div>
                      </div>
                      <div className="season-boss-image">
                        <div className="chart-title">시즌 보스</div>
                        <img src={burgerking} alt="시즌 보스" />
                      </div>
                      <div className="season-boss-text">
                        <div className="chart-title">배경</div>
                        <div>도로위에 떨어진 블루베리를 주워먹고 배탈이 났음</div>
                      </div>
                    </div>
                    <div className="home-season-ratio">
                      <div className="chart-title" style={{ marginBottom: "40px" }}>
                        토벌 현황
                      </div>
                      <StepProgressBar />
                    </div>
                  </div>
                </SpringAnime>
              </Rerenderer>
            </div>
          </div>
        </div>
      </div>
    </FadeAnime>
  );
};

export default Main;
