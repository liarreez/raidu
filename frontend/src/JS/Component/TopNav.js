import * as React from "react";
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
import "../../CSS/TopNav.css";

const pages = [
  { name: "활동", subLevels: ["레이드", "훈련장"] },
  { name: "가이드", subLevels: ["튜토리얼", "컨셉 북", "운동 백과"] },
  { name: "랭킹", subLevels: ["유저 랭킹"] }
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
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElSubMenu, setAnchorElSubMenu] = React.useState(null);
  const [subMenuItems, setSubMenuItems] = React.useState([]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenSubMenu = (event, subLevels) => {
    setAnchorElSubMenu(event.currentTarget);
    setSubMenuItems(subLevels);
  };

  const handleCloseSubMenu = () => {
    setAnchorElSubMenu(null);
    setSubMenuItems([]);
  };

  return (
    <div className="nav-wrapper">
      <ThemeProvider theme={theme}>
        <AppBar position="static" sx={{ bgcolor: "white" }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  letterSpacing: ".3rem",
                  textDecoration: "none",
                }}
              ></Typography>

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

                <div className="nav-logo">로고자리</div>
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
                    <MenuItem
                      key={page.name}
                      onClick={(event) =>
                        handleOpenSubMenu(event, page.subLevels)
                      }
                    >
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontWeight: "bold",
                  letterSpacing: ".3rem",
                  textDecoration: "none",
                }}
              ></Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <div className="nav-logo-large">로고자리</div>
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

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="계정 관리">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="프사" src="Imgs/test.png" />
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
                  onClose={handleCloseUserMenu}
                  disableScrollLock={true}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
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
            <MenuItem key={item} onClick={handleCloseSubMenu}>
              <Typography textAlign="center">{item}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </ThemeProvider>

      <div className="nav-image">풀밭 이미지 에셋 들어가요~</div>
    </div>
  );
}

export default ResponsiveAppBar;