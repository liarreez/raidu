import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SpringAnime from "../Component/SpringAnime";
import FadeAnime from "../Component/FadeAnime";
import TopNav from "../Component/TopNav";

import login from "../../Imgs/login.gif";
import document from "../../Imgs/document.gif"

import InputField from "../Component/InputField";

import "../../CSS/EditProfile.css";

const EditProfile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [nickname, setNickname] = useState("기존 닉네임");
  const [email, setEmail] = useState("기존 이메일");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleAuthenticate = () => {
    // 여기에 현재 비밀번호 인증 로직을 추가해야함
    // API 호출 후 인증성공하면 setIsAuthenticated(true)
    if (currentPassword === "1234") {
      // 이 부분을 실제 인증 로직으로 대체하세요
      setIsAuthenticated(true);
    } else {
      alert("비밀번호가 올바르지 않습니다.");
    }
  };

  const handleSubmit = () => {
    // 여기에 프로필 수정 요청 로직을 추가하세요
    // 예시: API를 호출하여 프로필 정보를 업데이트
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    // API 호출 예시:
    // updateProfile({ nickname, email, newPassword })
    //   .then(response => {
    //     navigate("/mypage");
    //   })
    //   .catch(error => {
    //     console.error(error);
    //     alert("프로필 수정에 실패했습니다.");
    //   });

    alert("프로필이 수정되었습니다."); // 실제 로직을 대체하세요
    navigate("/mypage");
  };

  const handleCancel = () => {
    navigate("/mypage");
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
                    <button className="button-cancel">돌아가기</button>
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
                            <img src={document} alt="서류 아이콘" style={{width: "80%", height:"80%"}}></img>
                        </div>
                      <h2>프로필 수정</h2>
                      <InputField
                        label="닉네임"
                        type="text"
                        placeholder="닉네임"
                        value={nickname}
                        onChange={handleNicknameChange}
                      />
                      <InputField
                        label="이메일"
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={handleEmailChange}
                      />
                      <InputField
                        label="새 비밀번호"
                        type="password"
                        placeholder="새 비밀번호"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                      />
                      <InputField
                        label="비밀번호 재입력"
                        type="password"
                        placeholder="비밀번호 재입력"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                      />
                      <div className="button-group">
                        <button className="button-cancel" onClick={handleCancel}>
                          취소
                        </button>
                        <button className="button-confirm" onClick={handleSubmit}>
                          수정 완료
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
