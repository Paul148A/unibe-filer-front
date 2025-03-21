import { Drawer, ListItemButton, ListItemIcon, Typography } from "@mui/material"
import InboxIcon from '@mui/icons-material/Inbox';
import { useAuth } from "../Context/context";

const Sidebar = () => {

    const {
        openSidebar,
        handleSidebar
    } = useAuth()

    return (
        <>
            <Drawer open={openSidebar} onClose={() => handleSidebar()}>
                <ListItemButton>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <Typography variant="h6" noWrap>
                        menu
                    </Typography>
                </ListItemButton>
            </Drawer>
        </>
    )
}

export default Sidebar