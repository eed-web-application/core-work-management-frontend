import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTable, useSortBy, usePagination, useFilters } from 'react-table';
import { fetchWork } from "../../services/api.js";
import SubHeader from './subHeader.js';
import './searchPage.css';
import { useHistory } from "react-router-dom"; 
import SearchCard from './searchCard';

const SearchPage = ({ selectedDomain }) => {
  const [state, setState] = useState({
    searchInput: "",
    work: [],
    totalResults: 0,
    hasMore: true,
  });
  const [sortOptions, setSortOptions] = useState("date");
  const itemsPerPage = 10;
  const history = useHistory();

  useEffect(() => {
    fetchData();
  }, [selectedDomain]);

  const fetchData = async () => {
    try {
      const response = await fetchWork(null, itemsPerPage, null, state.searchInput);
      if (response?.payload) {
        const filteredWork = response.payload.filter(item => item.domain.id === selectedDomain);
        setState(prevState => ({
          ...prevState,
          work: filteredWork,
          totalResults: response.totalCount,
          hasMore: filteredWork.length === itemsPerPage,
        }));
      }
    } catch (error) {
      console.error("Error fetching work:", error);
    }
  };

  const data = useMemo(() => state.work, [state.work]);

  const columns = useMemo(() => [
    {
      Header: 'Work Number',
      accessor: 'workNumber',
    },
    {
      Header: 'Title',
      accessor: 'description',
    },
    {
      Header: 'Created By',
      accessor: 'createdBy',
    },
    {
      Header: 'Assigned To',
      accessor: 'assignedTo',
    },
    {
      Header: 'Shop',
      accessor: 'shopGroup.name',
    },
    {
      Header: 'Area',
      accessor: 'location.name',
    },
  ], []);

  // Define table instance with the useTable hook
  const tableInstance = useTable(
    { columns, data },
    useFilters, // Enable column filters
    useSortBy,  // Enable sorting by column
    usePagination // Enable pagination
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

  // Function to handle row click and navigate to the work details page
  const handleRowClick = (workId) => {
    history.push(`/cwm/${workId}`); // <-- Navigate to work details page
  };

  const handleSearch = () => {
    fetchData(); // <-- Trigger search
  };

  const handleNew = (type) => {
    alert(`Create a new ${type}`); // <-- Handle "New +" button dropdown
  };

  return (
    <div>
      {/* <SubHeader
        searchInput={state.searchInput}
        setSearchInput={(value) => setState(prevState => ({ ...prevState, searchInput: value }))}
        handleSearch={fetchData}
        selectedDomain={selectedDomain}
      /> */}

{/* Add SearchCard component here */}
<SearchCard
        searchInput={state.searchInput}
        setSearchInput={(value) => setState(prevState => ({ ...prevState, searchInput: value }))}
        handleSearch={handleSearch}
        selectedDomain={selectedDomain}
        setSelectedDomain={(domain) => setState(prevState => ({ ...prevState, selectedDomain: domain }))}
        sortOptions={sortOptions}
        handleSortChange={setSortOptions}
        handleNew={handleNew}
      />

      <div className="table-container">
        {/* Pagination moved above the table */}
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
        
        {/* Table with clickable rows */}
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
                // Add onClick to each row
                <tr {...row.getRowProps()} onClick={() => handleRowClick(row.original.id)} style={{ cursor: 'pointer' }}>
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
