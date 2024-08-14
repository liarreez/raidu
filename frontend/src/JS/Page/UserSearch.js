import React, { useState, useEffect } from "react";
import axios from "axios";
import FadeAnime from "../Component/FadeAnime";
import TopNav from "../Component/TopNav";
import SpringAnime from "../Component/SpringAnime";
import "../../CSS/UserSearch.css";
import ranking from "../../Imgs/ranking.gif";
import { API_URL } from "../../config"; // 두 단계 상위 디렉토리로 이동하여 config.js 파일을 임포트
import { useNavigate } from "react-router-dom";
import FirstRenderer from "../Component/FirstRenderer"

import icon_cliff from "../../Imgs/icon_cliff.png";
import icon_desert from "../../Imgs/icon_desert.png";
import icon_forest from "../../Imgs/icon_forest.png";
import icon_sea from "../../Imgs/icon_sea.png";

const SERVERURL = API_URL;

const Ranking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(SERVERURL + `/api/raidu/userpage/list`, {
        params: { nickname: searchTerm },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(response);
      if (response.data.status === "OK") {
        setUsers(response.data.data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error(error);
      setUsers([]);
    }
  };

  const getRegionDetails = (regionId) => {
    switch (regionId) {
      case 1:
        return { name: "근력의 절벽", icon: icon_cliff };
      case 2:
        return { name: "인내력의 사막", icon: icon_desert };
      case 3:
        return { name: "민첩의 숲", icon: icon_forest };
      case 4:
        return { name: "유연의 바다", icon: icon_sea };
      default:
        return { name: "알 수 없는 지역", icon: "" };
    }
  };

  return (
    <FadeAnime>
      <div className="ranking-page-wrapper">
        <div className="top-nav">
          <TopNav />
        </div>

        <div className="ranking-content-wrapper">
          <SpringAnime from="down">
            <div className="ranking-content">
              <div className="icon-circle" id="rank-icon">
                <img alt="랭킹 아이콘" src={ranking}></img>
              </div>
              <h2>유저 검색</h2>

              <div className="title-bar">
                <div>유저 리스트</div>
                <div className="search-option">
                  <input
                    type="text"
                    placeholder="찾는 유저 닉네임"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button onClick={handleSearch}>검색</button>
                </div>
              </div>

              <div className="search-result-header">
                <div>닉네임</div>
                <div>지역</div>
                <div>누적 기여도</div>
                <div>상세 정보</div>
              </div>
              <div className="search-result-container">
                {users.length === 0 ? (
                  <div className="no-results">검색 결과가 없습니다. 유저를 검색해주세요.</div>
                ) : (
                  users.map((user) => {
                    const regionDetails = getRegionDetails(user.regionId);
                    return (
                      <FirstRenderer>
                      <SpringAnime from="left">
                        <div className="search-result-card" key={user.uuid}>
                          <div>{user.nickname}</div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                              }}
                            >
                              <img
                                className="result-card-img"
                                alt="지역 이미지"
                                src={regionDetails.icon}
                              ></img>
                              {regionDetails.name}
                            </div>
                          </div>
                          <div>{user.currentSeasonUserScore}</div>
                          <div>
                            <button
                              onClick={() => {
                                console.log(navigate(`/mypage/${user.id}`));
                              }}
                            >
                              마이페이지 방문
                            </button>
                          </div>
                        </div>
                      </SpringAnime>
                      </FirstRenderer>
                    );
                  })
                )}
              </div>
            </div>
          </SpringAnime>
        </div>
      </div>
    </FadeAnime>
  );
};

export default Ranking;
