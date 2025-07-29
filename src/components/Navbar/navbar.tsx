import { Box, AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from "../Context/context";
import { Link } from "react-router-dom";

const Navbar = () => {
  const {
    userInfo,
    handleSidebar,
  } = useAuth()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleSidebar}
          >
            <MenuIcon />
          </IconButton>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src="./logoUnibe.png" alt="" width="120" height="55" style={{ marginTop: 4 }} />
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccountCircleIcon />
            <Typography variant="h6" component="div">
              {userInfo?.names} {userInfo?.last_names}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar