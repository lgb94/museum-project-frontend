import { Link } from "react-router-dom";
import { useContext } from "react";
import LoggedInContext from "../contexts/logged-in-user-context";

const HomeNavWindow = () => {
  const { loggedInUser, setLoggedInUser } = useContext(LoggedInContext);
  const { isLoggedIn, setIsLoggedIn } = useContext(LoggedInContext);

  const handleLogout = (event) => {
    setLoggedInUser({
      user_id: 0,
      username: "guest",
      email: "guest@email.com",
    });
    setIsLoggedIn(false);
    localStorage.removeItem("rememberedUser");
  };

  return (
    <div className="login-box-wrapper">
    <div className="login-box">
      <h2 className="login-header">{`Welcome back ${loggedInUser.username}!`}</h2>
      <Link to="/objects">
        <button className="login-button">Object Search!</button>
      </Link>
      <Link to="/exhibits">
        <button className="login-button">View ALL Exhibits</button>
      </Link>
      <Link to={`/user/${loggedInUser.user_id}`}>
        <button className="login-button">My Exhibits</button>
      </Link>
      <button className="login-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
    </div>
  );
};

export default HomeNavWindow;
