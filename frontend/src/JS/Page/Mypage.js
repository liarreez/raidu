import React, { useState } from "react";
import { useEffect } from "react";
import TopNav from "../Component/TopNav";
import FadeAnime from "../Component/FadeAnime";
import SpringAnime from "../Component/SpringAnime";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";


import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import "../../CSS/Mypage.css";

import test from "../../Imgs/test.png";
import burgerking from "../../Imgs/burgerking.png";
import { useParams } from "react-router-dom";

const SERVERURL = "http://localhost:8080";
const expPercentage = 60;

function StepProgressBar() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (percent < expPercentage) {
        setPercent(prevPercent => prevPercent + 1);
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [percent]);

  return (
    <ProgressBar
      percent={percent}
      filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
      unfilledBackground="#3E3A3A"
      width="500px"
      height="10px"
    >
      <Step transition="scale">{({ accomplished }) => <div />}</Step>
      <Step transition="scale">{({ accomplished }) => <div />}</Step>
    </ProgressBar>
  );
}

function Mypage() {
  const uuid = useParams();
  const [activeTab, setActiveTab] = useState("history");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(SERVERURL + `api/raidu/userpage/profile/${uuid}`);
        const jsonData = await response.json();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const renderMonsterCards = () => {
    const monsters = [
      { name: "이름 1", image: burgerking },
      { name: "이름 2", image: burgerking },
      { name: "이름 3", image: burgerking },
      { name: "이름 4", image: burgerking },
      { name: "이름 5", image: burgerking },
      { name: "이름 6", image: burgerking },
    ];

    return (
      <Grid container spacing={2}>
        {monsters.map((monster, index) => (
          <Grid item xs={4} sm={4} md={4} key={index}>
            <Card
              sx={{
                height: "300px",
                borderRadius: "10px",
                boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)",
              }}
            >
              <CardMedia
                component="img"
                height="250px"
                sx={{ objectFit: "contain" }}
                image={monster.image}
                alt={monster.name}
              />
              <CardContent sx={{ padding: "0" }}>
                <Typography
                  gutterBottom
                  component="div"
                  sx={{
                    height: "50px",
                    color: "#F6F6F6",
                    backgroundColor: "#3E3A3A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                >
                  {monster.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderHistory = () => {
    const records = [];
    return (
      <div style={{display: "flex", backgroundColor: "blue", width: "100%", height: "490px"}}>
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "green", flex: 3, padding: "10px"}}>
          
        </div>
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "purple", flex: 2, padding: "10px"}}>

        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (activeTab === "history") {
      return <SpringAnime from="right"><div>{renderHistory()}</div></SpringAnime>;
    } else if (activeTab === "monster") {
      return <SpringAnime from="left"><div>{renderMonsterCards()}</div></SpringAnime>;
    }
  };

  return (
    <FadeAnime>
      <div className="mypage-page-wrapper">
        <div className="top-nav">
          <TopNav />
        </div>

        <div className="mypage-content-wrapper">
          <SpringAnime from="down">
            <div className="mypage-content">
              <div className="content-profile">
                <div className="profile-background-image">
                  <img src={test} alt="프로필 배경" />
                </div>
                <div className="profile-info">
                  <div className="profile-image-wrapper">
                    <div className="profile-image-group">
                      <div className="profile-image-portrait">
                        <img src={burgerking} alt="프로필" />
                      </div>
                      <div className="profile-image-badge">
                        <img src={burgerking} alt="뱃지" />
                      </div>
                    </div>
                  </div>
                  <div className="profile-text-wrapper">
                    <div className="profile-text-name">test_username</div>
                    <div className="profile-text-level">
                      <div>
                        <h2>LV.123</h2>
                      </div>
                      <StepProgressBar />
                      <div>
                        <h3>최고 기록</h3>
                      </div>
                    </div>
                  </div>
                  <div className="profile-button-wrapper">
                    <button>프로필 수정</button>
                  </div>
                </div>
              </div>

              <div className="profile-double-tab">
                <div className="tab-group">
                  <div
                    className={`tab ${activeTab === "history" ? "active" : ""}`}
                    onClick={() => setActiveTab("history")}
                  >
                    히스토리
                  </div>
                  <div
                    className={`tab ${activeTab === "monster" ? "active" : ""}`}
                    onClick={() => setActiveTab("monster")}
                  >
                    몬스터 도감
                  </div>
                </div>

                <div className="tab-content-wrapper">
                  <div className="tab-content" key={activeTab}>
                    {renderTabContent()}
                  </div>
                </div>
              </div>
            </div>
          </SpringAnime>
        </div>
      </div>
    </FadeAnime>
  );
}

export default Mypage;
