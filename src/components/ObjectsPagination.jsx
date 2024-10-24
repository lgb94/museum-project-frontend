import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const ObjectsPagination = (props) => {
  const currentPage = props.currentPage;
  const totalPages = props.totalPages;
  const setQueryObject = props.setQueryObject;

  const [searchParams, setSearchParams] = useSearchParams();
  const [customPageInput, setCustomPageInput] = useState(""); 
  
  let newPagination = {};

  const handlePageChange = (pageNumber) => {
    const newParams = new URLSearchParams(searchParams);
    newPagination.page = pageNumber;

    for (const key in newPagination) {
      newParams.set(key, newPagination[key]);
    }

    setSearchParams(newParams);
    setQueryObject(newPagination);
  };

  const handleCustomPageChange = (event) => {
    const value = event.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCustomPageInput(value);
    }
  };

  const handleCustomPageSubmit = () => {
    const pageNumber = (1*customPageInput);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
      setCustomPageInput(""); 
    } else {
      alert(`Please enter a valid page number between 1 and ${totalPages}`);
    }
  };

  const pageButtons = [];

  const startPage = Math.max(2, currentPage - 5); 
  const endPage = Math.min(totalPages - 1, currentPage + 5);

  pageButtons.push(
    <button key={1} onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
      1
    </button>
  );

  if (startPage > 2) {
    pageButtons.push(<span className="pagination-page-buttons" key="start ...">...</span>);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        disabled={i === currentPage}
      >
        {i}
      </button>
    );
  }

  if (endPage < totalPages - 1) {
    pageButtons.push(<span className="pagination-page-buttons" key="end ...">...</span>);
  }

  if (totalPages > 1) {
    pageButtons.push(
      <button
        key={totalPages}
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        {totalPages}
      </button>
    );
  }

  return (
    <>
    <div className="pagination-wrapper">
      <label className="pagination-label">Page: </label>
      <div className="pagination-page-buttons">
        {pageButtons}
      </div>
      <div className="pagination-custom-page-input">
        <input
          type="text"
          value={customPageInput}
          onChange={handleCustomPageChange}
          placeholder="Enter page number"
          style={{ width: "150px", marginRight: "10px" }}
        />
        <button className="pagination-custom-page-input" onClick={handleCustomPageSubmit}>Go to Page</button>
      </div>
      </div>
    </>
  );
};

export default ObjectsPagination;
