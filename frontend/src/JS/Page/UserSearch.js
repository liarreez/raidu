import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FadeAnime from "../Component/FadeAnime";
import TopNav from "../Component/TopNav";
import SpringAnime from "../Component/SpringAnime";
import "../../CSS/UserSearch.css";
import ranking from "../../Imgs/ranking.gif";

const testUsers = [
  { id: 1, nickname: "user1", region: "대충 지역", contribution: 120 },
  { id: 2, nickname: "user10", region: "대충지역", contribution: 98 },
  { id: 3, nickname: "user11", region: "대충지역", contribution: 150 },
  { id: 4, nickname: "user12", region: "대충지역", contribution: 80 },
  { id: 5, nickname: "user13", region: "대충지역", contribution: 75 },
];

const Ranking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchUsers = () => {
    const filteredUsers = testUsers.filter((user) =>
      user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const paginatedUsers = filteredUsers.slice((page - 1) * 5, page * 5);
    setUsers((prevUsers) => [...prevUsers, ...paginatedUsers]);
    if (paginatedUsers.length === 0 || paginatedUsers.length < 5) setHasMore(false);
  };

  const handleSearch = () => {
    setUsers([]);
    setPage(1);
    setHasMore(true);
    fetchUsers();
  };

  useEffect(() => {
    if (page > 1) fetchUsers();
  }, [page]);

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
                      등등..추가적인 내용을 서버에서 받아올 것
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

              <InfiniteScroll
                dataLength={users.length}
                next={() => setPage((prevPage) => prevPage + 1)}
                hasMore={hasMore}
              >
                <div className="search-result-container">
                  {users.length === 0 ? (
                    <div className="no-results">검색 결과가 없습니다. 유저를 검색해주세요.</div>
                  ) : (
                    users.map((user) => (
                      <div className="search-result-card" key={user.id}>
                        <div>{user.nickname}</div>
                        <div>{user.region}</div>
                        <div>{user.contribution}</div>
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
              </InfiniteScroll>
            </div>
          </SpringAnime>
        </div>
      </div>
    </FadeAnime>
  );
};

export default Ranking;
