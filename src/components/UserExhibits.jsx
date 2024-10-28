import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUserByUserId } from "../utils/user-requests/get-user-by-user-id";
import { getExhibitsByUserId } from "../utils/exhibit-requests/exhibit-by-user-id";
import ExhibitThumbnailCard from "./ExhibitThumbnailCard";
import ErrorPage from "./ErrorPage";
import LoggedInContext from "../contexts/logged-in-user-context";
import LoadingSpinner from "./LoadingSpinner";

const UserExhibits = () => {
  const param = useParams();
  const navigate = useNavigate();
  const { loggedInUser } = useContext(LoggedInContext);

  const [pageUserId, setPageUserId] = useState(param.user_id);
  const [pageCuratorUsername, setPageCuratorUsername] = useState("");
  const [userIdExhibits, setUserIdExhibits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userIsCurator, setUserIsCurator] = useState(false);
  const [curatorExists, setCuratorExists] = useState(false);
  const [curatorHasNoExhibits, setCuratorHasNoExhibits] = useState(false);

  useEffect(() => {
    setUserIsCurator(false);
    setPageUserId(param.user_id);
    setIsError(false);
    setErrorMessage("");
    setIsLoading(true);
    getUserByUserId(param.user_id)
      .then((response) => {
        setCuratorExists(true);
        setPageCuratorUsername(response.user.username);
        if (loggedInUser && loggedInUser.user_id === response.user.user_id) {
          setUserIsCurator(true);
        }
        setTimeout(() => {
          getExhibitsByUserId(pageUserId)
            .then((response) => {
              if (response.exhibits.length > 0) {
                setUserIdExhibits(response.exhibits);
              } else {
                setCuratorHasNoExhibits(true);
              }
              setIsLoading(false);
            })
            .catch((err) => {
              setErrorMessage(err);
              setIsLoading(false);
              setIsError(true);
            });
        }, 1000);
      })
      .catch((err) => {
        setErrorMessage(err);
        setIsLoading(false);
        setIsError(true);
      });
  }, [pageUserId, loggedInUser, param.user_id]);

  if (isLoading) {
    return (
      <>
        <LoadingSpinner />
      </>
    );
  }

  if (isError) {
    if (
      errorMessage.response.data.msg === "bad request - user_id not recognised"
    ) {
      if ((loggedInUser.user_id === 0) && ( pageUserId === "0" )) {
        return (
          <div className="above-screen-wrapper">
            <div className="standard-page-wrapper">
              <h1 className="error-title">ERROR</h1>
            <div className="standard-page-box">
              <p>You need to be logged in to see your exhibits...</p>
              <Link to={`/`}>
                <button>login</button>
              </Link>
            </div>
            </div>
          </div>
        );
      }
      return (
        <>
          <ErrorPage err={errorMessage} />
        </>
      );
    } else if (curatorExists) {
      return (
        <>
          <div className="above-screen-wrapper">
            <div className="standard-page-wrapper">
              <h1 className="error-title">ERROR</h1>
            <div className="standard-page-box">
              <p>This Curator has no exhibits, how sad... But then, why are you here?</p>
              <button onClick={() => navigate(-1)}>
                Back to previous page
              </button>
              <button onClick={() => navigate("/exhibits")}>
                Exhibits page
              </button>
            </div>
            </div>
          </div>
        </>
      );
    } else {
      <>
        <ErrorPage err={errorMessage} />
      </>;
    }
  }

  if (curatorHasNoExhibits && !userIsCurator) {
    if (loggedInUser.user_id === 1 * pageUserId) {
      setUserIsCurator(true);
    }
    return (
      <>
      <div className="above-screen-wrapper">
        <div className="standard-page-wrapper">
          <h1 className="error-title">ERROR</h1>
        <div className="standard-page-box">
        <p>
          This curator has no exhibits - call them and let them know how silly
          that is!
        </p>
        <Link to={`/exhibits`}>
        <button>Exhibits page</button>
        </Link>
        </div>
        </div>
        
        </div>
      </>
    );
  }

  if (curatorHasNoExhibits && userIsCurator) {
    return (
      <>
      <div className="above-screen-wrapper">
        <div className="standard-page-wrapper">
          <h1 className="error-title">ERROR</h1>
      <div className="standard-page-box">
        <p>You haven't made any exhibits yet... You should make one!</p>
        <Link to={`/exhibits/create`}>
          <button>Create an exhibit!</button>
        </Link>
        <Link to={`/exhibits`}>
        <button>Exhibits page</button>
        </Link>
        </div>
        </div>
        </div>
      </>
    );
  }

  const exhibitsWithObjects = userIdExhibits.filter(
    (exhibit) => exhibit.object_count > 0
  );

  return (
    <>
    <div className="full-page-wrapper">
      {userIsCurator ? (
        <div className="standard-page-header">
          <h1 className="standard-title">Your Exhibits!</h1>
          <p>This is the list of all your exhibits - if you wish to delete an exhibit, hover over it and click the delete exhibit button. THIS ACTION IS IRREVERSIBLE</p>
          <p>To add objects to an exhibit, go to the object page, find an object and use the drop-down menu from that objects page.</p>
          <Link to={`/exhibits/create`}>
            <button>Create an Exhibit!</button>
          </Link>
            <Link to={`/exhibits`}><button>Back to All Exhibits</button></Link>
        </div>
      ) : (
        <div className="standard-page-header">
          <h1 className="standard-title">{pageCuratorUsername}'s Exhibits!</h1>
          <p>You are now viewing all of {pageCuratorUsername}'s exhibits that are open to the public - click an exhibit to enter!
            Once inside, click an object to start looking around!
          </p>
          <Link to={`/exhibits`}><button>Back to All Exhibits</button></Link>
        </div>
      )}
      {userIdExhibits.length === 0 ? (
        <></>
      ) : (
        
        <div className="standard-page-wrapper">
          {loggedInUser.user_id === 1 * pageUserId ? (
            <div className="exhibit-thumbnail-list">
              {userIdExhibits.map((exhibit) => {
                return (
                  <div key={exhibit.exhibit_id}>
                    <ExhibitThumbnailCard exhibit={exhibit} />
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              {exhibitsWithObjects.length > 0 ? (
                <>
                  <div className="exhibit-thumbnail-list">
                    {userIdExhibits.map((exhibit) => {
                      if (exhibit.object_count > 0) {
                        return (
                          <div key={exhibit.exhibit_id}>
                            <ExhibitThumbnailCard exhibit={exhibit} />
                          </div>
                        );
                      }
                    })}
                  </div>
                </>
              ) : (
                <>
                  <p>this person has nothing for you to see...</p>
                </>
              )}
            </>
          )}
        </div>
      )}
      </div>
    </>
  );
};

export default UserExhibits;
