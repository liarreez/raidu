import React, { useState } from "react";
import FadeAnime from "../Component/FadeAnime";
import "../../CSS/FirstVisit.css";

import region1 from "../../Imgs/flag.gif";
import region2 from "../../Imgs/flag.gif";
import region3 from "../../Imgs/flag.gif";
import region4 from "../../Imgs/flag.gif";
import SpringAnime from "../Component/SpringAnime";

const RegionSelecter = ({ setSelectedRegion }) => {
  const regions = [
    { id: 1, name: "지역1", icon: region1, desc: "지역 1에 대한 설명입니다." },
    { id: 2, name: "지역2", icon: region2, desc: "지역 2에 대한 설명입니다." },
    { id: 3, name: "지역3", icon: region3, desc: "지역 3에 대한 설명입니다." },
    { id: 4, name: "지역4", icon: region4, desc: "지역 4에 대한 설명입니다." },
  ];

  return (
    <div className="selecter-icon-container">
      {regions.map((region) => (
        <div key={region.id} onClick={() => setSelectedRegion(region)} className="selecter-icon">
          <img src={region.icon} alt={region.name} />
        </div>
      ))}
    </div>
  );
};

const FirstVisit = () => {
  const [selectedRegion, setSelectedRegion] = useState({
    id: 0,
    name: "없음",
    desc: "지역을 선택해주세요.",
  });

  return (
    <FadeAnime>
      <div id="first-page-wrapper">
        <div id="first-background-img"></div>

        <div className="first-content">
          <div className="first-region-info">
            <div className="first-region-top">
              <div className="first-region-icon">
                <SpringAnime key={selectedRegion.id} from="right">
                  <div style={{width: "300px", display: "flex", justifyContent: "center"}}>
                    <img src={selectedRegion.icon || ""} alt="선택된 지역 아이콘 확대"></img>
                  </div>
                </SpringAnime>
              </div>
              <div className="first-region-selecter">
                <RegionSelecter setSelectedRegion={setSelectedRegion}></RegionSelecter>
                <div className="first-region-selecter-text">
                  <p>선택된 지역</p>
                  <p className={`selected-region-name region-${selectedRegion.id}`}>
                    <SpringAnime key={selectedRegion.id} from="left">
                      <div style={{ width: "100px", display: "flex", justifyContent: "center" }}>
                        {selectedRegion.name}
                      </div>
                    </SpringAnime>
                  </p>
                </div>
              </div>
            </div>

            <div className="first-region-bottom">
              <SpringAnime key={selectedRegion.id} from="down">
                <div style={{ height: "300px" }}>{selectedRegion.desc}</div>
              </SpringAnime>
            </div>
            <div className="first-region-confirm">
                <button>소속 확정</button>
            </div>
          </div>
          <div className="first-region-img">
                <SpringAnime key={selectedRegion.id} from="right">
                  <div>
                    <img src={selectedRegion.bg} alt={`지역 ${selectedRegion.id}에 대한 이미지 자리...`}></img>
                  </div>
                </SpringAnime>
          </div>
        </div>
      </div>
    </FadeAnime>
  );
};

export default FirstVisit;
