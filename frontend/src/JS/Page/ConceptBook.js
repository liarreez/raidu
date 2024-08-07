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
                      <p>이두왕국의 초기 국왕은 나라를 일으킬 때 약속을 하나 했습니다.</p>
                      <p style={{fontWeight:"bold"}}>"나를 따른다면 길고 건강한 삶을 약속하겠다"</p>
                        <br/>
                        <p>국민들은 그들의 긴 삶을 약속 받았고, </p>
                        <p>국왕은 그런 국민들이 건강을 유지하지 않아도 오래 살 수 있게끔</p>
                        <p>마법의 힘을 사용하여 그들의 질병을 뽑아낸 다음,</p>
                        <p>왕국의 변두리로 던져버렸습니다.</p>
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
                        <p>건강관리가 딱히 필요하지 않아진 이두왕국의 국민들은</p>
                        <p>점차 게을러지기 시작했습니다.</p>
                        <br/>
                        <p>왕국은 점차 더 많은 질병들을 뽑아내어 변두리로 흘려보내야 했고, </p>
                        <p>이렇게 버려진 질병들은 변두리에서 점차 쌓이며 뭉치기 시작했습니다.</p>
                        <br/>
                        <p style={{fontWeight: "bold"}}>자신이 태어났던 곳으로 돌아갈 기회를 노리면서...</p>
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
                        <p style={{fontWeight: "bold"}}>질병들이 쌓이고 쌓여 마왕성이 탄생하고 말았습니다.</p>
                        <br/>
                        <p>마왕성에서 쏟아져 나온 괴물들은 이두왕국에 심각한 위협이 되었습니다.</p>
                        <p>기존의 생활방식을 잊고 게으름에 취해 살던 왕국의 국민들은</p>
                        <p>그들 스스로 쌓아온 업보를 감당하기엔 너무나도 약해졌습니다.</p>
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
                        <p>왕국의 존폐 기로 앞에서 궁정 마법사들은</p>
                        <p>운동의 힘을 전달하는 마법을 개발 해냈습니다.</p>
                        <br></br>
                        <p>운동의 힘을 다루는 마법의 용사가 나타났으며,</p>
                        <p>네 지역의 국민들은 잊고 살았던 자신들의 </p>
                        <p>건강했던 삶의 방식을 되찾기 시작했습니다.</p>
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
                        <p style={{fontWeight: "bold"}}>당신은 국왕으로부터 용사의 힘을 기르는 영광스러운 의무를 받았습니다.</p>
                        <p>동료들과 함께 운동하십시오.</p>
                        <br></br>
                        <p style={{fontWeight: "bold"}}>동료들과 함께 용사를 성장시키고, 왕국을 지켜내십시오.</p>
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
