import React, { useState, useEffect, useRef, lazy, Suspense, useMemo } from "react";
import { useParams, useHistory } from "react-router-dom";
import { fetchAWork, fetchEntriesByOriginId, fetchActivity, fetchShopGroups, fetchLocations, fetchAActivity, fetchLogbooks, fetchWorkDomain, fetchLovValues, updateWork, fetchShopGroup, fetchLovValuesForField } from "../../services/api";
import Breadcrumb from "../../components/Breadcrumb";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';
import ActivityForm from "./activityForm";
import "./workDetails.css";

// const ActivityForm = lazy(() => import("./activityForm"));
const EditWorkForm = lazy(() => import("./editWorkForm"));
const EditActivityForm = lazy(() => import("./editActivityForm"));

const WorkDetails = () => {
  const { workId, activityId } = useParams();
  const [workDetails, setWorkDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [activities, setActivities] = useState([]);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const sidebarRef = useRef(null);
  const [workEntries, setWorkEntries] = useState([]);
  const [activityEntries, setActivityEntries] = useState([]);
  const [activeTab, setActiveTab] = useState("activityLog");
  const [shopGroupUsers, setShopGroupUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [shopgroups, setShopgroups] = useState([]);
  const history = useHistory();
  const [lovValues, setLovValues] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const breadcrumbItems = useMemo(() => [
    { label: "Home", link: "/" },
    { label: "Issues", link: "/cwm" },
    { label: "Issue Details", link: `/cwm/${workId}` },
  ], [workId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workResponse, activityResponse] = await Promise.all([
          fetchAWork(workId),
          fetchActivity(workId),
        ]);
        setWorkDetails(workResponse.payload);
        setActivities(activityResponse.payload);

        const shopGroupResponse = await fetchShopGroup(workResponse.payload.shopGroup.id);
        setShopGroupUsers(shopGroupResponse.payload.users.map(user => user.user));

        const locationsResponse = await fetchLocations();
        setLocations(locationsResponse.payload);

        const shopgroupsResponse = await fetchShopGroups();
        setShopgroups(shopgroupsResponse.payload);

        // Fetch LOV values for area, subsystem, and shop
        const subsystemValues = await fetchLovValuesForField("Activity", "664ba5664481b1475780792e", "subsystem");
        setLovValues(subsystemValues.payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [workId]);

  useEffect(() => {
    const fetchWorkEntries = async () => {
      if (workDetails?.workNumber) {
        try {
          const response = await fetchEntriesByOriginId(`cwm:work:${workDetails.workNumber}`);
          setWorkEntries(response.payload);
        } catch (error) {
          console.error("Error fetching entries:", error);
        }
      }
    };
    fetchWorkEntries();
  }, [workDetails]);

  useEffect(() => {
    const fetchActivityEntries = async () => {
      if (selectedActivity && workDetails?.workNumber) {
        try {
          const response = await fetchEntriesByOriginId(`cwm:work:${workDetails.workNumber}:job:${selectedActivity.activityNumber}`);
          setActivityEntries(response.payload);
        } catch (error) {
          console.error("Error fetching entries:", error);
        }
      }
    };
    fetchActivityEntries();
  }, [selectedActivity, workDetails]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowJobDetails(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getCurrentStatus = () => {
    if (workDetails) {
      if (activities.length > 0) {
        return 'Job Created';
      }
      if (workDetails.assignedTo) {
        return 'Assigned Personnel';
      }
      return 'Created';
    }
    return 'Pending Assignment';
  };

  const addComment = (text, parentId = null) => {
    const newComment = {
      id: Date.now(),
      text,
      date: new Date(),
      replies: [],
      parentId,
    };
    setComments((prevComments) => {
      if (parentId) {
        const updateComments = (comments) => {
          return comments.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...comment.replies, newComment],
              };
            }
            if (comment.replies.length) {
              return {
                ...comment,
                replies: updateComments(comment.replies),
              };
            }
            return comment;
          });
        };
        return updateComments(prevComments);
      }
      return [...prevComments, newComment];
    });
  };


  const handleActivityClick = async (activity) => {
    try {
      const response = await fetchAActivity(workId, activity.id);
      setSelectedActivity(response.payload);
      setShowJobDetails(true);
      history.push(`/cwm/${workId}/${activity.id}`);
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const convertCamelCaseToNormalCase = (camelCaseString) => {
    const normalizedString = camelCaseString.replace(/([A-Z])/g, " $1");
    return normalizedString.charAt(0).toUpperCase() + normalizedString.slice(1);
  };

  const formatDateTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateTimeString));
  };


  // New functions for handling form input changes
  const handleInputChange = (e, field) => {
    if (field === 'assignedTo') {
      const options = e.target.options;
      const selectedValues = [];
      for (let i = 0, len = options.length; i < len; i++) {
        if (options[i].selected) {
          selectedValues.push(options[i].value);
        }
      }
      setWorkDetails({
        ...workDetails,
        [field]: selectedValues,
      });
    } else {
      setWorkDetails({
        ...workDetails,
        [field]: e.target.value,
      });
    }
  };

  const handleShowForm = () => {
    setShowActivityForm(true);
  };

  const handleHideForm = () => {
    setShowActivityForm(false);
  };

  const handleCustomFieldChange = (e, id) => {
    setWorkDetails({
      ...workDetails,
      customFieldValues: workDetails.customFieldValues.map(field =>
        field.id === id ? { ...field, value: { ...field.value, value: e.target.value } } : field
      ),
    });
  };

  const handleSubmit = async () => {
    console.log("Submitting form...");
    try {
      await updateWork(workId, workDetails);
      console.log("Work details updated successfully!");
      toast.success("Work details updated successfully!");
    } catch (error) {
      console.error("Error updating work details:", error);
      toast.error("Failed to update work details.");
    }
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      setComments([...comments, { id: Date.now(), text: newComment, date: new Date() }]);
      setNewComment("");
    }
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
  };

  const renderComments = (comments) => {
    return comments.map(comment => (
      <div key={comment.id} className="comment-item">
        <p>{comment.text}</p>
        <span>{formatDateTime(comment.date)}</span>
        <button onClick={() => handleReply(comment.id)}>Reply</button>
        {comment.replies.length > 0 && (
          <div className="replies">
            {renderComments(comment.replies)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div>
      <div style={{ marginLeft: "20px" }}>
        <Breadcrumb items={breadcrumbItems} style={{ paddingLeft: "40px" }} />
      </div>
      <div className="work-content-container">
        <ProgressBar currentStatus={getCurrentStatus()} />
        <div className="header-container">
          <h3>Issue</h3>
          <button className="save-button" onClick={handleSubmit}>Save</button>
        </div>


        {loading ? (
          <p>Loading...</p>
        ) : workDetails ? (
          <div className="details-container">
            <div className="detail-columns">
              <div className="cater-column">
                <div className="detail-row">
                  <label className="work-label">CATER ID</label>
                  <span className="text-field">{workDetails.workNumber}</span>
                </div>
                <div className="detail-row">
                  <label className="work-label">Status</label>
                  <span className="text-field">{convertCamelCaseToNormalCase(workDetails.currentStatus.status)}</span>
                </div>
                <div className="detail-row">
                  <label className="work-label">Type</label>
                  <span className="text-field">{workDetails.workType.title}</span>
                </div>
                <div className="detail-row">
                  <label className="work-label">Project</label>
                  <span className="text-field">LCLS</span>
                </div>
                <div className="detail-row">
                  <label className="work-label">Reported By</label>
                  <span className="text-field">{workDetails.createdBy}</span>
                </div>
                <div className="detail-row">
                  <label className="work-label">Reported Date</label>
                  <span className="text-field">{formatDateTime(workDetails.createdDate)}</span>
                </div>
              </div>

              <div className="cater-column">
                <div className="detail-row">
                  <label className="work-label">Area</label>
                  <select
                    value={workDetails.location}
                    className="input-field"
                    onChange={(e) => handleInputChange(e, 'location')}
                  >
                    {locations.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="detail-row">
                  <label className="work-label">Area Manager</label>
                  <span type="text-field">{workDetails.location.locationManagerUserId}</span>
                </div>
                <div className="detail-row">
                  <label className="work-label">Subsystem</label>
                  <select
                    value={workDetails.subsystem}
                    className="input-field"
                    onChange={(e) => handleInputChange(e, 'subsystem')}
                  >
                    {lovValues.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="detail-row">
                  <label className="work-label">Shop</label>
                  <select
                    value={workDetails.shopGroup.name}
                    className="input-field"
                    onChange={(e) => handleInputChange(e, 'shopGroup.name')}
                  >
                    {shopgroups.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="detail-row">
                  <label className="work-label">Assigned To</label>
                  <select
                    value={workDetails.assignedTo}
                    className="input-field"
                    onChange={(e) => handleInputChange(e, 'assignedTo')}
                  >
                    <option value=""></option>
                    {shopGroupUsers.map(user => (
                      <option key={user.mail} value={user.mail}>
                        {`${user.gecos}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="detail-row">
                  <label className="work-label">Asset</label>
                  <input type="text" value={workDetails.asset} className="input-field" onChange={(e) => handleInputChange(e, 'asset')} />
                </div>
              </div>
            </div>

            <div className="full-width-row">
              <div className="detail-row">
                <label className="work-label">Title</label>
                <input type="text" value={workDetails.title} className="input-field" onChange={(e) => handleInputChange(e, 'title')} />
              </div>
              <div className="detail-row">
                <label className="work-label">Description</label>
                <textarea value={workDetails.description} className="textarea-field" onChange={(e) => handleInputChange(e, 'description')} />
              </div>
            </div>
          </div>
        ) : (
          <p>No details available.</p>
        )}

        <br /><br />
        <hr />

        <div className="activities-container">
          <div className="tasks-header-container">
            <h3>Tasks</h3>
            <div className="button-container">
              <button className="modern-button" onClick={handleShowForm}> + </button>
              {showActivityForm && (
                <ActivityForm
                  showActivityForm={showActivityForm}
                  setShowActivityForm={setShowActivityForm}
                />
              )}
            </div>
          </div>

          {/* <ActivityForm showActivityForm={showActivityForm} setShowActivityForm={setShowActivityForm} /> */}
          <ul className="activity-list">
            {activities.map((activity) => (
              <div className="detail-row" key={activity.id}>
                <label className="job-label">Task #1</label>
                <li
                  className={`activity-item ${selectedActivity && selectedActivity.id === activity.id ? "selected" : ""}`}
                  onClick={() => handleActivityClick(activity)}
                >
                  <div className="activity-status">
                    <span className="activity-status-label">Status: </span>
                    <span className="activity-status-value">
                      {convertCamelCaseToNormalCase(activity.currentStatus.status)}
                    </span>
                  </div>
                  <p>Title: {activity.title}</p>
                  <p>{activity.description}</p>
                </li>
              </div>
            ))}
          </ul>
        </div>

          {showJobDetails ? <div className={`activity-sidebar-container ${showJobDetails ? "open" : ""}`} ref={sidebarRef}>
            {selectedActivity && (
              <div className="job-detail">
                <h3>Task Details</h3>
                <div className="detail-row">
                  <label className="work-label">Status:</label>
                  <input type="text" value={convertCamelCaseToNormalCase(selectedActivity.currentStatus.status)} className="input-field" readOnly />
                </div>
                <div className="detail-row">
                  <label className="work-label">Title:</label>
                  <input type="text" value={selectedActivity.title} className="input-field" readOnly />
                </div>
                <div className="detail-row">
                  <label className="work-label">Description:</label>
                  <textarea value={selectedActivity.description} className="textarea-field" readOnly />
                </div>
                <div className="detail-row">
                  <label className="work-label">Assigned To:</label>
                  <input type="text" value={selectedActivity.assignedTo} className="input-field" readOnly />
                </div>
              </div>
            )}
          </div> : <></>}
        <hr /><br />

        <div className="tabs-container">
          <div className="tab-buttons">
            <button className={`tab-button ${activeTab === "activityLog" ? "active" : ""}`} onClick={() => handleTabChange("activityLog")}>
              Activity Log
            </button>
            <button className={`tab-button ${activeTab === "comments" ? "active" : ""}`} onClick={() => handleTabChange("comments")}>
              Comments
            </button>
            <button className={`tab-button ${activeTab === "emailsSent" ? "active" : ""}`} onClick={() => handleTabChange("emailsSent")}>
              Emails Sent
            </button>
            <button className={`tab-button ${activeTab === "elogEntries" ? "active" : ""}`} onClick={() => handleTabChange("elogEntries")}>
              eLog Entries
            </button>
          </div>
          <div className="tab-content">
            {activeTab === "activityLog" && (
              <div className="status-log-container">
                {workDetails && workDetails.statusHistory ? (
                  workDetails.statusHistory.map((statusChange, index) => (
                    <div key={index} className="status-change-container">
                      <div className="status-change-header">
                        <span>{statusChange.changed_by}</span>
                        <span>{new Date(statusChange.changed_on).toLocaleString()}</span>
                      </div>
                      <div className="status-change-body">
                        <span>Changed "Assigned To" to "Name3 Surname3"</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No status history available.</p>
                )}
              </div>
            )}

            {activeTab === "comments" && (
              <div className="comments-section">
                <h3>Comments</h3>
                <div className="comment-form">
                  {replyTo && (
                    <div className="replying-to">
                      <p>Replying to: {comments.find(comment => comment.id === replyTo)?.text}</p>
                      <button onClick={() => setReplyTo(null)}>Cancel Reply</button>
                    </div>
                  )}
                  <textarea
                    className="comment-input"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button className="add-comment-button" onClick={handleCommentSubmit}>Post Comment</button>
                </div>
                <div className="comment-list">
                  {comments.length > 0 ? (
                    renderComments(comments)
                  ) : (
                    <p>No comments yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkDetails;
