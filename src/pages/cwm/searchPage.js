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
    searchInput: "",
    currentPage: 1,
    lastItemId: null,
    work: [],
  });
  const itemsPerPage = 5;
  const history = useHistory();

  useEffect(() => {
    fetchData();
  }, [selectedDomain]);

  const fetchData = async () => {
    try {
      const response = await fetchWork();
      if (response?.payload) {
        const filteredWork = response.payload.filter(item => item.domain.id === selectedDomain);
        setState(prevState => ({ ...prevState, work: filteredWork }));
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
    try {
      setState(prevState => ({ ...prevState, currentPage: 1, lastItemId: null }));
      const searchData = await fetchWork(5, 1, null, state.searchInput);
      setState(prevState => ({
        ...prevState,
        work: searchData.payload,
        lastItemId: searchData.payload?.[searchData.payload.length - 1]?.id || null,
      }));
    } catch (error) {
      console.error("Error fetching work:", error);
    }
  }, [state.searchInput]);

  const handleLoadMore = useCallback(async () => {
    try {
      const nextPageData = await fetchWork(itemsPerPage, state.currentPage + 1, state.lastItemId);
      if (nextPageData.payload.length > 0) {
        setState(prevState => ({
          ...prevState,
          work: [...prevState.work, ...nextPageData.payload],
          currentPage: prevState.currentPage + 1,
          lastItemId: nextPageData.payload[nextPageData.payload.length - 1]?.id,
        }));
      }
    } catch (error) {
      console.error("Error fetching work:", error);
    }
  }, [state.currentPage, state.lastItemId, itemsPerPage]);

  const filteredWork = useMemo(() => {
    return state.work.filter(item => item.domain.id === selectedDomain);
  }, [state.work, selectedDomain]);

  return (
    <div>
      <SubHeader
        showLocationForm={state.showLocationForm}
        setShowLocationForm={(value) => setState(prevState => ({ ...prevState, showLocationForm: value }))}
        showWorkForm={state.showWorkForm}
        setShowWorkForm={(value) => setState(prevState => ({ ...prevState, showWorkForm: value }))}
        searchInput={state.searchInput}
        setSearchInput={(value) => setState(prevState => ({ ...prevState, searchInput: value }))}
        handleSearch={handleSearch}
        selectedDomain={selectedDomain}
      />
      <div className="cwm-search-page">
        <br />
        <div className="assets-cards-container">
          {filteredWork.length > 0 ? (
            filteredWork.map((item) => (
              <div key={item.id} onClick={() => handleCardClick(item.id)}>
                <Link to={`/cwm/${item.id}`} style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
                  <WorkCard item={item} />
                </Link>
              </div>
            ))
          ) : (
            <div>No CATERs available</div>
          )}
          <div className="load-more-button">
            <button onClick={handleLoadMore}>Load More</button>
          </div>
          <br /><br />
        </div>
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
