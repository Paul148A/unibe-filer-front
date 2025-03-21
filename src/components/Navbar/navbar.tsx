import { Box, AppBar, Toolbar, IconButton, Typography, Menu, MenuItem } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import UseNavbar from "./hooks/use-navbar";
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from "../Context/context";

const Navbar = () => {
  const {
    anchorEl,
    handleMenu,
    handleClose,
  } = UseNavbar()

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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {userInfo?.names}
          </Typography>
          <div>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
              <Typography variant="h6">
                {userInfo?.names}
              </Typography>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar