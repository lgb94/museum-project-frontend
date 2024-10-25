import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import LoggedInContext from "../contexts/logged-in-user-context";
import { postNewExhibit } from "../utils/exhibit-requests/post-new-exhibit";

const ExhibitCreate = () => {
  const { loggedInUser, isLoggedIn } = useContext(LoggedInContext);

  const [newTitleAttempt, setNewTitleAttempt] = useState("");
  const [newTitleError, setNewTitleError] = useState(false);
  const [newDescriptionAttempt, setNewDescriptionAttempt] = useState("");
  const [exhibitCreateError, setExhibitCreateError] = useState(false);
  const [creatingExhibit, setCreatingExhibit] = useState(false);
  const [exhibitCreated, setExhibitCreated] = useState(false);
  const [newExhibit, setNewExhibit] = useState({});

  const handleCreateExhibit = (event) => {
    event.preventDefault();
    setNewTitleError(false);
    setExhibitCreateError(false);
    setCreatingExhibit(true);
    const newExhibit = {};
    if (newTitleAttempt === "") {
      setNewTitleError(true);
      setCreatingExhibit(false);
    } else if (newTitleAttempt !== "" && newDescriptionAttempt === "") {
      newExhibit.title = newTitleAttempt;
      newExhibit.description = "No description given...";
      newExhibit.user_id = 1 * loggedInUser.user_id;
      postNewExhibit(newExhibit)
        .then((response) => {
          setNewExhibit(response.exhibit);
          setExhibitCreated(true);
          setCreatingExhibit(false);
        })
        .catch((err) => {
          setExhibitCreateError(true);
          setNewTitleAttempt("");
          setNewDescriptionAttempt("");
          setCreatingExhibit(false);
        });
    } else {
      newExhibit.title = newTitleAttempt;
      newExhibit.description = newDescriptionAttempt;
      newExhibit.user_id = 1 * loggedInUser.user_id;
      postNewExhibit(newExhibit)
        .then((response) => {
          setNewExhibit(response.exhibit);
          setExhibitCreated(true);
          setCreatingExhibit(false);
        })
        .catch((err) => {
          setExhibitCreateError(true);
          setNewTitleAttempt("");
          setNewDescriptionAttempt("");
          setCreatingExhibit(false);
        });
    }
  };

  if (exhibitCreated) {
    return (
      <>
        <Link to={`/user/${loggedInUser.user_id}`}>
          <button>Back to my Exhibits</button>
        </Link>
        <div className="exhibit-create-wrapper">
          <div className="exhibit-create-box">
            <h1 className="exhibit-create-header">Exhibit Created!</h1>
            <p className="exhibit-create-text">
              {" "}
              Your exhibit was created successfully, now you'll want to search
              for some objects to put into your exhibit. (your exhibit will not
              be publicly available until you add at least one object)
            </p>
            <Link to={`/objects`}>
              <button className="exhibit-create-button">
                Take me to the object search!
              </button>
            </Link>
            <p>
              If you want to change your exhibitions title or details, you can
              do so from your exhibits page. You can also delete it there.
            </p>
            <Link to={`/exhibits/${newExhibit.exhibit_id}`}>
              <button className="exhibit-create-button">My exhibit page</button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return isLoggedIn ? (
    <>
      <Link to={`/user/${loggedInUser.user_id}`}>
        <button>Back to my Exhibits</button>
      </Link>
      <div className="exhibit-create-wrapper">
        <div className="exhibit-create-box">
          <h1 className="exhibit-create-header">Create an Exhibit!</h1>
          <h2 className="exhibit-create-subheader">
            First choose a title for your exhibit!{" "}
          </h2>
          <p className="exhibit-create-text">
            (This field cannot be left blank.)
          </p>

          <input
            className="exhibit-create-title-input"
            placeholder="Enter a title..."
            type="text"
            value={newTitleAttempt}
            onChange={(event) => setNewTitleAttempt(event.target.value)}
          />
          {newTitleError ? (
            <>
              <p>Title field must not be blank.</p>
            </>
          ) : (
            <></>
          )}
          <h2 className="exhibit-create-subheader">
            Now give us a description of your exhibit!
          </h2>
          <p className="exhibit-create-text">
            (You may leave this blank if you're not sure what form your exhibit
            might take right now.)
          </p>
          <textarea
            className="exhibit-create-description-input"
            placeholder="Write a description..."
            type="text"
            value={newDescriptionAttempt}
            onChange={(event) => setNewDescriptionAttempt(event.target.value)}
          />
          <p className="exhibit-create-text">
            This information will be displayed publicly on your exhibit page so
            please be considerate of others when entering these details
          </p>
          <p className="exhibit-create-text">
            This information will also be displayed alongside each object in
            your exhibit - make sure its relevant to what your displaying. (or
            dont!)
          </p>
          {creatingExhibit ? (
            <>
              <p className="exhibit-create-text">working...</p>
            </>
          ) : (
            <>
              <button
                className="exhibit-create-button"
                onClick={handleCreateExhibit}
              >
                Create my Exhibit!
              </button>
            </>
          )}
        </div>
      </div>
    </>
  ) : (
    <>
      <p>you must be logged in to use this feature!</p>
      <Link to={`/`}>
        <button>login</button>
      </Link>
    </>
  );
};

export default ExhibitCreate;
