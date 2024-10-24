import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const ObjectSortAndLimits = (props) => {
    
    const currentPage = props.currentPage;
    const totalPages = props.totalPages;
    const queryObject = props.queryObject;
    const setQueryObject = props.setQueryObject;
    
    const [searchParams, setSearchParams] = useSearchParams();

    const sortByQuery = searchParams.get("sortBy");
    const sortOrderQuery = searchParams.get("sortOrder");
    const limitQuery = searchParams.get("limit");

    const [limitOption, setLimitOption] = useState(limitQuery || 10);

    let sortQuery = '';
    if (sortByQuery === 'title') {
        if (sortOrderQuery === 'desc') {
            sortQuery = 'title_ZA';
        } else if (sortOrderQuery === 'asc') {
            sortQuery = 'title_AZ';
        }
    }

    const [sortOption, setSortOption] = useState(sortQuery || 'default');

    let newQueryObject = {}

    const handleSortOptions = (event) => {
        const newParams = new URLSearchParams(searchParams);
        for (const key in queryObject) {
            newQueryObject[key] = queryObject[key];
        }
        
        if (limitOption) {
            newQueryObject.limit = limitOption * 1;
        }

        if (sortOption && sortOption !== 'default') {
            if (sortOption === 'title_AZ') {
                newQueryObject.sortBy = "title";
                newQueryObject.sortOrder = "asc";
            } else if (sortOption === 'title_ZA') {
                newQueryObject.sortBy = "title";
                newQueryObject.sortOrder = "desc";
            }
        } else {
            delete newQueryObject.sortBy;
            delete newQueryObject.sortOrder;
            newParams.delete('sortBy');
            newParams.delete('sortOrder');
        }

        for (const key in newQueryObject) {
            newParams.set(key, newQueryObject[key]);
        }
        setQueryObject(newQueryObject);
        setSearchParams(newParams);

    }

    return (
        <>
        <div className="sorting-options-wrapper">
        <p className="sorting-options-label">Current page: {currentPage}</p>
        <p className="sorting-options-label">Total pages: {totalPages}</p>
            <label className="sorting-options-label">Results per page: </label>
            <select
                className="sorting-options-content"
                value={limitOption}
                onChange={(event) => {
                    setLimitOption(event.target.value);
                }}
            >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
            </select>
            <label className="sorting-options-label">Sorting options: </label>
            <select
            className="sorting-options-content"
                value={sortOption}
                onChange={(event) => {
                    setSortOption(event.target.value);
                }}
            >
                <option value="default">default</option>
                <option value="title_AZ">title a-z</option>
                <option value="title_ZA">title z-a</option>
            </select>
            <button className="sorting-options-button" onClick={handleSortOptions}>Sort Results</button>
            </div>
        </>
    );
};

export default ObjectSortAndLimits;
