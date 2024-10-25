import { useNavigate } from "react-router-dom";

const ErrorPage = (props) => {
  const navigate = useNavigate();

  const error = props.err;

  if (error) {
    return (
      <>
        <div className="error-page-wrapper">
          <div className="error-page-box">
            <h1>ERROR</h1>
            <h2>STATUS CODE: {error.status}</h2>
            <h3>MESSAGE: {error.response.data.msg}</h3>
            <button onClick={() => navigate(-1)}>Previous Page</button>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="error-page-wrapper">
        <div className="error-page-box">
          <h1>ERROR</h1>
          <h2>STATUS CODE: 404</h2>
          <h3>MESSAGE: THIS PAGE DOESNT EXIST</h3>
          <button onClick={() => navigate("/")}>Site Home</button>
        </div>
      </div>
    );
  }
};
export default ErrorPage;
