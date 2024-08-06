import React from "react";
// 컴포넌트 import
import FadeAnime from "../Component/FadeAnime";
import SpringAnime from "../Component/SpringAnime";
import TopNav from "../Component/TopNav";
import Rerenderer from "../Component/Rerenderer";
// CSS 관련 import
import "../../CSS/ConceptBook.css";
import "../../CSS/BasicAnime.css";
//
import logo from "../../Imgs/logo.png";

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
              <div className="concept-logo">
                <img src={logo} alt="로고 이미지"></img>
              </div>
              <div className="concept-section-wrapper">
                {/* 첫째 문단입니다. */}
                <div className="section-renderbox">
                <Rerenderer>
                  <div className="section-content">
                    <div className="section-image focus-in-contract delay-05s">
                      <img alt="대충 이미지"></img>
                    </div>
                    <div className="section-text">
                      <div className="focus-in-contract delay-03s">이두왕국의 시작</div>
                      <div className="focus-in-contract delay-07s">
                        <p>대충 설명입니다.</p>
                        <p>추후에 추가하면 됩니다.</p>
                      </div>
                    </div>
                  </div>
                </Rerenderer>
                </div>

                {/* 둘째 문단입니다. */}
                <div className="section-renderbox">
                <Rerenderer>
                  <div className="section-content section-rightside">
                    <div className="section-text">
                      <div className="focus-in-contract delay-05s">쌓여가는 병폐</div>
                      <div className="focus-in-contract delay-07s">
                        <p>대충 설명입니다.</p>
                        <p>추후에 추가하면 됩니다.</p>
                      </div>
                    </div>
                    <div className="section-image focus-in-contract delay-03s">
                      <img alt="대충 이미지"></img>
                    </div>
                  </div>
                </Rerenderer>
                </div>
                {/* 셋째 문단입니다. */}
                <div className="section-renderbox">
                <Rerenderer>
                  <div className="section-content">
                    <div className="section-image focus-in-contract delay-05s">
                      <img alt="대충 이미지"></img>
                    </div>
                    <div className="section-text">
                      <div className="focus-in-contract delay-03s">적의 출현</div>
                      <div className="focus-in-contract delay-07s">
                        <p>대충 설명입니다.</p>
                        <p>추후에 추가하면 됩니다.</p>
                      </div>
                    </div>
                  </div>
                </Rerenderer>
                </div>
                {/* 넷째 문단입니다. */}
                <div className="section-renderbox">
                <Rerenderer>
                  <div className="section-content section-rightside">
                    <div className="section-text">
                      <div className="focus-in-contract delay-05s">용사의 등장</div>
                      <div className="focus-in-contract delay-07s">
                        <p>대충 설명입니다.</p>
                        <p>추후에 추가하면 됩니다.</p>
                      </div>
                    </div>
                    <div className="section-image focus-in-contract delay-03s">
                      <img alt="대충 이미지"></img>
                    </div>
                  </div>
                </Rerenderer>
                </div>
                {/* 마지막 문단입니다. */}
                <div className="section-renderbox">
                <Rerenderer>
                  <div className="section-content">
                    <div className="section-image focus-in-contract delay-05s">
                      <img alt="대충 이미지"></img>
                    </div>
                    <div className="section-text">
                      <div className="focus-in-contract delay-03s">레이두 개시!</div>
                      <div className="focus-in-contract delay-07s">
                        <p>대충 설명입니다.</p>
                        <p>추후에 추가하면 됩니다.</p>
                      </div>
                    </div>
                  </div>
                </Rerenderer>
                </div>
              </div>
            </div>
          </SpringAnime>
        </div>
      </div>
    </FadeAnime>
  );
};

export default ConceptBook;
