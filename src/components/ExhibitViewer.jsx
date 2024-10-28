import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSingleExhibitbyExhibitId } from "../utils/exhibit-requests/exhibit-by-exhibit-id";
import { getExhibitsObjectsByExhibitId } from "../utils/exhibit-object-requests/exhibit-objects-by-exhibit-id";
import { patchExhibitTitleAndDescription } from "../utils/exhibit-requests/patch-exhibit-information";
import ExhibitObjectThumbnailCard from "./ExhibitObjectThumbnailCard";
import ErrorPage from "./ErrorPage";
import LoadingSpinner from "./LoadingSpinner";
import LoggedInContext from "../contexts/logged-in-user-context";

const ExhibitViewer = () => {
  const param = useParams();
  const navigate = useNavigate();
  const { loggedInUser } = useContext(LoggedInContext);

  const [exhibitId, setExhibitId] = useState(param.exhibit_id);
  const [exhibitInfo, setExhibitInfo] = useState({});
  const [exhibitObjects, setExhibitObjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userIsCurator, setUserIsCurator] = useState(false);
  const [editingInformation, setEditingInformation] = useState(false);
  const [newTitleAttempt, setNewTitleAttempt] = useState("");
  const [newDescriptionAttempt, setNewDescriptionAttempt] = useState("");
  const [isEmptyExhibit, setIsEmptyExhibit] = useState(false);
  const [infoUpdateError, setInfoUpdateError] = useState(false);

  useEffect(() => {
    setIsError(false);
    setErrorMessage("");
    setIsLoading(true);
    setUserIsCurator(false);
    getSingleExhibitbyExhibitId(exhibitId)
      .then((response) => {
        setExhibitInfo(response.exhibit);
        setNewTitleAttempt(response.exhibit.title);
        setNewDescriptionAttempt(response.exhibit.description);
        if (response.exhibit.curator_id === loggedInUser.user_id) {
          setUserIsCurator(true);
        }
        return getExhibitsObjectsByExhibitId(exhibitId);
      })
      .then((response) => {
        if (response.objects.length > 0) {
          setExhibitObjects(response.objects);
          setIsLoading(false);
        } else {
          setIsEmptyExhibit(true);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setErrorMessage(err);
        setIsError(true);
      });
  }, [exhibitId, loggedInUser]);

  const updateInformation = {};

  const handleExhibitInformationChange = (event) => {
    event.preventDefault();
    setInfoUpdateError(false);
    if (newTitleAttempt !== exhibitInfo.title && newTitleAttempt !== "") {
      updateInformation.new_title = newTitleAttempt;
    }
    if (
      newDescriptionAttempt !== exhibitInfo.description &&
      newDescriptionAttempt !== ""
    ) {
      updateInformation.new_description = newDescriptionAttempt;
    }
    updateInformation.user_id = loggedInUser.user_id;
    patchExhibitTitleAndDescription(exhibitId, updateInformation)
      .then((response) => {
        setEditingInformation(false);
        setExhibitInfo(response.updatedExhibit);
      })
      .catch((err) => {
        setInfoUpdateError(true);
        setNewTitleAttempt(exhibitInfo.title);
        setNewDescriptionAttempt(exhibitInfo.description);
        setEditingInformation(false);
      });
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

  // VIEWING YOUR OWN EXHIBIT (EMPTY EXHIBIT)

  if (isEmptyExhibit && userIsCurator) {
    return (
      <>
        {editingInformation ? (
          <>
            <div className="above-screen-wrapper">
              <div className="standard-page-box">
                <h2>Exhibit title:</h2>
                <input
                  type="text"
                  value={newTitleAttempt}
                  onChange={(event) => setNewTitleAttempt(event.target.value)}
                />
                <h2>Exhibit description</h2>
                <input
                  type="text"
                  value={newDescriptionAttempt}
                  onChange={(event) =>
                    setNewDescriptionAttempt(event.target.value)
                  }
                />
                <p className="exhibit-create-text">
                  This information will be displayed publicly on your exhibit
                  page so please be considerate of others when entering these
                  details
                </p>
                <p className="exhibit-create-text">
                  This information will also be displayed alongside each object
                  in your exhibit - make sure its relevant to what your
                  displaying. (or dont!)
                </p>
                <button onClick={handleExhibitInformationChange}>
                  Save all changes
                </button>
                <button onClick={() => setEditingInformation(false)}>
                  Cancel changes
                </button>
              </div>
            </div>
            <div className="standard-page-header">
              <h1 className="standard-title">{exhibitInfo.title}</h1>
              <h2>{exhibitInfo.description}</h2>
              <h3>
                An exhibit by:{" "}
                <Link to={`/user/${exhibitInfo.curator_id}`}>
                  {exhibitInfo.curator_username}
                </Link>
              </h3>
              {userIsCurator && editingInformation === false ? (
                <button onClick={() => setEditingInformation(true)}>
                  Edit exhibit information
                </button>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <div className="standard-page-header">
              <h1 className="standard-title">{exhibitInfo.title}</h1>
              <h2>{exhibitInfo.description}</h2>
              <h3>
                An exhibit by:{" "}
                <Link to={`/user/${exhibitInfo.curator_id}`}>
                  {exhibitInfo.curator_username}
                </Link>
              </h3>
              {userIsCurator && editingInformation === false ? (
                <button onClick={() => setEditingInformation(true)}>
                  Edit exhibit information
                </button>
              ) : null}
            </div>
          </>
        )}
        <div className="standard-page-wrapper">
          <div className="standard-page-box">
            <h1>This Exhibit is currently empty!</h1>
            <p>
              Go to the objects page and add some objects to open this exhibit!
            </p>
            <button onClick={() => navigate("/objects")}>Objects page</button>
          </div>
        </div>
      </>
    );
  }

  // VIEWING YOUR OWN EXHIBIT (NOT EMPTY)

  if (!isEmptyExhibit && userIsCurator) {
    return (
      <>
        {editingInformation ? (
          <>
            <div className="above-screen-wrapper">
              <div className="standard-page-wrapper">
              <h1 className="standard-title">EDIT INFORMATION</h1>
              <div className="standard-page-box">
                <h2>Exhibit title:</h2>
                <input
                  className="title-input-field"
                  type="text"
                  value={newTitleAttempt}
                  onChange={(event) => setNewTitleAttempt(event.target.value)}
                />
                <h2>Exhibit description</h2>
                <textarea
                  className="description-input-field"
                  type="text"
                  value={newDescriptionAttempt}
                  onChange={(event) =>
                    setNewDescriptionAttempt(event.target.value)
                  }
                />
                <p className="exhibit-create-text">
                  This information will be displayed publicly on your exhibit
                  page so please be considerate of others when entering these
                  details
                </p>
                <p className="exhibit-create-text">
                  This information will also be displayed alongside each object
                  in your exhibit - make sure its relevant to what your
                  displaying. (or dont!)
                </p>
                <button onClick={handleExhibitInformationChange}>
                  Save all changes
                </button>
                <button onClick={() => setEditingInformation(false)}>
                  Cancel changes
                </button>
              </div>
            </div>
            </div>
            <div className="standard-page-header">
              <h1 className="standard-title">{exhibitInfo.title}</h1>
              <h2>{exhibitInfo.description}</h2>
              <h3>
                An exhibit by:{" "}
                <Link to={`/user/${exhibitInfo.curator_id}`}>
                  {exhibitInfo.curator_username}
                </Link>
              </h3>
            </div>
          </>
        ) : (
          <>
            <div className="standard-page-header">
              <h1 className="standard-title">{exhibitInfo.title}</h1>
              <h2>{exhibitInfo.description}</h2>
              <h3>
                An exhibit by:{" "}
                <Link to={`/user/${exhibitInfo.curator_id}`}>
                  {exhibitInfo.curator_username}
                </Link>
              </h3>
        <div>
          {infoUpdateError ? (
            <>
              <p>error updating information please try again</p>
            </>
          ) : null}
          {userIsCurator && editingInformation === false ? (
            <>
              <button onClick={() => setEditingInformation(true)}>
                Edit exhibit information
              </button>
              <p>
                *To remove an object from your exhibit, hover over it and click
                remove.*
              </p>
            </>
          ) : null}
        </div>
            </div>
          </>
        )}

        <ul className="object-thumbnail-list">
          {exhibitObjects.map((exhibitObject) => (
            <div key={exhibitObject.exhibit_object_id}>
              <ExhibitObjectThumbnailCard
                exhibitId={exhibitId}
                exhibitObject={exhibitObject}
                exhibitInfo={exhibitInfo}
              />
            </div>
          ))}
        </ul>
      </>
    );
  }

  // VIEWING ANOTHER PERSONS EXHIBIT (EMPTY)

  if (isEmptyExhibit && !userIsCurator) {
    return (
      <>
        <div className="standard-page-header">
          <h1 className="standard-title">{exhibitInfo.title}</h1>
          <h2>{exhibitInfo.description}</h2>
          <h3>
            An exhibit by:{" "}
            <Link to={`/user/${exhibitInfo.curator_id}`}>
              {exhibitInfo.curator_username}
            </Link>
          </h3>
          <Link to={`/exhibits`}>
            <button>Back to exhibits</button>
          </Link>
        </div>
        <div className="above-screen-wrapper">
        <div className="standard-page-wrapper">
            <h1 className="error-tile">ERROR</h1>
          <div className="standard-page-box">
            <p>
              YOU SHOULD NOT BE HERE MORTAL. There's nothing for
              you here just yet - we won't question how you got here either but you MUST LEAVE.
            </p>
            <button onClick={() => navigate("/exhibits")}>
              Im sorry! (Escort me out)
            </button>
          </div>
        </div>
        </div>
      </>
    );
  }

  // VIEWING ANOTHER PERSONS EXHIBIT (NOT EMPTY)

  if (!isEmptyExhibit && !userIsCurator) {
    return (
      <>
        <div className="standard-page-header">
          <h1 className="standard-title">{exhibitInfo.title}</h1>
          <h2>{exhibitInfo.description}</h2>
          <h3>
            An exhibit by:{" "}
            <Link to={`/user/${exhibitInfo.curator_id}`}>
              {exhibitInfo.curator_username}
            </Link>
          </h3>
          <Link to={`/user/${exhibitInfo.curator_id}`}>
            <button>{`${exhibitInfo.curator_username}'s exhibits`}</button>
          </Link>
          <Link to={`/exhibits`}>
            <button>All Exhibits</button>
          </Link>
        </div>
        <div>
        <ul className="object-thumbnail-list">
          {exhibitObjects.map((exhibitObject) => (
            <div key={exhibitObject.exhibit_object_id}>
              <ExhibitObjectThumbnailCard
                exhibitId={exhibitId}
                exhibitObject={exhibitObject}
                exhibitInfo={exhibitInfo}
              />
            </div>
          ))}
        </ul>
        </div>
      </>
    );
  }
};

export default ExhibitViewer;
