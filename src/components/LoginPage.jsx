import { useContext, useState } from "react";
import { verifyUser } from "../utils/user-requests/login-request";
import { createAccount } from "../utils/user-requests/create-account-request";
import LoggedInContext from "../contexts/logged-in-user-context";

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
  const [loginEmailAttempt, setLoginEmailAttempt] = useState("");
  const [loginPasswordAttempt, setLoginPasswordAttempt] = useState("");
  const [createAccountError, setCreateAccountError] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    setLoggingIn(true);
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
        setLoginError(true);
        setLoggingIn(false);
      });
  };

  const handleNewUser = (event) => {
    event.preventDefault();
    setLoggingIn(true);
    return createAccount({
      username: createAccountUsernameAttempt,
      email: createAccountEmailAttempt,
      password: createAccountPasswordAttempt,
    })
      .then((response) => {
        const user = {
          username: response.user.username,
          email: response.user.email,
        };
        console.log("account created successfully");
        setAccountCreated(true);
        setCreateAccountUsernameAttempt("");
        setCreateAccountEmailAttempt("");
        setCreateAccountPasswordAttempt("");
        setCreateAccountError(false);
        setLoggingIn(false);
      })
      .catch((err) => {
        setCreateAccountUsernameAttempt("");
        setCreateAccountEmailAttempt("");
        setCreateAccountPasswordAttempt("");
        setLoggingIn(false);
        setCreateAccountError(true);
      });
  };

  const handleLogout = (event) => {
    setLoggedInUser({ username: "guest", email: "guest@email.com" });
    setIsLoggedIn(false);
    localStorage.removeItem("rememberedUser");
  };

  return (
    <div className="login-box-wrapper">
      <div className="login-box">
        <h2 className="login-header">Login</h2>
        {loggingIn ? (
          <p>working...</p>
        ) : isLoggedIn ? (
          <button className="login-button" onClick={handleLogout}>
            log out
          </button>
        ) : (
          <>
            {!isNewUser && !isReturningUser && (
              <div>
                <button
                  className="login-button"
                  onClick={() => {
                    setIsNewUser(true);
                    setIsReturningUser(false);
                  }}
                >
                  I'm a new user
                </button>
                <button
                  className="login-button"
                  onClick={() => {
                    setIsReturningUser(true);
                    setIsNewUser(false);
                  }}
                >
                  I'm a returning user
                </button>
              </div>
            )}

            {isNewUser && (
              <>
                {!accountCreated ? (
                  <>
                    <h3>New User Registration</h3>
                    {createAccountError ? (
                      <p>
                        There was an issue creating your account - please try
                        again.
                      </p>
                    ) : (
                      <></>
                    )}
                    <form onSubmit={handleNewUser}>
                      <label className="login-label">Choose a username: </label>
                      <input
                        className="login-input"
                        type="username"
                        value={createAccountUsernameAttempt}
                        onChange={(event) => {
                          setCreateAccountUsernameAttempt(event.target.value);
                        }}
                      />
                      <label className="login-label">
                        Enter your email address:{" "}
                      </label>
                      <input
                        className="login-input"
                        type="email"
                        value={createAccountEmailAttempt}
                        onChange={(event) => {
                          setCreateAccountEmailAttempt(event.target.value);
                        }}
                      />
                      <label className="login-label">Enter a password: </label>
                      <input
                        className="login-input"
                        type="password"
                        value={createAccountPasswordAttempt}
                        onChange={(event) => {
                          setCreateAccountPasswordAttempt(event.target.value);
                        }}
                      />
                      <button className="login-button">
                        Create my Account!
                      </button>
                    </form>
                    <button
                      className="login-button"
                      onClick={() => {
                        setIsReturningUser(true);
                        setIsNewUser(false);
                      }}
                    >
                      Already have an account?
                    </button>
                  </>
                ) : (
                  <>
                    <h3>Account Created Successfully!</h3>
                    <button
                      className="login-button"
                      onClick={() => {
                        setIsReturningUser(true);
                        setIsNewUser(false);
                        setAccountCreated(false);
                      }}
                    >
                      Take me to the Login!
                    </button>
                  </>
                )}
              </>
            )}

            {isReturningUser && (
              <>
                <form onSubmit={handleLogin}>
                  <label className="login-label">Email: </label>
                  <input
                    className="login-input"
                    type="email"
                    value={loginEmailAttempt}
                    onChange={(event) => {
                      setLoginEmailAttempt(event.target.value);
                    }}
                  />
                  <label className="login-label">Password: </label>
                  <input
                    className="login-input"
                    type="password"
                    value={loginPasswordAttempt}
                    onChange={(event) => {
                      setLoginPasswordAttempt(event.target.value);
                    }}
                  />
                  <label className="login-label">Keep me logged in?</label>
                  <input
                    className="login-input"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => {
                      setRememberMe(event.target.checked);
                    }}
                  />
                  <button className="login-button">Log me in!</button>
                  {loginError ? (
                    <p>error logging in - please try again</p>
                  ) : (
                    <></>
                  )}
                </form>
                <button
                  className="login-button"
                  onClick={() => {
                    setIsNewUser(true);
                    setIsReturningUser(false);
                  }}
                >
                  New user?
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
