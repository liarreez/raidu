import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginSlider from "../Component/LoginSlider";
import InputField from "../Component/InputField";

import "../../CSS/Login.css";
import logo from "../../Imgs/logo.png";
import login from "../../Imgs/login.gif";
import sign from "../../Imgs/sign.gif";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FadeAnime from "../Component/FadeAnime";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import axios from "axios";

const SERVERURL = "http://localhost:8080";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  display: "flex",
  flexDirection: "column",
  borderRadius: "10px",
};

const SignUp = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSignup = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    console.log("Email:", email);
    console.log("Password:", password);

    // 회원가입 API 호출
    signUp({ email, password })
      .then(response => {
        handleClose();
      })
      .catch(error => {
        console.error(error);
        alert("회원가입에 실패했습니다.");
      });

    console.log("회원가입이 완료되었습니다.");
    handleClose();
  };

  useEffect(() => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z\d\s]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(true);
    } else {
      setError(false);
    }
  }, [password]);

  const signUp = async ({ email, password }) => {
    try {
      const response = await axios.post(SERVERURL + "/api/raidu/users/register", { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div>
      <button onClick={handleOpen} className="register-button">
        회원가입
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropProps={{ style: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
      >
        <Box sx={modalStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
            <IconButton onClick={handleClose} sx={{ width: "50px", height: "50px", border: "2px solid grey", zIndex: "10" }}>
              <CloseIcon />
            </IconButton>
          </div>
          <div style={{ display: "flex", width: "400px", height: "600px", position: "absolute", alignItems: "center", flexDirection: "column" }}>
            <div className="icon-circle" style={{ position: "relative", top: "-50px" }}>
              <img src={sign} alt="?"></img>
            </div>
            <h2 className="title-login" style={{ position: "relative", top: "-30px", textAlign: "center" }}>
              회원가입
            </h2>
            <form onSubmit={handleSignup}>
              <InputField label="이메일" type="email" value={email} onChange={handleEmailChange} />
              <InputField
                label="비밀번호 (영문, 숫자, 특수기호 포함 8글자 이상)"
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
              {/* 비밀번호 조건 만족 여부 메시지 */}
              <p className={`error-msg ${error ? "visible" : "hidden"}`}>비밀번호 조건을 만족하지 않습니다.</p>
              <InputField
                label="비밀번호 확인"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />

              <button type="submit" className="login-button">
                가입하기
              </button>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      console.log("로그인시도: 이메일", email);
      console.log("로그인시도: 비밀번호", password);
      const response = await axios.post(`${SERVERURL}/api/raidu/users/login`, 
        { "email": email, "password": password });
      console.log(response);
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      
      console.log("저장된 access토큰 : " + localStorage.getItem("accessToken"));
      console.log("저장된 refresh토큰 : " + localStorage.getItem("refreshToken"));

      navigate("/home");
    } catch (error) {
      console.error("로그인에 실패했습니다:", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <FadeAnime>
      <div id="page-wrapper">
        <div id="background-img"></div>
        <div className="content">
          <div className="content-left">
            <div className="logo">
              <img alt="로고 자리" src={logo}></img>
            </div>
            <div className="service-description">
              <LoginSlider />
            </div>
          </div>
          <div className="content-right">
            <div className="login-form">
              <div className="icon-circle">
                <img alt="로그인 gif" src={login}></img>
              </div>
              <div className="login-content">
                <h1 className="title-login">로그인</h1>
                <form onSubmit={handleLogin}>
                  <InputField label="아이디" type="text" value={email} onChange={handleEmailChange} />
                  <InputField label="비밀번호" type="password" value={password} onChange={handlePasswordChange} />
                  <button type="submit" className="login-button">
                    로그인
                  </button>
                </form>
                {/* <div className="social-login">
                  <button className="social-login-button">소셜 로그인은 추가예정</button>
                  <button className="social-login-button" onClick={()=>{navigate("/firstvisit")}}>첫방문 CSS는 여기서 살펴보세요 (임시)</button>
                </div> */}
                <SignUp />
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeAnime>
  );
};

export default Login;
