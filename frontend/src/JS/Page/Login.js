import React, { useState } from "react";
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

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '10px'
};

const SignUp = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
    // 회원가입 처리 로직 추가
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    console.log("Email:", email);
    console.log("Password:", password);
    // 회원가입 API 호출 예시
    // signUp({ email, password })
    //   .then(response => {
    //     alert("회원가입이 완료되었습니다.");
    //     handleClose();
    //   })
    //   .catch(error => {
    //     console.error(error);
    //     alert("회원가입에 실패했습니다.");
    //   });

    // 회원가입 성공 시
    alert("회원가입이 완료되었습니다.");
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen}>회원가입</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropProps={{
          style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        }}
      >
        <Box sx={modalStyle}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "end", }}>
            <IconButton onClick={handleClose} sx={{width: "50px", height: "50px", border: "2px solid grey", zIndex: "10"}}>
              <CloseIcon/>
            </IconButton>
          </div>
          
          <div style={{display: "flex", width: "400px", height: "600px", position:"absolute",alignItems: "center", flexDirection: "column"}}>  
            <div className="icon-circle" style={{position: "relative", top: "-50px"}}>
              <img src={sign} alt="?"></img>
            </div>  
            <h2 className="title-login" style={{position: "relative", top: "-30px", textAlign: "center"}}>회원가입</h2>
            <form onSubmit={handleSignup}>
              <InputField
                label="이메일"
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
              <InputField
                label="비밀번호"
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
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

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 로그인 처리 로직을 여기에 추가하면 되는겁니다
    console.log("Username:", username);
    console.log("Password:", password);

    navigate("/home");
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
                <form onSubmit={handleSubmit}>
                  <InputField
                    label="아이디"
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                  />
                  <InputField
                    label="비밀번호"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <button type="submit" className="login-button">
                    로그인
                  </button>
                </form>
                <div className="social-login">
                  <button className="social-login-button">소셜 뭐할지 정해지면</button>
                  <button className="social-login-button">추가할게요</button>
                </div>
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
