import React from "react";
import FadeAnime from "../Component/FadeAnime";
import TopNav from "../Component/TopNav";
import SpringAnime from "../Component/SpringAnime";
import "../../CSS/Ranking.css";
import ranking from '../../Imgs/ranking.gif'

const Ranking = () => {
  return (
    <FadeAnime>
      <div className="ranking-page-wrapper">
        <div className="top-nav">
          <TopNav />
        </div>

        <div className="ranking-content-wrapper">
          <SpringAnime from="down">
            <div className="ranking-content">
                <div className="icon-circle">
                    <img alt="랭킹 아이콘" src={ranking}></img>
                </div>
                <h2>유저 랭킹</h2>
                <div id="profile-card">
                    
                </div>
            </div>
          </SpringAnime>
        </div>
      </div>
    </FadeAnime>
  );
};

export default Ranking;
