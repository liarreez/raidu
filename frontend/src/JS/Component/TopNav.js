import * as React from "react";
import { useEffect, useCallback } from "react";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from "react-router-dom";
import topgrass from "../../Imgs/topgrass.png";
import "../../CSS/TopNav.css";

const pages = [
  { name: "활동", subLevels: ["레이두"] },
  { name: "가이드", subLevels: ["튜토리얼", "컨셉 북", "운동 백과"] },
  { name: "정보", subLevels: ["유저 검색"] },
];
const settings = ["마이페이지", "개인정보 수정", "로그아웃"];

const theme = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "black",
          fontFamily: '"Noto Sans KR", sans-serif',
          fontOpticalSizing: "auto",
          fontStyle: "normal",
        },
      },
    },
  },
});

function ResponsiveAppBar() {
  const SERVERURL = "http://localhost:8080";
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState(null);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElSubMenu, setAnchorElSubMenu] = React.useState(null);
  const [subMenuItems, setSubMenuItems] = React.useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        console.log("사용한 토큰 : " + accessToken);
        const response = await axios.get(SERVERURL + "/api/raidu/userpage", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log(response);
        console.log(response.data.data.userProfile.id)
        setUserData(response.data.data.userProfile);
      } catch (error) {
        console.error("유저 정보 불러오기 실패...");
        console.log(error);
        if (error.response.data.status === "NOT_FOUND") {
          console.log("첫 방문임...");
          navigate("/firstvisit");
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = useCallback(
    (setting) => {
      setAnchorElUser(null);
      if (setting === "마이페이지") {
        console.log("받은 id값 : " + userData.id)
        navigate(`/mypage/${userData.id}`);
      } else if (setting === "개인정보 수정") {
        navigate("/editprofile");
      } else if (setting === "로그아웃") {
        // 로그아웃 처리 로직 추가해야함
        navigate("/login");
      }
    },
    [navigate, userData]
  );

  const handleOpenSubMenu = (event, subLevels) => {
    setAnchorElSubMenu(event.currentTarget);
    setSubMenuItems(subLevels);
  };

  const handleCloseSubMenu = (dest) => {
    setAnchorElSubMenu(null);
    setSubMenuItems([]);
    // 소메뉴 클릭시 이동하는 경로 모음
    if (dest === "레이두") {
      navigate("/raid");
    } else if (dest === "튜토리얼") {
      navigate("/tutorial");
    } else if (dest === "컨셉 북") {
      navigate("/conceptbook");
    } else if (dest === "운동 백과") {
      navigate("/dictionary");
    } else if (dest === "유저 검색") {
      navigate("/usersearch");
    }
  };

  const handleLogoClick = () => {
    navigate("/home");
  };

  return (
    <div className="nav-wrapper">
      <ThemeProvider theme={theme}>
        <AppBar position="static" sx={{ bgcolor: "white" }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="black"
                >
                  <MenuIcon />
                </IconButton>

                <div className="nav-logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
                  로고자리
                </div>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                  disableScrollLock={true}
                >
                  {pages.map((page) => (
                    <MenuItem key={page.name} onClick={(event) => handleOpenSubMenu(event, page.subLevels)}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />

              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <div className="nav-logo-large" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
                  로고자리
                </div>
                {pages.map((page) => (
                  <Button
                    key={page.name}
                    onClick={(event) => handleOpenSubMenu(event, page.subLevels)}
                    sx={{
                      my: "auto",
                      color: "black",
                      display: "block",
                      fontFamily: "inherit",
                      marginLeft: "100px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                    className="menu-large"
                  >
                    {page.name}
                  </Button>
                ))}
              </Box>

              <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
                {userData && (
                  <Typography variant="h6" sx={{ fontSize:"12px", marginRight:"20px"}}>
                    {userData.nickname} 님 환영합니다!
                  </Typography>
                )}
                <Tooltip title="계정 관리">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="프사"/>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={() => setAnchorElUser(null)}
                  disableScrollLock={true}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Menu
          id="submenu-appbar"
          anchorEl={anchorElSubMenu}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(anchorElSubMenu)}
          onClose={handleCloseSubMenu}
          disableScrollLock={true}
        >
          {subMenuItems.map((item) => (
            <MenuItem key={item} onClick={() => handleCloseSubMenu(item)}>
              <Typography textAlign="center">{item}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </ThemeProvider>

      <div className="nav-image">
        <img src={topgrass} alt="topgrass" />
      </div>
    </div>
  );
}

export default ResponsiveAppBar;
