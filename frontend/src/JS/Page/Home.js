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
import training from "../../Imgs/button-training.png";
import raidu from "../../Imgs/button-raidu.png"

import SpringAnime from "../Component/SpringAnime";
import Rerenderer from "../Component/Rerenderer";
import FirstRenderer from "../Component/FirstRenderer";


const SERVERURL = "http://localhost:8080";

const StepProgressBar = ({ raidPercentage }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prevPercent) => {
        if (prevPercent < raidPercentage) {
          return prevPercent + 1;
        } else {
          clearInterval(interval);
          return raidPercentage;
        }
      });
    }, 50); // 3초 동안 20% 증가 => 3000ms / 20 = 150ms마다 1% 증가

    return () => clearInterval(interval);
  }, [raidPercentage]);

  return (
    <ProgressBar
      percent={percent}
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
};

const Main = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 메인페이지 관련 변수들
  const [bossMonsterDescription, setBossMonsterDescription] = useState(null);
  const [bossMonsterHp, setBossMonsterHp] = useState(null);
  const [bossMonsterImg, setBossMonsterImg] = useState(null);
  const [bossMonsterName, setBossMonsterName] = useState(null);
  const [regionScores, setRegionScores] = useState(null);
  const [totalContribute, setTotalContribute] = useState(null);
  const [userCount, setUserCount] = useState(null);
  console.log(totalContribute/bossMonsterHp)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        console.log("사용한 토큰 : " + accessToken);
        const response = await axios.get(SERVERURL + "/api/raidu/userpage", {headers: {"Authorization": `Bearer ${accessToken}`}}); // 여기에 API 주소 넣을 것
        console.log(response);
        // setUser(data);

      } catch (error) {
        console.error("유저 정보 불러오기 실패...");
        console.log(error);
        if(error.response.data.status === 'NOT_FOUND') {
          console.log("첫 방문임...");
          navigate("/firstvisit");
        }
      }
    };

    const fetchPageData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        console.log("사용한 토큰 : " + accessToken);
        const response = await axios.get(SERVERURL + "/api/raidu/mainpage", {headers: {"Authorization": `Bearer ${accessToken}`}}); // 여기에 API 주소 넣을 것
        console.log(response);
        
        console.log("보스몬스터 설명 : " + response.data.data.bossMonsterDescription);
        setBossMonsterDescription(response.data.data.bossMonsterDescription);        
        console.log("보스몬스터 HP : " + response.data.data.bossMonsterHp);
        setBossMonsterHp(response.data.data.bossMonsterHp);
        console.log("보스몬스터 이미지 : " + response.data.data.bossMonsterImg);
        setBossMonsterImg(response.data.data.bossMonsterImg);
        console.log("보스몬스터 이름 : " + response.data.data.bossMonsterName);
        setBossMonsterName(response.data.data.bossMonsterName);
        console.log("지역 점수 : " + response.data.data.regionScores);
        setRegionScores(response.data.data.regionScores);
        console.log("총 기여도 : " + response.data.data.totalContribute);
        setTotalContribute(response.data.data.totalContribute);
        console.log("유저 수 : " + response.data.data.userCount);
        setUserCount(response.data.data.userCount);





      } catch (error) {
        console.error("페이지 정보 불러오기 실패...");
        console.log(error);
      }
    };

    fetchUserData();
    fetchPageData();
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
                  <AnimatedNumber targetNumber={userCount} fontSize={50} />
                </FadeAnime>
              </FirstRenderer>
            </div>

            {/* <- 레이드 / 훈련장 -> */}

            <div className="home-button-group">
              <div className="home-button-left">
                <h3>레이드</h3>
                <img src={raidu} alt="레이드" />
              </div>

              <div className="home-button-right">
                <h3>훈련장</h3>
                <img src={training} alt="훈련장" />
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
                        <div>{bossMonsterDescription}</div>
                      </div>
                    </div>
                    <div className="home-season-ratio">
                      <div className="chart-title" style={{ marginBottom: "40px" }}>
                        토벌 현황
                      </div>
                      <StepProgressBar raidPercentage={(totalContribute/bossMonsterHp)}/>
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
