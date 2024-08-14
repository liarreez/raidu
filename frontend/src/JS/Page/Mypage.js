import React, { useState, useEffect } from "react";
import TopNav from "../Component/TopNav";
import FadeAnime from "../Component/FadeAnime";
import SpringAnime from "../Component/SpringAnime";
import Calender from "../Component/Calender";
import ExerciseRecord from "../Component/ExerciseRecord";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import "../../CSS/Mypage.css";
import "../../CSS/Calendar.css";
import "../../CSS/ExerciseRecord.css";

import test from "../../Imgs/test.png";
import { useParams } from "react-router-dom";
import AnimatedNumber from "../Component/AnimatedNumber";
import { API_URL } from "../../config"; // 두 단계 상위 디렉토리로 이동하여 config.js 파일을 임포트

import burgerking from "../../Imgs/burgerking.png";
import turtleneck from "../../Imgs/turtleneck.png";
import diabeticlizard from "../../Imgs/diabeticlizard.png";
import enteritisowl from "../../Imgs/enteritisowl.png";
import fatiguebat from "../../Imgs/fatiguebat.png";
import gloomylion from "../../Imgs/gloomylion.png";
import dryeyecrab from "../../Imgs/dryeyecrab.png";
import foodpoisoningwhale from "../../Imgs/foodpoisoningwhale.png";
import lowtemperaturewolf from "../../Imgs/lowtemperaturewolf.png";
import MigraineMedusa from "../../Imgs/MigraineMedusa.png";
import mountainsicknesseagle from "../../Imgs/mountainsicknesseagle.png";
import forgetfulduck from "../../Imgs/forgetfulduck.png";

import region_cliff from "../../Imgs/region_cliff.jpg";
import region_desert from "../../Imgs/region_desert.jpg";
import region_forest from "../../Imgs/region_forest.jpg";
import region_sea from "../../Imgs/region_sea.jpg";

const SERVERURL = API_URL;

// 몬스터 명에 따른 이미지 매핑
const monsterImages = {
  burgerking: burgerking,
  turtleneck: turtleneck,
  diabeticlizard: diabeticlizard,
  enteritisowl: enteritisowl,
  fatiguebat: fatiguebat,
  gloomylion: gloomylion,
  dryeyecrab: dryeyecrab,
  foodpoisoningwhale: foodpoisoningwhale,
  lowtemperaturewolf: lowtemperaturewolf,
  MigraineMedusa: MigraineMedusa,
  mountainsicknesseagle: mountainsicknesseagle,
  forgetfulduck: forgetfulduck,
};

const monsterNames = {
  burgerking: "비마니우스 3세",
  turtleneck: "거북목거북",
  diabeticlizard: "당뇨마뱀",
  enteritisowl: "뿡엉이",
  fatiguebat: "피곤 박쥐",
  gloomylion: "우울 사자",
  dryeyecrab: "건조하 게",
  foodpoisoningwhale: "식중독 고래",
  lowtemperaturewolf: "춥개",
  MigraineMedusa: "메두통사",
  mountainsicknesseagle: "고산증 독수리",
  forgetfulduck: "오?리?"
};

