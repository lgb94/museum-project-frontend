import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { removeExhibitObjectWithExhibitObjectId } from "../utils/exhibit-object-requests/delete-object-from-exhibit";

import LoggedInContext from "../contexts/logged-in-user-context";

const ExhibitObjectThumbnailCard = (props) => {
  const exhibitObject = props.exhibitObject;
  const exhibitId = props.exhibitId;
  const exhibitInfo = props.exhibitInfo;

  const { loggedInUser } = useContext(LoggedInContext);

  const [deletable, setDeletable] = useState(false);
  const [deleteableId, setDeletableId] = useState("")
  const [objectRemoved, setObjectRemoved] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  return (
    <>
      <div
        className="object-thumbnail"
        key={exhibitObject.exhibit_object_id}
        onMouseEnter={(event) => {
          if (loggedInUser.user_id === exhibitInfo.curator_id) {
            setDeletable(true);
            setDeletableId(exhibitObject.exhibit_object_id)
          }
        }}
        onMouseLeave={(event) => {
          if (loggedInUser.user_id === exhibitInfo.curator_id) {
            setDeletable(false);
            setDeletableId("")
          }
        }}
      >
        {objectRemoved ? (
          <>
            <li className="object-removed-thumbnail">
              <p>Object removed!</p>
              <p>Refresh the page remove this box.</p>
            </li>
          </>
        ) : (
          <>
            <Link
              to={`/exhibits/${exhibitId}/${exhibitObject.exhibit_object_id}`}
            >
              <li>
                <img
                  src={`${exhibitObject.primary_image}`}
                  alt={`A thumbnail image of object titled ${exhibitObject.title}`}
                  width="200"
                  height="200"
                />
              </li>
            </Link>
            {deletable ? (
              <>
              <button
              onClick={(event) => {
                setDeleteError(false)
                removeExhibitObjectWithExhibitObjectId(deleteableId)
                .then((res) => {
                  setObjectRemoved(true)
                })
                .catch((err) => {
                  setDeleteError(true)
                })
              }}
              >
                Remove Object
              </button>
              {deleteError ? (
                      <p>error deleting <object data="" type=""></object>, try again?</p>
                    ) : null}
              </>
            ) : null}
          </>
        )}
      </div>
    </>
  );
};

export default ExhibitObjectThumbnailCard;
