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
import logo from "../../Imgs/logo.png";
import profile from "../../Imgs/profilehero.png";
import "../../CSS/TopNav.css";
import { API_URL } from '../../config';  // 두 단계 상위 디렉토리로 이동하여 config.js 파일을 임포트

const pages = [
  { name: "레이두", path: "/raid" },
  { name: "컨셉북", path: "/conceptbook" },
  { name: "유저 검색", path: "/usersearch" },
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
  const SERVERURL = API_URL;
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState(null);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

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
        if (error.response.data.message === "액세스 토큰이 만료되었습니다!") {
          navigate("/login");
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = useCallback(
    (setting) => {
      setAnchorElUser(null);
      if (setting === "마이페이지") {
        navigate(`/mypage/${userData.id}`);
      } else if (setting === "개인정보 수정") {
        navigate("/editprofile");
      } else if (setting === "로그아웃") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("curEmail");
        navigate("/login");
      }
    },
    [navigate, userData]
  );

  const handleMenuClick = (path) => {
    navigate(path);
    setAnchorElNav(null);
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
                  <img alt="로고 자리" src={logo}></img>
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
                    <MenuItem key={page.name} onClick={() => handleMenuClick(page.path)}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />

              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <div className="nav-logo-large" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
                  <img alt="큰 로고" src={logo}></img>
                </div>
                {pages.map((page) => (
                  <Button
                    key={page.name}
                    onClick={() => handleMenuClick(page.path)}
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
                  <Typography variant="h6" sx={{ fontSize: "12px", marginRight: "20px" }}>
                    {userData.nickname} 님 환영합니다!
                  </Typography>
                )}
                <Tooltip title="계정 관리">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar style={{ border: "1px solid var(--hard-color-black)" }} src={profile} alt="프사" />
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
      </ThemeProvider>

      <div className="nav-image">
        <img src={topgrass} alt="topgrass" />
      </div>
    </div>
  );
}

export default ResponsiveAppBar;
