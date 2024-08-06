import React from "react";
// 컴포넌트 import
import FadeAnime from "../Component/FadeAnime";
import SpringAnime from "../Component/SpringAnime";
import TopNav from "../Component/TopNav";
import Rerenderer from "../Component/Rerenderer"
// CSS 관련 import
import '../../CSS/ConceptBook.css'
import '../../CSS/BasicAnime.css'

// ====================================================== //

const ConceptBook = () => {
  return (
    <FadeAnime>
      <div className="concept-page-wrapper">
        <div className="top-nav">
          <TopNav />
        </div>

        <div className="concept-content-wrapper">
          <SpringAnime from="down">
            <div className="concept-content">
                <div className="focus-in-contract">
                    1번 내용....
                </div>
            </div>
          </SpringAnime>
        </div>
      </div>
    </FadeAnime>
  );
};

export default ConceptBook;
