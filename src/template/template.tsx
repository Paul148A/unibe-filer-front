import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar/navbar"
import Sidebar from "../components/SideBar/sidebar"


const Template = () => {
    return (
        <div>
            <Navbar />
            <Sidebar />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default Template