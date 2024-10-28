import { Link } from "react-router-dom";
import { useContext } from "react";
import LoggedInContext from "../contexts/logged-in-user-context";

const NavBar = () => {
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
    <>
      <div className="navbar">
        {isLoggedIn ? (
          <>
            <p className="navbar-option">
              logged in as: {loggedInUser.username}
            </p>
            <button onClick={handleLogout} className="navbar-option">
              logout
            </button>
          </>
        ) : (
          <>
            <p className="navbar-option">New user? Sign up now!</p>
            <Link className="navbar-option" to="/">
              <button>login</button>
            </Link>
          </>
        )}
        <Link className="navbar-option" to="/">
          <p>Home</p>
        </Link>
        <Link className="navbar-option" to="/objects">
          <p>Objects Search</p>
        </Link>
        <Link className="navbar-option" to="/exhibits">
          <p>Browse Exhibits</p>
        </Link>
        <Link className="navbar-option" to={`/user/${loggedInUser.user_id}`}>
          <p>My Exhibits</p>
        </Link>
      <div class="navbar-museum-project">
        <p>{"M  U  S  E  U  M  P  R  O  J  E  C  T "}</p>
      </div>
      </div>
    </>
  );
};

export default NavBar;
