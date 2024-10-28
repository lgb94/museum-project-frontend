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
  const filters = props.filters;
  const setFilters = props.setFilters;
  const filterBoxToggle = props.filterBoxToggle;

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
    <>
      <div className="above-screen-wrapper">
        <div className="standard-page-wrapper">
          <h1 className="standard-title">F I L T E R S E A R C H</h1>
          <div className="standard-page-box">
            <div className="filter-option">
              <label>Title search:</label>
              <input
                type="text"
                className="filter-input"
                value={titleFilterAttempt}
                onChange={(event) => {
                  setTitleFilterAttempt(event.target.value);
                }}
              />
            </div>
            <div className="filter-option">
              <label>Culture search:</label>
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
            </div>
            <div className="filter-option">
              <label>Medium search:</label>
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
            </div>
            <div className="filter-option">
              <label>Period search:</label>
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
            </div>
            <div className="filter-option">
              <label>Classification search:</label>
              <select
                value={classificationFilterAttempt}
                className="filter-input"
                onChange={(event) => {
                  setClassificationFilterAttempt(event.target.value);
                }}
              >
                <option value="">Select a classification</option>
                {Object.keys(classificationFilterOptions).map(
                  (classification) => (
                    <option key={classification} value={classification}>
                      {classification} (
                      {classificationFilterOptions[classification]})
                    </option>
                  )
                )}
              </select>
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
            </div>
            <div className="filter-option">
              <label>Object Begin Date search:</label>
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
            </div>
            <div className="filter-option">
              <label>Object End Date search:</label>
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
            </div>
            <button onClick={handleFilterSubmit}>Apply Filters</button>
            <button onClick={handleClearAllFilters}>Clear All Filters</button>
            <button onClick={toggleFilterBox}>Hide Filter Select</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ObjectSearchFilter;
