import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUserByUserId } from "../utils/user-requests/get-user-by-user-id";
import { getExhibitsByUserId } from "../utils/exhibit-requests/exhibit-by-user-id";
import ExhibitThumbnailCard from "./ExhibitThumbnailCard";
import LoggedInContext from "../contexts/logged-in-user-context";

const UserExhibits = () => {
  const param = useParams();
  const navigate = useNavigate();
  const { loggedInUser } = useContext(LoggedInContext);

  const [pageUserId, setPageUserId] = useState(param.user_id);
  const [pageCuratorUsername, setPageCuratorUsername] = useState("");
  const [userIdExhibits, setUserIdExhibits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userIsCurator, setUserIsCurator] = useState(false);
  const [curatorExists, setCuratorExists] = useState(false);
  const [curatorHasNoExhibits, setCuratorHasNoExhibits] = useState(false);

  useEffect(() => {
    setPageUserId(param.user_id);
    setIsError(false);
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
              setIsLoading(false);
              setIsError(true);
            });
        }, 1000);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
      });
  }, [pageUserId, loggedInUser, param.user_id]);

  if (isLoading) {
    return <p>page loading...</p>;
  }

  if (isError && curatorExists) {
    return (
      <>
        <p>Curator has no exhibits!</p>
        <button onClick={() => navigate(-1)}>Back to previous page</button>
        <button onClick={() => navigate("/exhibits")}>Exhibits page</button>
      </>
    );
  }

  if (isError && !curatorExists) {
    return (
      <>
        <p>Curator doesnt exist!</p>
        <button onClick={() => navigate(-1)}>Back to previous page</button>
        <button onClick={() => navigate("/exhibits")}>Exhibits page</button>
      </>
    );
  }

  if (curatorHasNoExhibits && !userIsCurator) {
    if (loggedInUser.user_id === 1 * pageUserId) {
      setUserIsCurator(true);
    }
    return (
      <>
        <p>
          This curator has no exhibits - call them and let them know how silly
          that is!
        </p>
        <button>Exhibits page</button>
      </>
    );
  }

  if (curatorHasNoExhibits && userIsCurator) {
    return (
      <>
        <p>You have no exhibits - make one!</p>
        <Link to={`/exhibits/create`}>
          <button>create an exhibit</button>
        </Link>
      </>
    );
  }

  const exhibitsWithObjects = userIdExhibits.filter(
    (exhibit) => exhibit.object_count > 0
  );

  return (
    <>
      <Link to={`/`}>
        <button>Home</button>
      </Link>
      {userIsCurator ? (
        <div className="user-exhibit-header-wrapper">
          <h1>Your Exhibits!</h1>
          <Link to={`/exhibits/create`}>
            <button>CREATE A NEW EXHIBIT</button>
          </Link>
        </div>
      ) : (
        <div className="user-exhibit-header-wrapper">
          <h1>{pageCuratorUsername}'s Exhibits!</h1>
        </div>
      )}
      {userIdExhibits.length === 0 ? (
        <></>
      ) : (
        <div className="user-exhibit-thumbnail-wrapper">
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
    </>
  );
};

export default UserExhibits;
