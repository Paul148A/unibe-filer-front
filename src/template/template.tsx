import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar/navbar"
import Sidebar from "../components/SideBar/sidebar"
import { useAuth } from "../components/Context/context"

const Template = () => {
    const {userInfo, openSidebar, handleCloseSidebar} = useAuth();
    return (
        <div>
            <Navbar />
            <Sidebar user={userInfo} openSidebar={openSidebar} handleSidebar={handleCloseSidebar}/>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default Template