import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FadeAnime from "../Component/FadeAnime";
import "../../CSS/FirstVisit.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

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

  const [isFirstModalOpen, setIsFirstModalOpen] = useState(true);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isNicknameValid, setIsNicknameValid] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // 페이지 입장 시 첫 번째 모달을 자동으로 열기
    setIsFirstModalOpen(true);
  }, []);

  const closeFirstModal = () => {
    setIsFirstModalOpen(false);
  };

  const openSecondModal = () => {
    setIsSecondModalOpen(true);
  };

  const closeSecondModal = () => {
    setIsSecondModalOpen(false);
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const checkNickname = () => {
    // 닉네임 중복 확인 로직을 여기에 추가하세요
    // 예: 서버에 요청하여 닉네임 중복 확인
    setIsNicknameValid(true); // 임시로 닉네임을 유효한 것으로 설정
  };

  const completeAccountSetup = () => {
    if (isNicknameValid) {
      // 계정 설정 완료 로직을 여기에 추가하세요
      // 예: 서버에 사용자 정보 저장
      navigate("/home");
    }
  };

  return (
    <FadeAnime>
      <div id="first-page-wrapper">
        <div id="first-background-img"></div>

        <div className="first-content">
          <div className="first-region-info">
            <div className="first-region-top">
              <div className="first-region-icon">
                <SpringAnime key={selectedRegion.id} from="right">
                  <div>
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
              <Button variant="contained" onClick={openSecondModal}>
                소속 확정
              </Button>
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

      <Modal open={isFirstModalOpen} onClose={closeFirstModal}>
        <Box className="modal-box">
          <p className="modal-small-text">처음 방문하셨군요!</p>
          <p className="modal-large-text" style={{marginTop: "10px", marginBottom:"50px"}}>지역과 닉네임을 설정해보세요</p>
          <button className="modal-button button-green" onClick={closeFirstModal}>초기 설정 하러 가기</button>
        </Box>
      </Modal>

      <Modal open={isSecondModalOpen} onClose={closeSecondModal}>
        <Box className="modal-box">
          <p>닉네임을 입력하세요:</p>
          <TextField
            label="닉네임"
            variant="outlined"
            value={nickname}
            onChange={handleNicknameChange}
            fullWidth
          />
          <button className="modal-button button-gray" onClick={checkNickname}>중복 확인</button>
          <button className="modal-button button-green" onClick={completeAccountSetup}>계정 설정 완료</button>
          <Button
            variant="contained"
            color="primary"
            onClick={completeAccountSetup}
            disabled={!isNicknameValid}
            className="modal-button button-green"
          >
            계정 설정 완료
          </Button>
        </Box>
      </Modal>
    </FadeAnime>
  );
};

export default FirstVisit;
