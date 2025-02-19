import { useAuth } from "../Context/context";
import "./welcome-view.css"
import { Typography } from "@mui/material";

const WelcomeView = () => {
    const { userInfo } = useAuth();
    console.log(userInfo?.names);
  
    return (
      <div className="welcome-container">
        <Typography variant="h2">Bienvenido, {userInfo?.names}!</Typography>
      </div>
    );
  };

export default WelcomeView