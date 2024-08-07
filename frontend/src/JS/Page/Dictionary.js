import React from "react";
import TopNav from "../Component/TopNav"
import SpringAnime from "../Component/SpringAnime";
import FadeAnime from "../Component/FadeAnime";

const Dictionary = () => {
  return (
    <FadeAnime>
      <div className="concept-page-wrapper">
        <div className="top-nav">
          <TopNav />
        </div>

        <div className="concept-content-wrapper">
          <SpringAnime from="down">
            <div className="concept-content">
                사전 내용이에요
            </div>
          </SpringAnime>
        </div>
      </div>
    </FadeAnime>
  );
};

export default Dictionary;
