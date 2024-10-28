import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getObjectById } from "../utils/object-requests/single-object-request";
import { getExhibitsByUserId } from "../utils/exhibit-requests/exhibit-by-user-id";
import { addObjectToExhibit } from "../utils/exhibit-object-requests/add-object-to-exhibit";
import ErrorPage from "./ErrorPage";
import LoggedInContext from "../contexts/logged-in-user-context";
import LoadingSpinner from "./LoadingSpinner";

const SingleObjectPage = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [currentObjectId, setCurrentObjectId] = useState(param.object_id);
  const [currentObject, setCurrentObject] = useState({});
  const { loggedInUser, isLoggedIn } = useContext(LoggedInContext);
  const [exhibits, setExhibits] = useState([]);
  const [selectedExhibit, setSelectedExhibit] = useState("");
  const [addedTo, setAddedTo] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [addToExhibitSuccess, setAddToExhibitSuccess] = useState(false);
  const [addToExhibitError, setAddToExhibitError] = useState(false);

  useEffect(() => {
    setIsError(false);
    setErrorMessage("");
    setIsloading(true);
    getObjectById(currentObjectId)
      .then((response) => {
        setCurrentObject(response.object);
        if (loggedInUser.user_id !== 0) {
          getExhibitsByUserId(loggedInUser.user_id)
            .then((response) => {
              setExhibits(response.exhibits);
              setIsError(false);
              setIsloading(false);
            })
            .catch((err) => {
              if (
                err.response.data.msg ===
                "bad request - no exhibits matching user_id"
              ) {
                setIsloading(false);
              } else {
                setErrorMessage(err);
                setIsError(true);
                setIsloading(false);
              }
            });
        } else {
          setIsError(false);
          setIsloading(false);
        }
      })
      .catch((err) => {
        setErrorMessage(err);
        setIsError(true);
        setIsloading(false);
      });
  }, [currentObjectId, loggedInUser.user_id]);

  const handleExhibitAddition = (event) => {
    event.preventDefault();
    setAddToExhibitError(false);
    setAddToExhibitSuccess(false);
    setAddedTo("");
    if (selectedExhibit) {
      const updateObject = {
        object_id: 1 * currentObjectId,
        exhibit_id: 1 * selectedExhibit,
      };
      addObjectToExhibit(updateObject)
        .then((response) => {
          setAddToExhibitSuccess(true);
          setAddedTo(selectedExhibit);
          setSelectedExhibit("");
        })
        .catch((err) => {
          setAddToExhibitError(true);
          setAddToExhibitSuccess(false);
          setSelectedExhibit("");
        });
    }
  };

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
    <>
    <div className="above-screen-wrapper">
      <div className="standard-page-wrapper">
      <h1 className="single-object-title">{currentObject.title}</h1>
        <div className="single-object-image-and-info-wrapper">
          <img
            className="single-object-image"
            src={`${currentObject.primary_image}`}
            alt={`Image of ${currentObject.title}`}
          />
          <div className="single-object-information">
            <p>Culture: {currentObject.culture}</p>
            <p>Period: {currentObject.period}</p>
            <p>Object Begin Date: {currentObject.object_begin_date}</p>
            <p>Object End Date: {currentObject.object_end_date}</p>
            <p>Medium: {currentObject.medium}</p>
            <p>Classification: {currentObject.classification}</p>
            <p>Museum Dataset: {currentObject.museum_dataset}</p>
            <p>
              Object Link:{" "}
              <a href={currentObject.object_url} target="_blank">
                {currentObject.object_url}
              </a>
            </p>
            <button
              className="single-object-back-to-search-button"
              onClick={() => navigate(-1)}
            >
              Back to my Search
            </button>
            <div className="single-object-add-to-exhibit-wrapper">
              {loggedInUser.user_id !== 0 && exhibits.length > 0 ? (
                <>
                  <div>
                    <label className="single-object-add-to-label">
                      Add to exhibit:{" "}
                    </label>
                    <select
                      className="single-object-add-to-select"
                      value={selectedExhibit}
                      onChange={(event) =>
                        setSelectedExhibit(event.target.value)
                      }
                    >
                      <option className="single-object-add-to-option" value="">
                        Select an Exhibit
                      </option>
                      {exhibits.map((exhibit) => (
                        <option
                          className="single-object-add-to-option"
                          key={exhibit.exhibit_id}
                          value={exhibit.exhibit_id}
                        >
                          {exhibit.title}
                        </option>
                      ))}
                    </select>
                    <button
                      className="single-object-add-to-button"
                      onClick={handleExhibitAddition}
                    >
                      Add
                    </button>
                    
                  </div>
                  {addToExhibitSuccess ? (
                    <>
                      <p>object added successfully!</p>
                      <Link to={`/exhibits/${addedTo}`}>
                        <button>Take me to my exhibit!</button>
                      </Link>
                    </>
                  ) : (
                    <>
                      {addToExhibitError ? (
                        <>
                          <p>
                            error adding object - does your exhibit already have
                            this object?
                          </p>
                          <Link to={`/user/${loggedInUser.user_id}`}>
                            <button>my exhibits</button>
                          </Link>
                          
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  {isLoggedIn ? (
                    <>
                      <p>Create an exhibit to save this object!</p>
                      <Link to={`/user/${loggedInUser.user_id}`}>
                        <button>My Exhibits</button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <p>
                        log in and you'll be able to save this object to an
                        exhibit!
                      </p>
                      <Link to={`/`}>
                        <button>log in</button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default SingleObjectPage;
