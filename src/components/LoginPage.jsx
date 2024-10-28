import { useContext, useState } from "react";
import { verifyUser } from "../utils/user-requests/login-request";
import { createAccount } from "../utils/user-requests/create-account-request";
import LoggedInContext from "../contexts/logged-in-user-context";
import LoggingInSpinner from "./LoggingInSpinner";
import LoadingSpinner from "./LoadingSpinner";


const LoginPage = () => {
  const { loggedInUser, setLoggedInUser } = useContext(LoggedInContext);
  const { isLoggedIn, setIsLoggedIn } = useContext(LoggedInContext);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [createAccountUsernameAttempt, setCreateAccountUsernameAttempt] =
    useState("");
  const [createAccountEmailAttempt, setCreateAccountEmailAttempt] =
    useState("");
  const [createAccountPasswordAttempt, setCreateAccountPasswordAttempt] =
    useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const [newAccount, setNewAccount] = useState({});
  const [loginEmailAttempt, setLoginEmailAttempt] = useState("");
  const [loginPasswordAttempt, setLoginPasswordAttempt] = useState("");
  const [createAccountError, setCreateAccountError] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    setLoggingIn(true);
    setErrorMessage("");
    return verifyUser({
      email: loginEmailAttempt,
      password: loginPasswordAttempt,
    })
      .then((response) => {
        const user = {
          user_id: response.user.user_id,
          username: response.user.username,
          email: response.user.email,
        };

        setLoggedInUser(user);
        setIsLoggedIn(true);
        setLoggingIn(false);
        setLoginError(false);
        setLoginEmailAttempt("");
        setLoginPasswordAttempt("");

        if (rememberMe) {
          localStorage.setItem("rememberedUser", JSON.stringify(user));
        } else {
          localStorage.removeItem("rememberedUser");
        }
      })
      .catch((err) => {
        setLoginEmailAttempt("");
        setLoginPasswordAttempt("");
        setErrorMessage(err);
        setLoginError(true);
        setLoggingIn(false);
      });
  };

  const handleNewUser = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setNewAccount({});
    if (
      createAccountUsernameAttempt === "" ||
      createAccountEmailAttempt === "" ||
      createAccountPasswordAttempt === ""
    ) {
      setCreateAccountUsernameAttempt("");
      setCreateAccountEmailAttempt("");
      setCreateAccountPasswordAttempt("");
      setIsLoading(false);
      setCreateAccountError(true);
    } else
      createAccount({
        username: createAccountUsernameAttempt,
        email: createAccountEmailAttempt,
        password: createAccountPasswordAttempt,
      })
        .then((response) => {
          const user = {
            username: response.user.username,
            email: response.user.email,
          };
          setNewAccount(user);
          setAccountCreated(true);
          setCreateAccountUsernameAttempt("");
          setCreateAccountEmailAttempt("");
          setCreateAccountPasswordAttempt("");
          setCreateAccountError(false);
          setIsLoading(false);
        })
        .catch((err) => {
          setCreateAccountUsernameAttempt("");
          setCreateAccountEmailAttempt("");
          setCreateAccountPasswordAttempt("");
          setErrorMessage(err);
          setCreateAccountError(true);
          setIsLoading(false);
        });
  };

  const handleLogout = (event) => {
    setLoggedInUser({ username: "guest", email: "guest@email.com" });
    setIsLoggedIn(false);
    localStorage.removeItem("rememberedUser");
  };

  if (loggingIn) {
    return (
      <>
        <LoggingInSpinner />
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <LoadingSpinner />
      </>
    );
  }

  // account creation errors - request error / empty (invalid) fields

  if (createAccountError) {
    return (
      <>
        {errorMessage ? (
          <>
            <div className="above-screen-wrapper">
              <div className="standard-page-wrapper">
                <h1 className="error-title">ERROR</h1>
                <div className="standard-page-box">
                  <h2>STATUS CODE: {errorMessage.status}</h2>
                  <h3>MESSAGE: {errorMessage.response.data.msg}</h3>
                  <button
                    onClick={() => {
                      setCreateAccountError(false);
                      setIsReturningUser(false);
                      setIsNewUser(true);
                    }}
                  >
                    Create Account
                  </button>
                  <button
                    onClick={() => {
                      setCreateAccountError(false);
                      setIsNewUser(false);
                      setIsReturningUser(true);
                    }}
                  >
                    Log in
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="above-screen-wrapper">
              <div className="standard-page-wrapper">
                <h1 className="error-title">ERROR</h1>
                <div className="standard-page-box">
                  <p className="login-error-text">Please make sure you've filled in all fields correctly.</p>
                  <button
                    onClick={() => {
                      setCreateAccountError(false);
                      setIsReturningUser(false);
                      setIsNewUser(true);
                    }}
                  >
                    Create Account
                  </button>
                  <button
                    onClick={() => {
                      setCreateAccountError(false);
                      setIsNewUser(false);
                      setIsReturningUser(true);
                    }}
                  >
                    Log in
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Initial screen - select new or returning

  if (!isNewUser && !isReturningUser) {
    return (
      <>
        <div className="above-screen-wrapper">
          <div className="standard-page-wrapper">
          <h1 className="standard-title">G R E E T I N G S</h1>
          <div className="standard-page-box">
            <p>Welcome to the Museum Project!</p>
            <p>May I take your order?</p>
            <button
            className="big-button"
              onClick={() => {
                setIsNewUser(true);
                setIsReturningUser(false);
              }}
            >
              I'm a new user
            </button>
            <button
            className="big-button"
              onClick={() => {
                setIsReturningUser(true);
                setIsNewUser(false);
              }}
            >
              I'm a returning user
            </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // new user - signing up

  if (isNewUser) {
    if (accountCreated) {
      return (
        <>
          <div className="above-screen-wrapper">
            <div className="standard-page-wrapper">
              <h1 className="standard-title">S U C C E S S!</h1>
              <div className="login-page-box">
                <p>Your details:</p>
                <p>Username: {newAccount.username}</p>
                <p>Email: {newAccount.email}</p>
                <p>
                  Your password has been stored securely and must be re-entered
                  to login.
                </p>
                <button
                className="big-button"
                  onClick={() => {
                    setIsReturningUser(true);
                    setIsNewUser(false);
                    setAccountCreated(false);
                    setNewAccount({});
                  }}
                >
                  Take me to the Login!
                </button>
              </div>
            </div>
          </div>
        </>
      );
    } else
      return (
        <>
          <div className="above-screen-wrapper">
            <div className="standard-page-wrapper">
              <h1 className="standard-title">W E L C O M E</h1>
              <div className="login-page-box">
                <p>Its so nice to meet you, thank you for coming...</p>
                <label>Username: </label>
                <input
                  type="username"
                  placeholder="Enter a username..."
                  value={createAccountUsernameAttempt}
                  onChange={(event) => {
                    setCreateAccountUsernameAttempt(event.target.value);
                  }}
                />
                <label>Email Address: </label>
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={createAccountEmailAttempt}
                  onChange={(event) => {
                    setCreateAccountEmailAttempt(event.target.value);
                  }}
                />
                <label>Password: </label>
                <input
                  type="password"
                  placeholder="Enter a password..."
                  value={createAccountPasswordAttempt}
                  onChange={(event) => {
                    setCreateAccountPasswordAttempt(event.target.value);
                  }}
                />
                <button
                  className="big-button" 
                  onClick={handleNewUser}
                  >Create my Account!
                  </button>
                <button
                  className="big-button"
                  onClick={() => {
                    setIsReturningUser(true);
                    setIsNewUser(false);
                  }}
                >
                  Already have an account?
                </button>
              </div>
            </div>
          </div>
        </>
      );
  }

  // returning user - signing in

  if (isReturningUser) {
    return (
      <>
        <div className="above-screen-wrapper">
          <div className="standard-page-wrapper">
            <h1 className="standard-title">S I G N - I N</h1>
            <div className="login-page-box">
              {loginError ? (
                <p className="login-error-text">Something went wrong :( please try again...</p>
              ) : (
                <>
                  <p>Welcome back :) we missed you...</p>
                </>
              )}
              <label>Email: </label>
              <input
                type="email"
                placeholder="Enter your email address..."
                value={loginEmailAttempt}
                onChange={(event) => {
                  setLoginEmailAttempt(event.target.value);
                }}
              />
              <label>Password: </label>
              <input
                type="password"
                placeholder="Enter your password..."
                value={loginPasswordAttempt}
                onChange={(event) => {
                  setLoginPasswordAttempt(event.target.value);
                }}
              />
              <label>Keep me logged in?</label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => {
                  setRememberMe(event.target.checked);
                }}
              />
              <button 
                className="big-button"
                onClick={handleLogin}
                >Log me in!
                </button>
              <button
                className="big-button"
                onClick={() => {
                  setIsNewUser(true);
                  setIsReturningUser(false);
                }}
              >
                New user?
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default LoginPage;
