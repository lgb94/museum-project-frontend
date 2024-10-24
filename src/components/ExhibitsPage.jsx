import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllExhibits } from "../utils/exhibit-requests/exhibits-request";
import ExhibitThumbnailCard from "./ExhibitThumbnailCard";
import LoggedInContext from "../contexts/logged-in-user-context";

const ExhibitsPage = () => {
  const { loggedInUser } = useContext(LoggedInContext);
  const navigate = useNavigate();
  const [exhibitsList, setExhibitsList] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsloading(true);
    getAllExhibits()
      .then((response) => {
        setExhibitsList(response.exhibits);
        setIsError(false);
        setIsloading(false);
      })
      .catch((err) => {
        setIsError(true);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          <p>exhibits loading...</p>
        </>
      ) : (
        <>
        <Link to={`/`}><button>Home</button></Link>
        <div className="exhibit-list-header">
          <h1>Exhibits Home</h1>
          <h2>Check out all the most recent exhibits!</h2>
        </div>
          <div className="exhibit-list-wrapper">
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
        </>
      )}
    </>
  );
};

export default ExhibitsPage;
