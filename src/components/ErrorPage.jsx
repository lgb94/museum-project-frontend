import { useNavigate } from "react-router-dom";

const ErrorPage = (props) => {
  const navigate = useNavigate();

  const error = props.err;

  if (error) {
    return (
      <>
        <div className="above-screen-wrapper">
          <div className="standard-page-wrapper">
            <h1 className="error-title">ERROR</h1>
          <div className="standard-page-box">
            <h2>STATUS CODE: {error.status}</h2>
            <h3>MESSAGE: {error.response.data.msg}</h3>
            <button onClick={() => navigate(-1)}>Previous Page</button>
          </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="above-screen-wrapper">
        <div className="standard-page-box">
          <h1 className="error-title">ERROR</h1>
        <div className="standard-page-box">
          <h2>STATUS CODE: 404</h2>
          <h3>MESSAGE: THIS PAGE DOESNT EXIST</h3>
          <button onClick={() => navigate("/")}>Site Home</button>
        </div>
        </div>
      </div>
    );
  }
};
export default ErrorPage;
