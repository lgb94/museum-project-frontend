import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomeNavWindow from "./components/HomeNavWindow";
import LoginPage from "./components/LoginPage";
import ObjectsPage from "./components/ObjectsPage";
import SingleObjectPage from "./components/SingleObjectPage";
import ExhibitsPage from "./components/ExhibitsPage";
import ExhibitViewer from "./components/ExhibitViewer";
import SingleExhibitObject from "./components/SingleExhibitObjectPage";
import UserExhibits from "./components/UserExhibits";
import ExhibitCreate from "./components/ExhibitCreate"
import "./App.css";
import LoggedInContext from "./contexts/logged-in-user-context";
import NavBar from "./components/NavBar";

function App() {
  const [loggedInUser, setLoggedInUser] = useState({
    user_id: 0,
    username: "guest",
    email: "guest@email.com",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("rememberedUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setLoggedInUser(parsedUser);
      setIsLoggedIn(true);
    }
  }, [setLoggedInUser, setIsLoggedIn]);

  return (
    <div>
      <LoggedInContext.Provider
        value={{
          loggedInUser: loggedInUser,
          setLoggedInUser: setLoggedInUser,
          isLoggedIn: isLoggedIn,
          setIsLoggedIn: setIsLoggedIn,
        }}
      >
        <NavBar />
        <Routes>
          <Route path="/" element={isLoggedIn ? <HomeNavWindow /> : <LoginPage />} />
          <Route path="/objects" element={<ObjectsPage />} />
          <Route path="/objects/:object_id" element={<SingleObjectPage />} />
          <Route path="/exhibits" element={<ExhibitsPage />} />
          <Route path="/exhibits/create" element={<ExhibitCreate />} />
          <Route path="/exhibits/:exhibit_id" element={<ExhibitViewer />} />
          <Route path="/exhibits/:exhibit_id/:exhibit_object_id" element={<SingleExhibitObject />} />
          <Route path="/user/:user_id" element={<UserExhibits loggedInUser={loggedInUser} isLoggedIn={isLoggedIn} />} />  
        </Routes>
      </LoggedInContext.Provider>
    </div>
  );
}

export default App;
