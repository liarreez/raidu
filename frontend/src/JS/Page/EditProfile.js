import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import SpringAnime from "../Component/SpringAnime";
import FadeAnime from "../Component/FadeAnime";
import TopNav from "../Component/TopNav";

import login from "../../Imgs/login.gif";
import document from "../../Imgs/document.gif";

import InputField from "../Component/InputField";

import "../../CSS/EditProfile.css";
import { API_URL } from "../../config"; // 두 단계 상위 디렉토리로 이동하여 config.js 파일을 임포트

const SERVERURL = API_URL;

const EditProfile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userData, setUserData] = useState({});
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [error, setError] = useState(false); // 비밀번호 유효성 검사
  const [nicknameLengthValid, setNicknameLengthValid] = useState(true); // 닉네임 길이 유효성 검사
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(SERVERURL + "/api/raidu/userpage", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUserData(response.data.data.userProfile);
      } catch (error) {
        if (error.response.data.status === "NOT_FOUND") {
          navigate("/firstvisit");
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z\d\s]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError(true);
    } else {
      setError(false);
    }
  }, [newPassword]);

  const handlePasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setNickname(value);
    setNicknameChecked(false);

    // 닉네임 길이 유효성 검사
    if (value.length >= 2 && value.length <= 10) {
      setNicknameLengthValid(true);
    } else {
      setNicknameLengthValid(false);
    }
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleAuthenticate = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        SERVERURL + "/api/raidu/userpage/check-password",
        { password: currentPassword },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response.request.status === 401) {
        alert("올바르지 않은 비밀번호입니다!");
      }
    }
  };

  const checkNickname = async () => {
    if (!nicknameLengthValid) {
      return; // 닉네임 길이가 유효하지 않으면 중복 확인을 실행하지 않음
    }

    if (nickname === null || nickname.trim() === "") {
      alert("닉네임은 공백만으로 구성될 수 없습니다.");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${SERVERURL}/api/raidu/userpage/check-nickname`,
        { nickname: nickname },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );


      if (response.data.message === "Nickname check successfully") {
        setIsNicknameValid(true);
      } else {
        setIsNicknameValid(false);
      }
      setNicknameChecked(true);
    } catch (error) {
      setIsNicknameValid(false);
      setNicknameChecked(true);
    }
  };

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (nicknameChecked && isNicknameValid && !error && newPassword && confirmPassword) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.post(
          `${SERVERURL}/api/raidu/userpage/info`,
          { nickname: nickname, password: newPassword },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        alert("프로필이 수정되었습니다.");
        navigate(`/mypage/${userData.id}`);
      } catch (error) {
     //   console.error("프로필 수정 실패:", error);
        alert("프로필 수정에 실패했습니다.");
      }
    } else {
      if (error) {
        alert("새 비밀번호가 조건을 만족하지 않습니다.");
      } else {
        alert("닉네임 중복 확인을 해주세요.");
      }
    }
  };

  const handleCancel = () => {
    navigate(`/mypage/${userData.id}`);
  };

  return (
    <FadeAnime>
      <div className="edit-page-wrapper">
        <div className="top-nav">
          <TopNav />
        </div>

        <div className="edit-content-wrapper">
          <SpringAnime from="down">
            <div className="edit-content">
              {!isAuthenticated ? (
                <div className="auth-section">
                  <div className="icon-circle">
                    <img alt="인증 아이콘" src={login}></img>
                  </div>
                  <h2>현재 비밀번호 인증</h2>
                  <InputField
                    label="비밀번호"
                    type="password"
                    placeholder="기존 비밀번호"
                    value={currentPassword}
                    onChange={handlePasswordChange}
                  />
                  <div className="button-group">
                    <button className="button-cancel" onClick={handleCancel}>
                      돌아가기
                    </button>
                    <button className="button-confirm" onClick={handleAuthenticate}>
                      인증
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-edit-wrapper">
                  <SpringAnime from="right">
                    <div className="profile-edit-section">
                      <div className="icon-circle">
                        <img
                          src={document}
                          alt="서류 아이콘"
                          style={{ width: "80%", height: "80%" }}
                        ></img>
                      </div>
                      <h2>프로필 수정</h2>
                      <div style={{display: "flex", flexDirection: "column"}}>
                        <InputField
                          label="닉네임(2~10자)"
                          type="text"
                          value={nickname}
                          onChange={handleNicknameChange}
                        />
                        <button
                          className="button-gray"
                          onClick={checkNickname}
                          disabled={!nicknameLengthValid} // 닉네임 길이가 유효하지 않으면 버튼 비활성화
                          style={{ fontSize: "12px", padding: "8px", marginTop: "10px" }}
                        >
                          중복 확인
                        </button>
                        {/* 닉네임 길이 경고 메시지 */}

                      </div>

                      {/* 1. 중복확인을 누르지 않았을 때, 2. 중복확인을 눌렀으나 중복일 때, 3. 중복확인을 눌렀고 중복이 아닐 때 */}
                      <div
                        style={{
                          position: "relative",
                          height: "20px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: "10px",
                          marginTop: "20px"
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
                          className={`modal-small-text ${
                            nicknameChecked && !isNicknameValid ? "" : "hidden"
                          }`}
                          style={{
                            color: "red",
                            fontSize: "10px",
                            position: "absolute",
                          }}
                        >
                          이미 존재하는 닉네임입니다!
                        </p>
                        <p
                          className={`modal-small-text ${
                            nicknameChecked && isNicknameValid ? "" : "hidden"
                          }`}
                          style={{
                            color: "green",
                            fontSize: "10px",
                            position: "absolute",
                          }}
                        >
                          사용 가능한 닉네임입니다!
                        </p>

                        {!nicknameLengthValid && (
                          <p style={{ color: "red", fontSize: "10px", marginTop: "5px", position: "relative", top:"-15px" }}>
                            닉네임은 2~10자 길이만 가능합니다.
                          </p>
                        )}
                      </div>
                      <InputField
                        label="새 비밀번호 (영문, 숫자, 특수기호 포함 8글자 이상)"
                        type="password"
                        placeholder="새 비밀번호"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                      />
                      <InputField
                        label="새 비밀번호 확인"
                        type="password"
                        placeholder="비밀번호 확인"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                      />
                      {/* 비밀번호 조건 유효성 검사 실패 시 경고 메시지 표시 */}
                      {error && (
                        <p style={{ color: "red", fontSize: "10px" }}>
                          비밀번호는 영문, 숫자, 특수기호 포함 8글자 이상이어야 합니다.
                        </p>
                      )}
                      <div className="button-group">
                        <button className="button-cancel" onClick={handleCancel}>
                          취소
                        </button>
                        <button
                          className="button-confirm"
                          onClick={handleSubmit}
                          disabled={!(nickname && newPassword && confirmPassword)} // 모든 필드가 채워져 있어야만 버튼 활성화
                        >
                          수정하기
                        </button>
                      </div>
                    </div>
                  </SpringAnime>
                </div>
              )}
            </div>
          </SpringAnime>
        </div>
      </div>
    </FadeAnime>
  );
};

export default EditProfile;
