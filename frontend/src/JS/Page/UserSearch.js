import React, { useState, useEffect } from "react";
import axios from "axios";
import FadeAnime from "../Component/FadeAnime";
import TopNav from "../Component/TopNav";
import SpringAnime from "../Component/SpringAnime";
import "../../CSS/UserSearch.css";
import ranking from "../../Imgs/ranking.gif";
import { API_URL } from '../../config';  // 두 단계 상위 디렉토리로 이동하여 config.js 파일을 임포트

const SERVERURL = API_URL;

const Ranking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearch = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(SERVERURL + `/api/raidu/userpage/list`, {
        params: { nickname: searchTerm },
        headers: { Authorization: `Bearer ${accessToken}` }
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
              <SpringAnime from="up">
                <div id="profile-card-container">
                  {selectedUser ? (
                    <div className="profile-card">
                      <h3>{selectedUser.nickname}</h3>
                      {/* 추가적인 내용을 서버에서 받아올 것 */}
                    </div>
                  ) : (
                    <div className="profile-notchosen">선택한 유저 없음!</div>
                  )}
                </div>
              </SpringAnime>

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
                  users.map((user) => (
                    <div className="search-result-card" key={user.uuid}>
                      <div>{user.nickname}</div>
                      <div>{user.regionId}</div>
                      <div>{user.currentSeasonUserScore}</div>
                      <div>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            document
                              .getElementById("rank-icon")
                              .scrollIntoView({ behavior: "smooth" });
                          }}
                        >
                          프로필 카드
                        </button>
                      </div>
                    </div>
                  ))
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
