import { useContext, useState, useEffect } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import LoggedInContext from "../contexts/logged-in-user-context";
import { objectsRequest } from "../utils/object-requests/objects-request";
import ObjectThumbnailCard from "./ObjectThumbnailCard";
import ObjectSortAndLimits from "./ObjectsSortAndLimits";
import ObjectSearchFilter from "./ObjectsSearchFilter";
import ObjectsPagination from "./ObjectsPagination";
import LoadingSpinner from "./LoadingSpinner";
import ErrorPage from "./ErrorPage";

const ObjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loggedInUser } = useContext(LoggedInContext);
  const [objectList, setObjectList] = useState([]);
  const [queryObject, setQueryObject] = useState({});
  const [filterBoxToggle, setFilterBoxToggle] = useState(false);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsloading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const titleQuery = searchParams.get("title");
  const cultureQuery = searchParams.get("culture");
  const periodQuery = searchParams.get("period");
  const mediumQuery = searchParams.get("medium");
  const classificationQuery = searchParams.get("classification");
  const museumDatasetQuery = searchParams.get("museum_dataset");
  const objectBeginDateQuery = searchParams.get("object_begin_date");
  const objectEndDateQuery = searchParams.get("object_end_date");
  const objectBeginDateOperatorQuery = searchParams.get(
    "object_begin_date_operator"
  );
  const objectEndDateOperatorQuery = searchParams.get(
    "object_end_date_operator"
  );
  const sortByQuery = searchParams.get("sortBy");
  const sortOrderQuery = searchParams.get("sortOrder");
  const limitQuery = searchParams.get("limit");
  const pageQuery = searchParams.get("page");

  useEffect(() => {
    setIsError(false);
    setErrorMessage("");
    setFilterBoxToggle(false);
    setIsloading(true);
    if (titleQuery) queryObject.title = titleQuery;
    if (cultureQuery) queryObject.culture = cultureQuery;
    if (periodQuery) queryObject.period = periodQuery;
    if (mediumQuery) queryObject.medium = mediumQuery;
    if (classificationQuery) queryObject.classification = classificationQuery;
    if (museumDatasetQuery) queryObject.museum_dataset = museumDatasetQuery;
    if (objectBeginDateQuery)
      queryObject.object_begin_date = 1 * objectBeginDateQuery;
    if (objectBeginDateOperatorQuery)
      queryObject.object_begin_date_operator = objectBeginDateOperatorQuery;
    if (objectEndDateQuery)
      queryObject.object_end_date = 1 * objectEndDateQuery;
    if (objectEndDateOperatorQuery)
      queryObject.object_end_date_operator = objectEndDateOperatorQuery;
    if (sortByQuery) queryObject.sortBy = sortByQuery;
    if (sortOrderQuery) queryObject.sortOrder = sortOrderQuery;
    if (limitQuery) queryObject.limit = 1 * limitQuery;
    if (pageQuery) queryObject.page = 1 * pageQuery;

    setFilters(queryObject);
    objectsRequest(queryObject)
      .then((response) => {
        setObjectList(response.results.objects);
        setCurrentPage(response.results.currentPage);
        setTotalPages(response.results.totalPages);
        setIsError(false);
        setIsloading(false);
      })
      .catch((err) => {
        setErrorMessage(err);
        setIsError(true);
        setIsloading(false);
      });
  }, [searchParams, queryObject]);

  const toggleFilterBox = () => {
    setFilterBoxToggle((prevState) => !prevState);
  };

  let newSearchFilters = {};

  const handleResetTitleFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("title");
    for (const key in filters) {
      if (key !== "title") {
        newSearchFilters[key] = filters[key];
      }
    }
    setQueryObject(newSearchFilters);
    setSearchParams(newParams);
  };

  const handleResetCultureFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("culture");
    for (const key in filters) {
      if (key !== "culture") {
        newSearchFilters[key] = filters[key];
      }
    }
    setQueryObject(newSearchFilters);
    setSearchParams(newParams);
  };

  const handleResetMediumFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("medium");
    for (const key in filters) {
      if (key !== "medium") {
        newSearchFilters[key] = filters[key];
      }
    }
    setQueryObject(newSearchFilters);
    setSearchParams(newParams);
  };

  const handleResetPeriodFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("period");
    for (const key in filters) {
      if (key !== "period") {
        newSearchFilters[key] = filters[key];
      }
    }
    setQueryObject(newSearchFilters);
    setSearchParams(newParams);
  };

  const handleResetClassificationFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("classification");
    for (const key in filters) {
      if (key !== "classification") {
        newSearchFilters[key] = filters[key];
      }
    }
    setQueryObject(newSearchFilters);
    setSearchParams(newParams);
  };

  const handleMuseumDatasetFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("museum_dataset");
    for (const key in filters) {
      if (key !== "museum_dataset") {
        newSearchFilters[key] = filters[key];
      }
    }
    setQueryObject(newSearchFilters);
    setSearchParams(newParams);
  };

  const handleObjectBeginDateFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("object_begin_date");
    newParams.delete("object_begin_date_operator");
    for (const key in filters) {
      if (key !== "object_begin_date" && key !== "object_begin_date_operator") {
        newSearchFilters[key] = filters[key];
      }
    }
    setQueryObject(newSearchFilters);
    setSearchParams(newParams);
  };

  const handleObjectEndDateFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("object_end_date");
    newParams.delete("object_end_date_operator");
    for (const key in filters) {
      if (key !== "object_end_date" && key !== "object_end_date_operator") {
        newSearchFilters[key] = filters[key];
      }
    }
    setQueryObject(newSearchFilters);
    setSearchParams(newParams);
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
      
      <div className="active-filter-wrapper">
        {filters.title ? (
          <div className="active-filter">
            <p>Title: {filters.title.replace(/^%|%$/g, "")}</p>
            <button onClick={handleResetTitleFilter}>Clear</button>
          </div>
        ) : null}
        {filters.culture ? (
          <div className="active-filter">
            <p>Culture: {filters.culture.replace(/^%|%$/g, "")}</p>
            <button onClick={handleResetCultureFilter}>Clear</button>
          </div>
        ) : null}
        {filters.period ? (
          <div className="active-filter">
            <p>Period: {filters.period.replace(/^%|%$/g, "")}</p>
            <button onClick={handleResetPeriodFilter}>Clear</button>
          </div>
        ) : null}
        {filters.medium ? (
          <div className="active-filter">
            <p>Medium: {filters.medium.replace(/^%|%$/g, "")}</p>
            <button onClick={handleResetMediumFilter}>Clear</button>
          </div>
        ) : null}
        {filters.classification ? (
          <div className="active-filter">
            <p>Classification: {filters.classification.replace(/^%|%$/g, "")}</p>
            <button onClick={handleResetClassificationFilter}>Clear</button>
          </div>
        ) : null}
        {filters.museum_dataset ? (
          <div className="active-filter">
            <p>Museum: {filters.museum_dataset.replace(/^%|%$/g, "")}</p>
            <button onClick={handleMuseumDatasetFilter}>Clear</button>
          </div>
        ) : null}
        {filters.object_begin_date ? (
          <div className="active-filter">
            <p>Object Begin Date: {filters.object_begin_date_operator} {filters.object_begin_date}</p>
            <button onClick={handleObjectBeginDateFilter}>Clear</button>
          </div>
        ) : null}
        {filters.object_end_date ? (
          <div className="active-filter">
            <p>Object End Date: {filters.object_end_date_operator} {filters.object_end_date}</p>
            <button onClick={handleObjectEndDateFilter}>Clear</button>
          </div>
        ) : null}
      </div>
      <div className="object-page-top-wrapper">
          <button className="show-filter-button" onClick={toggleFilterBox}>Filter Selection Menu</button>
      
      </div>
      {filterBoxToggle ? (
        <>
          <ObjectSearchFilter
            filters={filters}
            setFilters={setFilters}
            toggleFilterBox={toggleFilterBox}
            filterBoxToggle={filterBoxToggle}
            setFilterBoxToggle={setFilterBoxToggle}
            queryObject={queryObject}
            setQueryObject={setQueryObject}
          />
        </>
        ) : null }
      {objectList.length > 0 ? (
        <div className="object-thumbnail-list-wrapper">
          <ul className="object-thumbnail-list">
            {objectList.map((object) => (
              <div key={object.object_id}>
                <ObjectThumbnailCard object={object} />
              </div>
            ))}
          </ul>
        </div>
      ) : (
        <div className="standard-page-wrapper">
          <div className="standard-page-box">
            <p>
              Your search yielded no results - try removing one of your filters
              maybe?
            </p>
            <button onClick={toggleFilterBox}>
              {filterBoxToggle ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        </div>
      )}
      <div className="pagination-and-sort-wrapper">
        <ObjectSortAndLimits
          currentPage={currentPage}
          totalPages={totalPages}
          queryObject={queryObject}
          setQueryObject={setQueryObject}
        />
        <ObjectsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          queryObject={queryObject}
          setQueryObject={setQueryObject}
        />
      </div>
    </>
  );
};

export default ObjectsPage;
