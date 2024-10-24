import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSingleExhibitbyExhibitId } from "../utils/exhibit-requests/exhibit-by-exhibit-id";
import { getExhibitsObjectsByExhibitId } from "../utils/exhibit-object-requests/exhibit-objects-by-exhibit-id";
import { patchExhibitTitleAndDescription } from "../utils/exhibit-requests/patch-exhibit-information";
import ExhibitObjectThumbnailCard from "./ExhibitObjectThumbnailCard";
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
  const [userIsCurator, setUserIsCurator] = useState(false);
  const [editingInformation, setEditingInformation] = useState(false);
  const [newTitleAttempt, setNewTitleAttempt] = useState("");
  const [newDescriptionAttempt, setNewDescriptionAttempt] = useState("");
  const [isEmptyExhibit, setIsEmptyExhibit] = useState(false);
  const [infoUpdateError, setInfoUpdateError] = useState(false);

  useEffect(() => {
    setIsError(false);
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
    <p>exhibit loading...</p>
    </>);
  }

  if (isError) {
    return (
      <>
      <Link to={`/exhibits`}><button>Back to exhibits</button></Link>
      <div className="exhibit-list-header">
        <p>This exhibit doesnt exist... Why are you here?</p>
        </div>
      </>
    );
  }


  if (isEmptyExhibit && !userIsCurator) {
    return (
      <>
      <Link to={`/exhibits`}><button>Back to exhibits</button></Link>
      <div className="exhibit-list-header">
        <h1>This exhibit is closed - you shouldn't be here!</h1>
        <h2>
          You sneaky little devil how did you get here? There's nothing for you
          here just yet now SCRAM!
        </h2>
        <button onClick={() => navigate("/exhibits")}>
          Im sorry! (Escort me out)
        </button>
        </div>
      </>
    );
  }

  if (isEmptyExhibit && userIsCurator) {
    return (
      <>
      <Link to={`/exhibits`}><button>Back to exhibits</button></Link>
      <div className="exhibit-list-header">
        {editingInformation ? (
          <>
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
              onChange={(event) => setNewDescriptionAttempt(event.target.value)}
            />
            <button onClick={handleExhibitInformationChange}>
              Save all changes
            </button>
            <button onClick={() => setEditingInformation(false)}>
              Cancel changes
            </button>
          </>
        ) : (
          <>
            <h1>{exhibitInfo.title}</h1>
            <h2>{exhibitInfo.description}</h2>
            <h3>
              An exhibit by:{" "}
              <Link to={`/user/${exhibitInfo.curator_id}`}>
                {exhibitInfo.curator_username}
              </Link>
            </h3>
          </>
        )}
        <div>
          {userIsCurator && editingInformation === false ? (
            <button onClick={() => setEditingInformation(true)}>
              Edit exhibit information
            </button>
          ) : null
          }
        </div>
        <p>This exhibit is empty</p>
        <p>Go to the objects page and add some objects to open this exhibit!</p>
        <button onClick={() => navigate("/objects")}>Objects page</button>
        </div>
      </>
    );
  }

  if(!isEmptyExhibit && userIsCurator){
  return (
    <>
    <Link to={`/exhibits`}><button>Back to exhibits</button></Link>
    <div className="exhibit-list-header">
    
      {editingInformation ? (
        <>
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
            onChange={(event) => setNewDescriptionAttempt(event.target.value)}
          />
          <button onClick={handleExhibitInformationChange}>
            Save all changes
          </button>
          <button onClick={() => setEditingInformation(false)}>
            Cancel changes
          </button>
          </>
      ) : (
        <>
          <h1>{exhibitInfo.title}</h1>
          <h2>{exhibitInfo.description}</h2>
          <h3>
            An exhibit by:{" "}
            <Link to={`/user/${exhibitInfo.curator_id}`}>
              {exhibitInfo.curator_username}
            </Link>
          </h3>
        </>
      )}
      <div>
        {userIsCurator && editingInformation === false ? (
          <>
          <button onClick={() => setEditingInformation(true)}>
            Edit exhibit information
          </button>
          <p>*To remove an object from your exhibit, hover over it and click remove.*</p>
          </>
        ) : null
        }
      </div>
      {infoUpdateError ? (
        <>
          <p>error updating information please try again</p>
        </>
      ) : null
      }
</div>
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

  if(!isEmptyExhibit && !userIsCurator){
    return (
      <>
      <Link to={`/exhibits`}><button>Back to exhibits</button></Link>
      <Link to={`/user/${exhibitInfo.curator_id}`}><button>See more by this user</button></Link>
      <div className="exhibit-list-header">
        {editingInformation ? (
          <>
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
              onChange={(event) => setNewDescriptionAttempt(event.target.value)}
            />
            <button onClick={handleExhibitInformationChange}>
              Save all changes
            </button>
            <button onClick={() => setEditingInformation(false)}>
              Cancel changes
            </button>
          </>
        ) : (
          <>
            <h1>{exhibitInfo.title}</h1>
            <h2>{exhibitInfo.description}</h2>
            <h3>
              An exhibit by:{" "}
              <Link to={`/user/${exhibitInfo.curator_id}`}>
                {exhibitInfo.curator_username}
              </Link>
            </h3>
          </>
        )}
        <div>
          {userIsCurator && editingInformation === false ? (
            <button onClick={() => setEditingInformation(true)}>
              Edit exhibit information
            </button>
          ) : null
          }
        </div>
        </div>
        {infoUpdateError ? (
          <>
            <p>error updating information please try again</p>
          </>
        ) : null
        }
  
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

};

export default ExhibitViewer;
