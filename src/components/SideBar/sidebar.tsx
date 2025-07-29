import { Divider, Drawer, Box } from "@mui/material"
import UseSidebar from "./hooks/use-sidebar";
import { IUser } from "../../interfaces/IUser";

interface Props {
    user: IUser | null,
    handleSidebar: (open: boolean) => void,
    openSidebar: boolean,
}

const Sidebar = (props: Props) => {

    const {sidebarAdminList, sidebarStudentList, sidebarLanguageList, sidebarTeacherList} = UseSidebar({
        onClose: () => props.handleSidebar(false)
    })

    const getSidebarByRole = () => {
        if (!props.user?.role) return null;
        
        // Para IUserAuth, el role es un string
        const roleName = typeof props.user.role === 'string' ? props.user.role : props.user.role.name;
        
        switch (roleName.toLowerCase()) {
            case 'admin':
                return sidebarAdminList;
            case 'student':
                return sidebarStudentList;
            case 'language':
                return sidebarLanguageList;
            case 'teacher':
                return sidebarTeacherList;
            default:
                return sidebarStudentList; // Default fallback
        }
    };

    return (
        <Drawer 
            open={props.openSidebar} 
            onClose={() => props.handleSidebar(false)}
            anchor="left"
            sx={{
                '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    backgroundColor: '#f8f9fa',
                    borderRight: '1px solid #e0e0e0'
                }
            }}
        >
            <Box sx={{ width: 280 }}>
                {getSidebarByRole()}
            </Box>
            </Drawer>
    )
}

export default Sidebar