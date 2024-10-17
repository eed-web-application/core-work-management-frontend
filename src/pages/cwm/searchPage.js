import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination, useFilters } from 'react-table';
import { fetchAllWork, fetchWorkType } from "../../services/api.js";
import './searchPage.css';
import { useHistory } from "react-router-dom";
import SearchCard from './searchCard';

const SearchPage = ({selectedDomain}) => {
  const [state, setState] = useState({
    searchInput: "",
    work: [],
    totalResults: 0,
    hasMore: true,
  });

  const [sortOptions, setSortOptions] = useState("date");
  const itemsPerPage = 20;
  const history = useHistory();


 // Effect to fetch data when component mounts or when selectedDomain or searchInput changes
 useEffect(() => {
  const fetchData = async () => {
    if (!selectedDomain) {
      console.error("No domain selected, cannot fetch work.");
      return;
    }

    try {
      const response = await fetchAllWork(itemsPerPage, selectedDomain, state.searchInput);
      console.log("API Response:", response); // Log the response
      console.log("SEARCHPAGE", selectedDomain);
      if (response?.payload) {
        setState(prevState => ({
          ...prevState,
          work: response.payload,
          totalResults: response.totalCount,
          hasMore: response.payload.length === itemsPerPage,
        }));
      } else {
        console.log("No payload found in response");
      }
    } catch (error) {
      console.error("Error fetching work:", error);
    }
  };

  fetchData(); // Call the fetch function
}, [selectedDomain, state.searchInput]); 

  const data = useMemo(() => state.work, [state.work]);

  const columns = useMemo(() => [
    { Header: 'Work Number', accessor: 'workNumber' },
    { Header: 'Title', accessor: 'description' },
    { Header: 'Created By', accessor: 'createdBy' },
    { Header: 'Assigned To', accessor: 'assignedTo' },
    { Header: 'Shop', accessor: 'shopGroup.name' },
    { Header: 'Area', accessor: 'location.name' },
  ], []);

  const tableInstance = useTable(
    { columns, data },
    useFilters,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex },
  } = tableInstance;

  const handleRowClick = (workId) => {
    history.push(`/cwm/${workId}`);
    window.location.reload();
  };

  const handleSearch = () => {
    fetchData();
  };

  const handleNew = (type) => {
    alert(`Create a new ${type}`);
  };
  console.log('searchPage selectedDomain:', selectedDomain);

  return (
    <div>
      <SearchCard
        searchInput={state.searchInput}
        setSearchInput={(value) => setState(prevState => ({ ...prevState, searchInput: value }))}
        // handleSearch={handleSearch}
        selectedDomain={selectedDomain}
        // setSelectedDomain={(value) => setState(prevState => ({ ...prevState, selectedDomain: value }))}
        sortOptions={sortOptions}
        handleSortChange={setSortOptions}
        handleNew={handleNew}
        // domains={state.domains}
      />

      <div className="table-container">
        <div className="pagination">
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </button>
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </button>
        </div>

        <table {...getTableProps()} className="search-table">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  onClick={() => handleRowClick(row.original.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchPage;
