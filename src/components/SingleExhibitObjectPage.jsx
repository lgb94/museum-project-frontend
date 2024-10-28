import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getExhibitsObjectByExhibitObjectId } from "../utils/exhibit-object-requests/single-exhibit-object-by-exhibit-object-id";
import { getExhibitsObjectsByExhibitId } from "../utils/exhibit-object-requests/exhibit-objects-by-exhibit-id";
import ErrorPage from "./ErrorPage";
import LoadingSpinner from "./LoadingSpinner";

const SingleExhibitObject = () => {
  const param = useParams();

  const [exhibitId, setExhibitId] = useState(param.exhibit_id);
  const [exhibitObjectId, setObjectExhibitId] = useState(
    param.exhibit_object_id
  );
  const [currentObject, setCurrentObject] = useState({});
  const [currentObjectPosition, setCurrentObjectPosition] = useState("");
  const [currentExhibit, setCurrentExhibit] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setIsError(false);
    setErrorMessage("");
    setIsLoading(true);
    getExhibitsObjectByExhibitObjectId(exhibitObjectId)
      .then((response) => {
        setCurrentObject(response.object);
        setCurrentObjectPosition(response.object.object_position);
        return getExhibitsObjectsByExhibitId(exhibitId);
      })
      .then((response) => {
        setCurrentExhibit(response.objects);
        setIsLoading(false);
      })
      .catch((err) => {
        setErrorMessage(err);
        setIsError(true);
      });
  }, [exhibitObjectId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorPage err={errorMessage} />;
  }

  const currentIndex = currentExhibit.findIndex(
    (obj) => obj.object_position === currentObjectPosition
  );

  const prevObject = currentIndex > 0 ? currentExhibit[currentIndex - 1] : null;
  const nextObject =
    currentIndex < currentExhibit.length - 1
      ? currentExhibit[currentIndex + 1]
      : null;

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
          <div className="exhibit-object-page-select">
            {prevObject ? (
              <button
                onClick={() => {
                  setObjectExhibitId(prevObject.exhibit_object_id);
                }}
              >
                Previous Object
              </button>
            ) : (
              <button disabled>Previous Object</button>
            )}
            <Link to={`/exhibits/${exhibitId}`}>
              <button>Back to exhibit</button>
            </Link>
            {nextObject ? (
              <button
                onClick={() => {
                  setObjectExhibitId(nextObject.exhibit_object_id);
                }}
              >
                Next Object
              </button>
            ) : (
              <button disabled>Next Object</button>
            )}
          </div>
            <h2 className="exhibit-object-exhibit-title">
              From the exhibit:{" "}
              <Link to={`/exhibits/${currentObject.exhibit_id}`}>
                {currentObject.exhibit_title}
              </Link>
            </h2>
            <p>Culture: {currentObject.culture}</p>
            <p>Period: {currentObject.period}</p>
            <p>Object begin date: {currentObject.object_begin_date}</p>
            <p>Object end date: {currentObject.object_end_date}</p>
            <p>Medium: {currentObject.medium}</p>
            <p>Classification: {currentObject.classification}</p>
            <p>Museum Dataset: {currentObject.museum_dataset}</p>
            <p>
              Object link:{" "}
              <a
                href={currentObject.object_url}
                target="_blank"
                rel="noreferrer"
              >
                {currentObject.object_url}
              </a>
            </p>
          </div>
            </div>
            </div>
      </div>
    </>
  );
};

export default SingleExhibitObject;
