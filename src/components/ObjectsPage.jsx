import { useContext, useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom"
import LoggedInContext from "../contexts/logged-in-user-context";
import { objectsRequest } from "../utils/object-requests/objects-request";
import ObjectThumbnailCard from "./ObjectThumbnailCard";
import ObjectSortAndLimits from "./ObjectsSortAndLimits";
import ObjectSearchFilter from "./ObjectsSearchFilter";
import ObjectsPagination from "./ObjectsPagination";

const ObjectsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()
  const {loggedInUser} = useContext(LoggedInContext)
  const [objectList, setObjectList] = useState([]);
  const [queryObject, setQueryObject] = useState({});
  const [filterBoxToggle, setFilterBoxToggle] = useState(false);  
  const [isLoading, setIsloading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const titleQuery = searchParams.get('title');
  const cultureQuery = searchParams.get('culture');
  const periodQuery = searchParams.get('period');
  const mediumQuery = searchParams.get('medium');
  const classificationQuery = searchParams.get('classification');
  const museumDatasetQuery = searchParams.get('museum_dataset');
  const objectBeginDateQuery = searchParams.get('object_begin_date');
  const objectEndDateQuery = searchParams.get('object_end_date');
  const objectBeginDateOperatorQuery = searchParams.get('object_begin_date_operator');
  const objectEndDateOperatorQuery = searchParams.get('object_end_date_operator');
  const sortByQuery = searchParams.get('sortBy');
  const sortOrderQuery = searchParams.get('sortOrder');
  const limitQuery = searchParams.get('limit');
  const pageQuery = searchParams.get('page');
  
  useEffect(() => {
    setIsloading(true);
    if (titleQuery) queryObject.title = titleQuery;
    if (cultureQuery) queryObject.culture = cultureQuery;
    if (periodQuery) queryObject.period = periodQuery;
    if (mediumQuery) queryObject.medium = mediumQuery;
    if (classificationQuery) queryObject.classification = classificationQuery;
    if (museumDatasetQuery) queryObject.museum_dataset = museumDatasetQuery;
    if (objectBeginDateQuery) queryObject.object_begin_date = 1 * objectBeginDateQuery;
    if (objectBeginDateOperatorQuery) queryObject.object_begin_date_operator = objectBeginDateOperatorQuery;
    if (objectEndDateQuery) queryObject.object_end_date = 1 * objectEndDateQuery;
    if (objectEndDateOperatorQuery) queryObject.object_end_date_operator = objectEndDateOperatorQuery;
    if (sortByQuery) queryObject.sortBy = sortByQuery;
    if (sortOrderQuery) queryObject.sortOrder = sortOrderQuery;
    if (limitQuery) queryObject.limit = 1 * limitQuery;
    if (pageQuery) queryObject.page = 1 * pageQuery;

    objectsRequest(queryObject)
      .then((response) => {
        setObjectList(response.results.objects);
        setCurrentPage(response.results.currentPage);
        setTotalPages(response.results.totalPages);
        setIsError(false);
        setIsloading(false);
      })
      .catch((err) => {
        setIsError(true);
        setIsloading(false);
      });
  }, [searchParams, queryObject]);

  const toggleFilterBox = () => {
    setFilterBoxToggle(prevState => !prevState); 
  };

  if(isLoading){
    return (
      <>
      <p>request in progress</p>
      </>
    )
  }

  if(isError){
    return (
      <>
      <p>There was an error loading objects, what did you do?! Give it a refresh.</p>
      </>
    )
  }

  return (
    <>
          <Link to={`/`}><button >Home</button></Link>

          {filterBoxToggle && (
            <>
              <ObjectSearchFilter queryObject={queryObject} setQueryObject={setQueryObject} />
            </>
          )}
          <button onClick={toggleFilterBox}>
            {filterBoxToggle ? "Hide Filters" : "Show Filters"}
          </button>

          <ul className="object-thumbnail-list">
            {objectList.map((object) => (
              <div key={object.object_id}>
                <ObjectThumbnailCard object={object} />
              </div>
            ))}
          </ul>
          <ObjectSortAndLimits currentPage={currentPage} totalPages={totalPages} queryObject={queryObject} setQueryObject={setQueryObject} />
          <ObjectsPagination currentPage={currentPage} totalPages={totalPages} queryObject={queryObject} setQueryObject={setQueryObject} />
        </>
      )
};

export default ObjectsPage;
