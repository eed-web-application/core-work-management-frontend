import React, { useState, useEffect, useMemo, useCallback } from "react";
import { fetchWork } from "../../services/api.js";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import SubHeader from './subHeader.js';
import "./searchPage.css";

const SearchPage = ({ selectedDomain }) => {
  const [state, setState] = useState({
    showLocationForm: false,
    showWorkForm: false,
    showTaskForm: false,
    searchInput: "",
    currentPage: 1,
    lastItemId: null,
    work: [],
    totalResults: 0,
    hasMore: true,
  });
  const itemsPerPage = 10;
  const history = useHistory();

  useEffect(() => {
    fetchData();
  }, [selectedDomain]);

  const handleLoadMore = useCallback(async () => {
    try {
      const nextPageData = await fetchWork(null, itemsPerPage, state.lastItemId, state.searchInput);
      if (nextPageData.payload.length > 0) {
        setState(prevState => ({
          ...prevState,
          work: [...prevState.work, ...nextPageData.payload],
          currentPage: prevState.currentPage + 1,
          lastItemId: nextPageData.payload[nextPageData.payload.length - 1]?.id,
        }));
      } else {
        setState(prevState => ({
          ...prevState,
          hasMore: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching work:", error);
    }
  }, [state.currentPage, state.lastItemId, itemsPerPage, state.searchInput]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight) {
        handleLoadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleLoadMore]);

  const fetchData = async () => {
    try {
      const response = await fetchWork(null, itemsPerPage, null, state.searchInput);
      if (response?.payload) {
        const filteredWork = response.payload.filter(item => item.domain.id === selectedDomain);
        setState(prevState => ({
          ...prevState,
          work: filteredWork,
          totalResults: response.totalCount, // Assuming API returns total count
          currentPage: 1,
          lastItemId: filteredWork.length > 0 ? filteredWork[filteredWork.length - 1].id : null,
          hasMore: filteredWork.length === itemsPerPage,
        }));
      } else {
        console.error("Error fetching work:", response.errorCode);
      }
    } catch (error) {
      console.error("Error fetching work:", error);
    }
  };

  const handleCardClick = useCallback((workId) => {
    history.push(`/cwm/${workId}`);
    window.location.reload();
  }, [history]);

  const handleSearch = useCallback(async () => {
    setState(prevState => ({ ...prevState, currentPage: 1, lastItemId: null, hasMore: true }));
    await fetchData();
  }, [state.searchInput]);

  const filteredWork = useMemo(() => {
    return state.work.filter(item => item.domain.id === selectedDomain);
  }, [state.work, selectedDomain]);

  // Logging for debugging
  console.log("State:", state);

  return (
    <div>
      <SubHeader
        showLocationForm={state.showLocationForm}
        setShowLocationForm={(value) => setState(prevState => ({ ...prevState, showLocationForm: value }))}
        showWorkForm={state.showWorkForm}
        setShowWorkForm={(value) => setState(prevState => ({ ...prevState, showWorkForm: value }))}
        showTaskForm={state.showTaskForm}
        setShowTaskForm={(value) => setState(prevState => ({ ...prevState, showTaskForm: value }))}
        searchInput={state.searchInput}
        setSearchInput={(value) => setState(prevState => ({ ...prevState, searchInput: value }))}
        handleSearch={handleSearch}
        selectedDomain={selectedDomain}
      />
      <div className="cwm-search-page">
        <br />
        {/* <div className="total-results">
          Total Results: {state.totalResults}
        </div> */}
        <div className="assets-cards-container">
          {filteredWork.length > 0 ? (
            filteredWork.map((item, index) => (
              <div key={item.id} onClick={() => handleCardClick(item.id)}>
                <Link to={`/cwm/${item.id}`} style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
                  <WorkCard item={item} />
                </Link>
                {index === filteredWork.length - 1 && !state.hasMore && (
                  <div style={{ textAlign: 'center', marginTop: '10px', color: '#999' }}>
                    No more items to load.
                  </div>
                )}
              </div>
            ))
          ) : (
            <div>No CATERs available</div>
          )}
        </div>
        <br /><br />
      </div>
    </div>
  );
};

const WorkCard = React.memo(({ item }) => {
  const createdDate = new Date(item.createdDate);
  const currentTime = new Date();
  const timeDifference = currentTime - createdDate;
  const twentyFourHours = 24 * 60 * 60 * 1000;
  const isNew = timeDifference < twentyFourHours;

  return (
    <div className="work-cards">
      <div className="first-column">
        <div className="colored-tags">
          <span className={`colored-tag ${getTagColor(item.currentStatus.status)}`}>{item.currentStatus.status}</span>
          <span className={`colored-tag ${getTagColor(item.workType.title)}`}>{item.workType.title || 'Unknown'}</span>
        </div>
        <p className="description">{item.description}</p>
        <div className="additional-info">
          <p>{`# ${item.workNumber}`} &bull; {`Created By: ${item.createdBy}`} &bull; {`Assigned To: ${item.assignedTo}`}</p>
        </div>
      </div>
      <div className="second-column">
        <div className="row">
          <p className="cwm-content"><span className="cwm-label">SHOP </span>{item.shopGroup.name}</p>
        </div>
        <div className="row">
          <p className="cwm-content"><span className="cwm-label">AREA </span>{item.location.name}</p>
        </div>
      </div>
    </div>
  );
});

const getTagColor = (title) => {
  if (title && title.startsWith('So')) return 'blue';
  if (title && title.startsWith('Ha')) return 'brown';
  if (title && title.startsWith('Ne')) return 'green';
  if (title && title.startsWith('Ge')) return 'purple';
  return 'red';
};

export default SearchPage;