function StepProgressBar({ expPercentage }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (percent < expPercentage) {
        setPercent((prevPercent) => prevPercent + 1);
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [percent, expPercentage]);

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
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("history");
  const [userData, setUserData] = useState(null);
  const [userMonsters, setUserMonsters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dayRecords, setDayRecords] = useState([]); // 기록 데이터를 상태로 관리

  // 기록 데이터 setRecords 를 바꾸고, 그 상태를 바로 보여주기 위한 함수
  const changeRecord = (exerciseRoomRecordResponseDtos) => {
    setDayRecords((prevRecord) => {
      const nowDateReord = exerciseRoomRecordResponseDtos;

      console.log("제대로 레코드에 넣어줬는가?", nowDateReord);
      return nowDateReord;
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("fetchData 함수 실행 중... id값은 : " + id);
        const accessToken = localStorage.getItem("accessToken");
        console.log(accessToken);
        const response = await axios.get(SERVERURL + `/api/raidu/userpage/profile/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log("데이터 수신...");
        console.log(response);
        setUserData(response.data.data.userProfile);
        setUserMonsters(response.data.data.userMonsters);
        setLoading(false); // 데이터가 로드된 후 로딩 상태를 false로 설정
      } catch (error) {
        console.error("Error fetching data:", error);
        // if(error.response.data.message === "액세스 토큰이 만료되었습니다!") {
        //   alert("토큰 만료! 다시 로그인 해주세요.");
        //   navigate("/login");
        // }
      }
    };

    fetchData();
  }, [id]);

  const fetchRecordData = async (selectedDate) => {
    try {
      console.log(selectedDate);
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${SERVERURL}/api/raidu/userpage/recordcheck/${id}?time=${selectedDate}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log("Record data:", response.data.data.data.exerciseRoomRecordResponseDtos);
      changeRecord(response.data.data.data.exerciseRoomRecordResponseDtos);
    } catch (error) {
      console.error("Error fetching record data:", error);
    }
  };

  // userMonsters 데이터를 사용하여 몬스터 카드 렌더링
  const renderMonsterCards = () => {
    if (!userMonsters) return null;

    // bossMonsterResponseDtos와 monsterResponseDtos를 결합하여 하나의 배열로 만든다.
    const monsters = [
      // ...(userMonsters.bossMonsterResponseDtos || []),
      ...(userMonsters.monsterResponseDtos || []),
    ];
    console.log("몬스터들 배열...");
    console.log(monsters);

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
                image={monsterImages[monster.name]} // 이미지 매핑
                alt={monsterNames[monster.name]} // 몬스터 이름 매핑
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
                  {monsterNames[monster.name]} {/* 몬스터 이름 */}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderHistory = () => {
    return (
      <div style={{ display: "flex", width: "100%", height: "490px" }}>
        <div
          className="calendar-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 3,
            padding: "10px",
          }}
        >
          <Calender onDateChange={fetchRecordData} />{" "}
          {/* Calender 컴포넌트에 날짜 변경 핸들러 전달 */}{" "}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column", // 자식 요소들을 세로로 배치
            alignItems: "center",
            justifyContent: "flex-start", // 스크롤이 위에서부터 시작하게 설정
            flex: 2,
            backgroundColor: "#F6F6F6",
            padding: "10px",
            overflowY: "auto", // 스크롤을 추가
            maxHeight: "470px", // 최대 높이를 지정하여 스크롤 영역 설정
          }}
        >
          {dayRecords.length > 0 ? (
            dayRecords.map((record, index) => <ExerciseRecord key={index} record={record} />)
          ) : (
            <div
              style={{
                margin: "auto",
                color: "#948B8B",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  border: "2px solid #948B8B",
                }}
                src={turtleneck}
                alt="데이터 없음 이미지"
              ></img>
              <div>- 데이터가 없습니다 -</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (activeTab === "history") {
      return (
        <SpringAnime from="right">
          <div>{renderHistory()}</div>
        </SpringAnime>
      );
    } else if (activeTab === "monster") {
      return (
        <SpringAnime from="left">
          <div>{renderMonsterCards()}</div>
        </SpringAnime>
      );
    }
  };

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 상태일 때 표시할 내용
  }

  const expPercentage = (userData.exp / 750) * 100;
  const currentEmail = localStorage.getItem("curEmail");
  console.log(currentEmail);
  const showEditButton = userData.email === currentEmail;

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
                    <div className="profile-text-name">{userData.nickname}</div>
                    <div className="profile-text-level">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "end",
                          marginTop: "10px",
                          marginBottom: "20px",
                        }}
                      >
                        <div style={{ display: "inline", fontWeight: "bold", fontSize: "16px" }}>
                          LV
                        </div>
                        <h2 style={{ margin: "0", padding: "0" }}>&nbsp; {`${userData.level}`}</h2>
                        <div style={{ color: "gray", marginLeft: "20px", fontSize: "14px" }}>
                          <AnimatedNumber targetNumber={userData.exp} /> / 750
                        </div>
                      </div>
                      <StepProgressBar expPercentage={expPercentage} />
                      <div>
                        <h3>최고 기록</h3>
                        <div>{userData.bestScore > 0 ? userData.bestScore : "기록 없음"}</div>
                      </div>
                    </div>
                  </div>
                  <div className="profile-button-wrapper">
                    {showEditButton && (
                      <button onClick={() => navigate("/editprofile")}>정보 수정</button>
                    )}
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
