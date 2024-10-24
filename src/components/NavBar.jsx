import { Link } from "react-router-dom"
import { useContext } from "react";
import LoggedInContext from "../contexts/logged-in-user-context";

const NavBar = () => {
    const { loggedInUser, setLoggedInUser } = useContext(LoggedInContext);
    const { isLoggedIn, setIsLoggedIn } = useContext(LoggedInContext);

    const handleLogout = (event) => {
        setLoggedInUser({ user_id: 0, username: "guest", email: "guest@email.com" });
        setIsLoggedIn(false);
        localStorage.removeItem("rememberedUser");
      };

    return (
    <div className="navbar">
            {isLoggedIn ? (
              <>
            <p className="navbar-option">logged in as: {loggedInUser.username}</p>
            <button onClick={handleLogout} className="navbar-button">logout</button>
              </>
            ):(
            <>
            <p className="navbar-option">New user? Sign up now!</p>
            <Link to='/'><button className="navbar-button">login</button></Link>
            </>
          )}
            <Link to='/'><p className="navbar-option">Home</p ></Link>
            <Link to='/objects'><p className="navbar-option">Objects Search</p></Link>
            <Link to='/exhibits'><p className="navbar-option">Browse Exhibits</p></Link>
            <Link to={`/user/${loggedInUser.user_id}`}><p className="navbar-option">My Exhibits</p></Link>
        </div>
    )
}

export default NavBar