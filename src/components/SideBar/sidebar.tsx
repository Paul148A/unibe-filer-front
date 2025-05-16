import { Divider, Drawer} from "@mui/material"
import UseSidebar from "./hooks/use-sidebar";
import { IUser } from "../../interfaces/IUser";

interface Props {
    user: IUser | null,
    handleSidebar: (open: boolean) => void,
    openSidebar: boolean,
}

const Sidebar = (props: Props) => {

    const {sidebarAdminList, sidebarStudentList} = UseSidebar()

    return (
        <>
            <Drawer open={props.openSidebar} onClose={() => props.handleSidebar(false)}>
                <Divider />
                {props.user?.role.name === "admin" ? sidebarAdminList : sidebarStudentList}
            </Drawer>
        </>
    )
}

export default Sidebar