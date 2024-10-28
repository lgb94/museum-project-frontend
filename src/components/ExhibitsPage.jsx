import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllExhibits } from "../utils/exhibit-requests/exhibits-request";
import ExhibitThumbnailCard from "./ExhibitThumbnailCard";
import ErrorPage from "./ErrorPage";
import LoadingSpinner from "./LoadingSpinner";
import LoggedInContext from "../contexts/logged-in-user-context";

const ExhibitsPage = () => {
  const { loggedInUser } = useContext(LoggedInContext);
  const navigate = useNavigate();
  const [exhibitsList, setExhibitsList] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setIsError(false);
    setErrorMessage("");
    setIsloading(true);
    getAllExhibits()
      .then((response) => {
        setExhibitsList(response.exhibits);
        setIsloading(false);
      })
      .catch((err) => {
        setIsloading(false);
        setIsError(true);
        setErrorMessage(err);
      });
  }, []);

  if (isLoading) {
    return (
      <>
        <LoadingSpinner />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <ErrorPage err={errorMessage} />
      </>
    );
  }

  return (
    <div className="full-page-wrapper">
      <div className="standard-page-header">
        <h1 className="standard-title">Exhibits Home</h1>
        <p>This is a list of all the exhibits available to view from Museum Project users. Exhibits will appear here when they contain at least one object.</p>
        <p>Click the Exhibits Name to enter that Exhibit!</p>
        <p>Clicking the name of a curator will take you to a list of all that curators exhibits!</p>
      <Link to={`/`}>
        <button>Home</button>
      </Link>
      <Link to={`/user/${loggedInUser.user_id}`}><button>My Exhibits</button></Link>
      </div>
    <div className="standard-page-wrapper">
        <div className="exhibit-thumbnail-list">
          {exhibitsList.map((exhibit) => {
            if (exhibit.object_count > 0) {
              return (
                <div key={exhibit.exhibit_id}>
                  <ExhibitThumbnailCard exhibit={exhibit} />
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default ExhibitsPage;
