import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Inbox';

const UseSidebar = () => {
  const sidebarAdminList = (
    <Box sx={{ width: 300 }}>
      <List>
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText>
              Menu
            </ListItemText>  
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText>
              Docs
            </ListItemText>  
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const sidebarStudentList = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText>
              Menu
            </ListItemText>  
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText>
              Upload
            </ListItemText>  
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
  return {
    sidebarAdminList,
    sidebarStudentList
  }
}

export default UseSidebar