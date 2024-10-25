import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { objectsRequest } from "../utils/object-requests/objects-request";
import {
  findCultures,
  findMediums,
  findPeriods,
  findClassifications,
} from "../utils/filter-utils/findFilterOptionFunctions";
import ErrorPage from "./ErrorPage";
import LoadingSpinner from "./LoadingSpinner";

const ObjectSearchFilter = (props) => {
  const queryObject = props.queryObject;
  const setQueryObject = props.setQueryObject;
  const toggleFilterBox = props.toggleFilterBox;
  const filterBoxToggle = props.filterBoxToggle;
  const setFilterBoxToggle = props.setFilterBoxToggle;

  const [searchParams, setSearchParams] = useSearchParams();

  const [titleFilterAttempt, setTitleFilterAttempt] = useState("");
  const [cultureFilterAttempt, setCultureFilterAttempt] = useState("");
  const [mediumFilterAttempt, setMediumFilterAttempt] = useState("");
  const [periodFilterAttempt, setPeriodFilterAttempt] = useState("");
  const [classificationFilterAttempt, setClassificationFilterAttempt] =
    useState("");
  const [museum_datasetFilterAttempt, setmuseum_datasetFilterAttempt] =
    useState("");
  const [objectBeginDateFilterAttempt, setObjectBeginDateFilterAttempt] =
    useState("");
  const [beginDateOperatorFilterAttempt, setBeginDateOperatorFilterAttempt] =
    useState("");
  const [objectEndDateFilterAttempt, setObjectEndDateFilterAttempt] =
    useState("");
  const [endDateOperatorFilterAttempt, setEndDateOperatorFilterAttempt] =
    useState("");

  const [filters, setFilters] = useState({});
  const [allObjects, setAllObjects] = useState([]);

  const [cultureFilterOptions, setCultureFilterOptions] = useState({});
  const [mediumFilterOptions, setMediumFilterOptions] = useState({});
  const [periodFilterOptions, setPeriodFilterOptions] = useState({});
  const [classificationFilterOptions, setClassificationFilterOptions] =
    useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (allObjects.length > 0) {
      setCultureFilterOptions(findCultures(allObjects));
      setMediumFilterOptions(findMediums(allObjects));
      setPeriodFilterOptions(findPeriods(allObjects));
      setClassificationFilterOptions(findClassifications(allObjects));
    }
  }, [allObjects]);

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage("");
    setIsError(false);
    let currentFilters = {};
    let objectFiltersNoLimit = {};
    for (const key in queryObject) {
      currentFilters[key] = queryObject[key];
      if (key !== "limit" && key !== "page") {
        objectFiltersNoLimit[key] = queryObject[key];
      }
    }
    objectFiltersNoLimit.limit = 5000;
    setFilters(currentFilters);

    objectsRequest(objectFiltersNoLimit)
      .then((response) => {
        setAllObjects(response.results.objects);
        setIsLoading(false);
      })
      .catch((err) => {
        setErrorMessage(err);
        setIsError(true);
      });
  }, [searchParams]);

  let newSearchFilters = {};

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

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    for (const key in filters) {
      newSearchFilters[key] = filters[key];
    }
    if (titleFilterAttempt !== "") {
      let titleFilterForSql = `%${titleFilterAttempt}%`;
      newSearchFilters.title = titleFilterForSql;
      setTitleFilterAttempt("");
    }
    if (cultureFilterAttempt !== "") {
      let cultureFilterForSql = `%${cultureFilterAttempt}%`;
      newSearchFilters.culture = cultureFilterForSql;
      setCultureFilterAttempt("");
    }
    if (mediumFilterAttempt !== "") {
      let mediumFilterForSql = `%${mediumFilterAttempt}%`;
      newSearchFilters.medium = mediumFilterForSql;
      setMediumFilterAttempt("");
    }
    if (periodFilterAttempt !== "") {
      let periodFilterForSql = `%${periodFilterAttempt}%`;
      newSearchFilters.period = periodFilterForSql;
      setPeriodFilterAttempt("");
    }
    if (classificationFilterAttempt !== "") {
      let classificationFilterForSql = `%${classificationFilterAttempt}%`;
      newSearchFilters.classification = classificationFilterForSql;
      setClassificationFilterAttempt("");
    }
    if (museum_datasetFilterAttempt !== "") {
      newSearchFilters.museum_dataset = museum_datasetFilterAttempt;
      setmuseum_datasetFilterAttempt("");
    }
    if (objectBeginDateFilterAttempt !== "") {
      let beginDateValue = objectBeginDateFilterAttempt * 1;
      newSearchFilters.object_begin_date = beginDateValue;
      setObjectBeginDateFilterAttempt("");
    }
    if (beginDateOperatorFilterAttempt !== "") {
      newSearchFilters.object_begin_date_operator =
        beginDateOperatorFilterAttempt;
      setBeginDateOperatorFilterAttempt("");
    }
    if (objectEndDateFilterAttempt !== "") {
      let endDateValue = objectEndDateFilterAttempt * 1;
      newSearchFilters.object_end_date = endDateValue;
      setObjectEndDateFilterAttempt("");
    }
    if (endDateOperatorFilterAttempt !== "") {
      newSearchFilters.object_end_date_operator = endDateOperatorFilterAttempt;
      setEndDateOperatorFilterAttempt("");
    }

    newSearchFilters.page = 1;
    for (const key in newSearchFilters) {
      newParams.set(key, newSearchFilters[key]);
    }
    setQueryObject(newSearchFilters);
    setSearchParams(newParams);
  };

  // Reset title filter
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

  // Reset culture filter
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

  // Reset medium filter
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
  //reset period filter

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

  //reset classification

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

  //reset museum_dataset

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

  //reset begin date & operator

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

  // reset end date & operator

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

  const handleClearAllFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("title");
    newParams.delete("culture");
    newParams.delete("period");
    newParams.delete("medium");
    newParams.delete("classification");
    newParams.delete("museum_dataset");
    newParams.delete("object_begin_date");
    newParams.delete("object_begin_date_operator");
    newParams.delete("object_end_date");
    newParams.delete("object_end_date_operator");
    for (const key in filters) {
      if (key === "sortBy") {
        newSearchFilters[key] = filters[key];
      }
      if (key === "sortOrder") {
        newSearchFilters[key] = filters[key];
      }
      if (key === "limit") {
        newSearchFilters[key] = filters[key];
      }
      if (key === "page") {
        newSearchFilters[key] = filters[key];
      }
    }
    setQueryObject(newSearchFilters);
    setSearchParams(newParams);
  };

  //function for number input fields

  const handleBeginDateNumberInput = (event) => {
    const value = event.target.value;
    if (value === "" || /^-?\d+$/.test(value)) {
      setObjectBeginDateFilterAttempt(value);
    }
  };

  const handleEndDateNumberInput = (event) => {
    const value = event.target.value;
    if (value === "" || /^-?\d+$/.test(value)) {
      setObjectEndDateFilterAttempt(value);
    }
  };

  return (
    <div className="filters-box-wrapper">
      <div className="filters-box">
        <div className="filter-option">
          <label>title search:</label>
          <input
            type="text"
            className="filter-input"
            value={titleFilterAttempt}
            onChange={(event) => {
              setTitleFilterAttempt(event.target.value);
            }}
          />
          {filters.title && (
            <>
              <p>current title filter: {filters.title.replace(/^%|%$/g, "")}</p>
              <button onClick={handleResetTitleFilter}>
                Reset Title Filter
              </button>
            </>
          )}
        </div>
        <div className="filter-option">
          <label>culture search:</label>
          <select
            value={cultureFilterAttempt}
            className="filter-input"
            onChange={(event) => {
              setCultureFilterAttempt(event.target.value);
            }}
          >
            <option value="">Select a culture</option>
            {Object.keys(cultureFilterOptions).map((culture) => (
              <option key={culture} value={culture}>
                {culture} ({cultureFilterOptions[culture]})
              </option>
            ))}
          </select>

          {filters.culture && (
            <>
              <p>
                current culture filter: {filters.culture.replace(/^%|%$/g, "")}
              </p>
              <button onClick={handleResetCultureFilter}>
                Reset culture Filter
              </button>
            </>
          )}
        </div>
        <div className="filter-option">
          <label>medium search:</label>
          <select
            value={mediumFilterAttempt}
            className="filter-input"
            onChange={(event) => {
              setMediumFilterAttempt(event.target.value);
            }}
          >
            <option value="">Select a medium</option>
            {Object.keys(mediumFilterOptions).map((medium) => (
              <option key={medium} value={medium}>
                {medium} ({mediumFilterOptions[medium]})
              </option>
            ))}
          </select>

          {filters.medium && (
            <>
              <p>
                current medium filter: {filters.medium.replace(/^%|%$/g, "")}
              </p>
              <button onClick={handleResetMediumFilter}>
                Reset medium Filter
              </button>
            </>
          )}
        </div>
        <div className="filter-option">
          <label>period search:</label>
          <select
            value={periodFilterAttempt}
            className="filter-input"
            onChange={(event) => {
              setPeriodFilterAttempt(event.target.value);
            }}
          >
            <option value="">Select a period</option>
            {Object.keys(periodFilterOptions).map((period) => (
              <option key={period} value={period}>
                {period} ({periodFilterOptions[period]})
              </option>
            ))}
          </select>

          {filters.period && (
            <>
              <p>
                current period filter: {filters.period.replace(/^%|%$/g, "")}
              </p>
              <button onClick={handleResetPeriodFilter}>
                Reset period Filter
              </button>
            </>
          )}
        </div>
        <div className="filter-option">
          <label>classification search:</label>
          <select
            value={classificationFilterAttempt}
            className="filter-input"
            onChange={(event) => {
              setClassificationFilterAttempt(event.target.value);
            }}
          >
            <option value="">Select a classification</option>
            {Object.keys(classificationFilterOptions).map((classification) => (
              <option key={classification} value={classification}>
                {classification} ({classificationFilterOptions[classification]})
              </option>
            ))}
          </select>

          {filters.classification && (
            <>
              <p>
                current classification filter:{" "}
                {filters.classification.replace(/^%|%$/g, "")}
              </p>
              <button onClick={handleResetClassificationFilter}>
                Reset classification Filter
              </button>
            </>
          )}
        </div>
        <div className="filter-option">
          <label>Museum Dataset search:</label>
          <select
            value={museum_datasetFilterAttempt}
            className="filter-input"
            onChange={(event) => {
              setmuseum_datasetFilterAttempt(event.target.value);
            }}
          >
            <option value="">Select a museum dataset</option>
            <option value="met">Met</option>
            <option value="harvard">Harvard</option>
          </select>

          {filters.museum_dataset && (
            <>
              <p>
                current Museum Dataset filter:{" "}
                {filters.museum_dataset.replace(/^%|%$/g, "")}
              </p>
              <button onClick={handleMuseumDatasetFilter}>
                Reset Museum Dataset Filter
              </button>
            </>
          )}
        </div>
        <div className="filter-option">
          <label>Object begin Date search:</label>

          <input
            type="text"
            value={objectBeginDateFilterAttempt}
            className="filter-input"
            onChange={handleBeginDateNumberInput}
            placeholder="enter begin date"
          />
          {objectBeginDateFilterAttempt === "" ? (
            <></>
          ) : (
            <select
              value={beginDateOperatorFilterAttempt}
              className="filter-input"
              onChange={(event) => {
                setBeginDateOperatorFilterAttempt(event.target.value);
              }}
            >
              <option value="">Select an operator</option>
              <option value="=">Exactly</option>
              <option value="<">Earlier than</option>
              <option value=">">Later than</option>
            </select>
          )}

          {filters.object_begin_date && (
            <>
              <p>
                current object begin date filter:{" "}
                {filters.object_begin_date_operator} {filters.object_begin_date}
              </p>
              <button onClick={handleObjectBeginDateFilter}>
                Reset object Begin date Filter
              </button>
            </>
          )}
        </div>
        <div className="filter-option">
          <label>Object end Date search:</label>
          <input
            type="text"
            value={objectEndDateFilterAttempt}
            className="filter-input"
            onChange={handleEndDateNumberInput}
            placeholder="enter end date"
          />
          {objectEndDateFilterAttempt === "" ? (
            <></>
          ) : (
            <select
              value={endDateOperatorFilterAttempt}
              className="filter-input"
              onChange={(event) => {
                setEndDateOperatorFilterAttempt(event.target.value);
              }}
            >
              <option value="">Select an operator</option>
              <option value="=">Exactly</option>
              <option value="<">Earlier than</option>
              <option value=">">Later than</option>
            </select>
          )}
          {filters.object_end_date && (
            <>
              <p>
                current object end date filter:{" "}
                {filters.object_end_date_operator} {filters.object_end_date}
              </p>
              <button onClick={handleObjectEndDateFilter}>
                Reset object End date Filter
              </button>
            </>
          )}
        </div>

        <button onClick={handleFilterSubmit}>Apply filters</button>
        <button onClick={handleClearAllFilters}>clear all filters</button>
        <button onClick={toggleFilterBox}>
          {filterBoxToggle ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
    </div>
  );
};

export default ObjectSearchFilter;
