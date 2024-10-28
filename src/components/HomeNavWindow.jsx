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
    <div className="above-screen-wrapper">
      <div className="standard-page-wrapper">
      <h1 className="standard-title">{`W E L C O M E`}</h1>
    <div className="standard-page-box">
      <p>{`Good to see you again ${loggedInUser.username}!`}</p>
      <p>What would you like to do today?</p>
      <p>;)</p>
      <Link className="home-page-button"to="/objects">
        <button className="home-page-button">Object Search!</button>
      </Link>
      <Link className="home-page-button" to="/exhibits">
        <button className="home-page-button">View ALL Exhibits</button>
      </Link>
      <Link className="home-page-button" to={`/user/${loggedInUser.user_id}`}>
        <button className="home-page-button">My Exhibits</button>
      </Link>
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
    </div>
    </div>
  );
};

export default HomeNavWindow;
