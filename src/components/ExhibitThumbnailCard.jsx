import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getExhibitsObjectsByExhibitId } from "../utils/exhibit-object-requests/exhibit-objects-by-exhibit-id";
import { deleteExhibitWithExhibitId } from "../utils/exhibit-requests/delete-exhibit";
import LoggedInContext from "../contexts/logged-in-user-context";

const ExhibitThumbnailCard = (props) => {
  const exhibit = props.exhibit;
  const param = useParams()
  const { loggedInUser } = useContext(LoggedInContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEmptyExhibit, setIsEmptyExhibit] = useState(false);
  const [exhibitFirstObject, setExhibitFirstObject] = useState({});
  const [deleteable, setDeletable] = useState(false);
  const [exhibitDeleted, setExhibitDeleted] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsEmptyExhibit(false);
    getExhibitsObjectsByExhibitId(exhibit.exhibit_id)
      .then((response) => {
        if (response.objects.length > 0) {
          setExhibitFirstObject(response.objects[0]);
        } else {
          setIsEmptyExhibit(true);
        }
        setIsError(false);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsError(true);
        setIsLoading(false);
      });
  }, [exhibit.exhibit_id]);

  if (isLoading) {
    return <p>exhibit found...</p>;
  }

  if (isError) {
    return <p>error retrieving thumbnail card.</p>;
  }

  if (isEmptyExhibit) {
    return (
      <>
        <div
          className="exhibit-thumbnail-wrapper"
          key={exhibit.exhibit_id}
          onMouseEnter={(event) => {
            if ((loggedInUser.user_id === exhibit.curator_id) && (param.user_id !== undefined )) {
              setDeletable(true);
            }
          }}
          onMouseLeave={(event) => {
            if ((loggedInUser.user_id === exhibit.curator_id) && (param.user_id !== undefined )) {
              setDeletable(false);
            }
          }}
        >
          {exhibitDeleted ? (
            <>
              <li>
                <h2>This exhibit has been deleted</h2>
                <p>Refresh the page to remove this from the list.</p>
              </li>
            </>
          ) : (
            <>
            <img
          className="exhibit-thumbnail-image"
          src={'../../assets/de-milo.png'}
          alt={`A placeholder image for an empty exhibit`}
              />
              <div className="exhibit-thumbnail-information">
                <Link to={`/exhibits/${exhibit.exhibit_id}`}>
                  <h1 className="error-title" >{exhibit.title}</h1>
                </Link>
                <Link to={`/user/${exhibit.curator_id}`}>
                  <p>by {exhibit.curator_username}</p>
                </Link>
                <p>"{exhibit.description}"</p>
                <p>
                  This exhibit is empty! Find a good object and get it added!
                </p>
                <p>
                  Exhibits are not visible to the public until they contain at
                  least 1 object.
                </p>
                {deleteable ? (
                  <>
                    <button
                      onClick={(event) => {
                        setDeleteError(false);
                        deleteExhibitWithExhibitId(exhibit.exhibit_id)
                          .then((res) => {
                            setExhibitDeleted(true);
                          })
                          .catch((err) => {
                            setDeleteError(true);
                          });
                      }}
                    >
                      Delete this exhibit?
                    </button>
                    {deleteError ? (
                      <p>error deleting exhibit, try again?</p>
                    ) : null}
                  </>
                ) : null}
              </div>
            </>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="exhibit-thumbnail-wrapper"
        key={exhibit.exhibit_id}
        onMouseEnter={(event) => {
          if ((loggedInUser.user_id === exhibit.curator_id) && (param.user_id !== undefined )) {
            setDeletable(true);
          }
        }}
        onMouseLeave={(event) => {
          if ((loggedInUser.user_id === exhibit.curator_id) && (param.user_id !== undefined )) {
            setDeletable(false);
          }
        }}
      >
        {exhibitDeleted ? (
          <>
            <li>
              <h2>This exhibit has been deleted</h2>
              <p>Refresh the page to remove this from the list.</p>
            </li>
          </>
        ) : (
          <>
          
          <img
          className="exhibit-thumbnail-image"
          src={`${exhibitFirstObject.primary_image}`}
          alt={`A thumbnail image of object titled ${exhibitFirstObject.title}`}
              />
        
          <div className="exhibit-thumbnail-information">
            
              <Link to={`/exhibits/${exhibit.exhibit_id}`}>
                <h1 className="standard-title">{exhibit.title}</h1>
              </Link>
              <Link to={`/user/${exhibit.curator_id}`}>
                <p>by {exhibit.curator_username}</p>
              </Link>
              <p>"{exhibit.description}"</p>
              <p>object count: {exhibit.object_count}</p>
              {deleteable ? (
                <>
                  <button
                    onClick={(event) => {
                      setDeleteError(false);
                      deleteExhibitWithExhibitId(exhibit.exhibit_id)
                        .then((res) => {
                          setExhibitDeleted(true);
                        })
                        .catch((err) => {
                          setDeleteError(true);
                        });
                    }}
                  >
                    Delete this exhibit?
                  </button>
                  {deleteError ? (
                    <p>error deleting exhibit, try again?</p>
                  ) : null}
                </>
              ) : null}
            
          </div>
          </>
        )}
      </div>
    </>
  );
};

export default ExhibitThumbnailCard;
