import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import FadeAnime from "../Component/FadeAnime";
import "../../CSS/FirstVisit.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputField from "../Component/InputField";

// 4개 지역 아이콘
import icon_cliff from "../../Imgs/icon_cliff.png";
import icon_desert from "../../Imgs/icon_desert.png";
import icon_forest from "../../Imgs/icon_forest.png";
import icon_sea from "../../Imgs/icon_sea.png";

import region_cliff from "../../Imgs/region_cliff.jpg";
import region_desert from "../../Imgs/region_desert.jpg";
import region_forest from "../../Imgs/region_forest.jpg";
import region_sea from "../../Imgs/region_sea.jpg";

import SpringAnime from "../Component/SpringAnime";

const SERVERURL = "http://localhost:8080";

const RegionSelecter = ({ setSelectedRegion }) => {
  const regions = [
    {
      id: 1,
      name: "근력의 절벽",
      icon: icon_cliff,
      desc:
        "근력의 절벽은 이두 왕국의 힘과 용기를 상징하는 지역입니다.\n\n" +
        "이두 왕국은 그들의 영토를 지키기 위해 강인한 힘을 가진 사람들을 필요로 했고, " +
        "근력 절벽은 그들 중에서도 가장 뛰어난 힘을 가진 사람들을 양성하는 장소가 되었습니다.\n\n" +
        "강인하고 폭발적인 힘에 관심이 있는 이들이 선택하기 좋은 지역입니다.",
      bg: region_cliff,
    },
    {
      id: 2,
      name: "지구력의 사막",
      icon: icon_desert,
      desc:
        "지구력의 사막은 그 이름처럼 지구력과 인내심을 상징하는 곳입니다.\n\n" +
        "이곳의 주민들은 끝없는 모래언덕과 뜨거운 태양 아래에서도 변치 않는 끈기를 발휘합니다. " +
        "이들에게 사막에서의 삶은 단순한 생존이 아니라 그들의 강인함과 지구력을 증명하는 과정입니다.\n\n" +
        "지속성, 꾸준함의 미덕을 아는 이들이 선택하기 좋은 지역입니다.",
      bg: region_desert,
    },
    {
      id: 3,
      name: "민첩의 숲",
      icon: icon_forest,
      desc:
        "민첩의 숲은 식물과 나무, 가시로 가득한 험난한 지역입니다.\n\n" +
        "이곳의 주민들은 빠른 판단력과 민첩함을 자랑하며, \n" +
        "그들의 능력을 극대화하기 위한 노력을 게을리 하지 않습니다.\n\n" +
        "빠르고 정확한 판단력, 그리고 유연한 움직임을 추구하는 이들이 선택하기 좋은 지역입니다.",
      bg: region_forest,
    },
    {
      id: 4,
      name: "유연의 해변",
      icon: icon_sea,
      desc:
        "유연의 해변은 그 이름처럼 신체의 유연함과 마음의 평온함을 상징하는 곳입니다.\n\n" +
        "그들의 문화와 생활 방식은 물의 변화와 파도의 움직임을 통해 영향을 받아왔으며, " +
        "그들은 물과 파도의 변화를 통해 삶의 흐름을 비유적으로 이해합니다. \n\n" +
        "유연한 신체에 깃든 평온한 마음, 부드러움의 미학을 추구하는 이들이 선택하기 좋은 지역입니다.",
      bg: region_sea,
    },
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
  const [selectedRegion, setSelectedRegion] = useState(    {
    id: 1,
    name: "근력의 절벽",
    icon: icon_cliff,
    desc:
      "근력의 절벽은 이두 왕국의 힘과 용기를 상징하는 지역입니다.\n\n" +
      "이두 왕국은 그들의 영토를 지키기 위해 강인한 힘을 가진 사람들을 필요로 했고, " +
      "근력 절벽은 그들 중에서도 가장 뛰어난 힘을 가진 사람들을 양성하는 장소가 되었습니다.\n\n" +
      "강인하고 폭발적인 힘에 관심이 있는 이들이 선택하기 좋은 지역입니다.",
    bg: region_cliff,
  });

  const [isFirstModalOpen, setIsFirstModalOpen] = useState(true);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false); // 중복 확인 여부 상태 추가

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
    setNicknameChecked(false); // 닉네임이 변경될 때 중복 확인 상태 초기화
  };

  const checkNickname = async () => {
    // 닉네임 중복 확인 로직을 여기에 추가
    // 서버에 요청하여 닉네임 중복 확인
  // nickname이 null인 경우
  if (nickname === null) {
    alert("닉네임 값이 없습니다.");
    return;
  }
  
  // nickname이 공백 문자열인 경우
  if (nickname.trim() === "") {
    alert("닉네임은 공백만으로 구성될 수 없습니다.");
    return;
  }
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.post(
        `${SERVERURL}/api/raidu/userpage/check-nickname`,
        { nickname: nickname },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      console.log(response)

      if (response.data.message === "Nickname check successfully") {
        setIsNicknameValid(true);
      } else {
        setIsNicknameValid(false);
      }
      setNicknameChecked(true);
    } catch (error) {
      console.error("닉네임 중복 확인 실패:", error);
      setIsNicknameValid(false);
      setNicknameChecked(true);
    }
  };

  const completeAccountSetup = async () => {
    if (isNicknameValid && nicknameChecked) {
      // 계정 설정 완료 로직을 여기에 추가하세요
      // 예: 서버에 사용자 정보 저장
      console.log("등록 시도 닉네임 : " + nickname);
      console.log("등록 시도 지역 : " + selectedRegion.name);
      try {
        const accessToken = localStorage.getItem("accessToken");
        console.log("지역/닉네임 설정 - 사용한 토큰 : " + accessToken);
        const response = await axios.post(
          `${SERVERURL}/api/raidu/userpage/register`,
          { "nickname": nickname, "region": selectedRegion.name },
          { headers: { "Authorization": `Bearer ${accessToken}` } }
        );
        console.log(response);
        // setUser(data);
      } catch (error) {
        console.error("유저 정보 불러오기 실패...");
        console.log(error);
        if (error.response.data.status === "NOT_FOUND") {
          console.log("첫 방문임...");
          navigate("/firstvisit");
        }
      }
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
                  <div style={{ width: "300px", display: "flex", justifyContent: "center" }}>
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
                      <div style={{ width: "300px", display: "flex", justifyContent: "center" }}>
                        {selectedRegion.name}
                      </div>
                    </SpringAnime>
                  </p>
                </div>
              </div>
            </div>

            <div className="first-region-bottom">
              <SpringAnime key={selectedRegion.id} from="down">
                <div className="first-region-desc" style={{ height: "300px" }}>
                  {selectedRegion.desc}
                </div>
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
                <img
                  src={selectedRegion.bg}
                  alt={`지역 ${selectedRegion.id}에 대한 이미지 자리...`}
                ></img>
              </div>
            </SpringAnime>
          </div>
        </div>
      </div>

      <Modal open={isFirstModalOpen} onClose={closeFirstModal}>
        <Box className="modal-box">
          <p className="modal-small-text">처음 방문하셨군요!</p>
          <p className="modal-large-text" style={{ marginTop: "10px", marginBottom: "50px" }}>
            지역과 닉네임을 설정해보세요
          </p>
          <button className="modal-button button-green" onClick={closeFirstModal}>
            계정 설정 하러 가기
          </button>
        </Box>
      </Modal>

      <Modal open={isSecondModalOpen} onClose={closeSecondModal}>
        <Box className="modal-box">
          <p className="modal-small-text">거의 다 됐어요!</p>
          <p className="modal-large-text underline">닉네임을 입력하세요</p>
          <div className="modal-name-input">
            <InputField
              label="닉네임"
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
            />

            <button
              className="modal-button button-gray"
              onClick={checkNickname}
              style={{ fontSize: "12px", padding: "8px" }}
            >
              중복 확인
            </button>
          </div>
          {/* 1. 중복확인을 누르지 않았을때 2. 중복확인을 눌렀으나 중복일때 3. 중복확인을 눌렀고 중복이 아닐때*/}
          <div
            style={{
              position: "relative",
              height: "20px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <p
              className={`modal-small-text ${nicknameChecked ? "hidden" : ""}`}
              style={{
                color: "red",
                fontSize: "10px",
                position: "absolute",
              }}
            >
              닉네임 중복 확인을 진행해주세요!
            </p>
            <p
              className={`modal-small-text ${(nicknameChecked && !isNicknameValid) ? "" : "hidden"}`}
              style={{
                color: "red",
                fontSize: "10px",
                position: "absolute",
              }}
            >
              이미 존재하는 닉네임입니다!
            </p>
            <p
              className={`modal-small-text ${(nicknameChecked && isNicknameValid) ? "" : "hidden"}`}
              style={{
                color: "green",
                fontSize: "10px",
                position: "absolute",
              }}
            >
              사용 가능한 닉네임입니다!
            </p>
          </div>

          <button
            className={`modal-button button-green ${nicknameChecked ? "" : "hidden"}`}
            onClick={completeAccountSetup}
          >
            계정 설정 완료
          </button>
        </Box>
      </Modal>
    </FadeAnime>
  );
};

export default FirstVisit;
