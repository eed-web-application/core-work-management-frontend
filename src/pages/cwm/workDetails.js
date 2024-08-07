import React, { useState, useEffect, useRef, lazy, Suspense, useMemo } from "react";
import { useParams, useHistory } from "react-router-dom";
import { fetchAWork, fetchEntriesByOriginId, fetchActivity, fetchShopGroups, fetchLocations, fetchAActivity, fetchLogbooks, fetchWorkDomain, fetchLovValues, updateWork, fetchShopGroup, fetchLovValuesForField, fetchActivityType,fetchActivitySubtype } from "../../services/api";
import Breadcrumb from "../../components/Breadcrumb";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';
import ActivityForm from "./activityForm";
import SideSheet from "../../components/SideSheet";
import "./workDetails.css";
import styles from './SideSheet.module.css';

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
  const [initialAssignedTo, setInitialAssignedTo] = useState(null);
  const [showSideSheet, setShowSideSheet] = useState(false);
  const [sideSheetContent, setSideSheetContent] = useState(null);

  const [activityData, setActivityData] = useState({});
  const [activityTypes, setActivityTypes] = useState([]);
  const [activityType, setActivityType] = useState(null);
  const [activitySubtypes, setActivitySubtypes] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [renderedComponents, setRenderedComponents] = useState({});
  const [lovValuesDictionary, setLovValuesDictionary] = useState({});


  const breadcrumbItems = useMemo(() => [
    { label: "Home", link: "/" },
    { label: "Issues", link: "/cwm" },
    { label: "Issue Details", link: `/cwm/${workId}` },
  ], [workId]);

  const fetchCustomData = async (workId, activityId) => {
    try {
      const workResponse = await fetchAActivity(workId, activityId);
      console.log(workResponse.payload);
      const { title, description, activityType, activityTypeSubtype, customFields } = workResponse.payload;
      const activityTypeId = activityType ? activityType.id : "";
  
      setActivityType(activityType);
  
      const customFieldsData = {};
      customFields.forEach((field) => {
        customFieldsData[field.name] = field.value.value;
      });
  
      setActivityData({
        title,
        description,
        activityTypeId,
        activityTypeSubtype,
        ...customFieldsData,
      });
  
      setCustomFields(customFields);
  
      const typeResponse = await fetchActivityType();
      setActivityTypes(typeResponse.payload || []);
  
      const subtypeResponse = await fetchActivitySubtype();
      setActivitySubtypes(subtypeResponse.payload || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  useEffect(() => {
    console.log(activityType);
  }, [activityType]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workResponse, activityResponse] = await Promise.all([
          fetchAWork(workId),
          fetchActivity(workId),
        ]);
        setWorkDetails(workResponse.payload);
        setInitialAssignedTo(workResponse.payload.assignedTo);
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


  useEffect(() => {
    // Fetch LOV values for each field and create the dictionary
    const fetchLovValues = async () => {
      const dictionary = {};
      for (const field of customFields) {
        try {
          const lovValuesResponse = await fetchLovValuesForField("Activity", activityData.activityTypeId, field.name);
          if (lovValuesResponse.errorCode === 0) {
            const lovValues = lovValuesResponse.payload.map((value) => ({
              id: value.id,
              value: value.value,
            }));
            if (lovValues.length > 0) { // Check if LOV values are not empty
              dictionary[field.name] = lovValues;
            }
          } else {
            console.error(
              "Error fetching LOV values for field:",
              field.name,
              lovValuesResponse.errorMessage
            );
          }
        } catch (error) {
          console.error("Error fetching LOV values for field:", field.name, error);
        }
      }
      setLovValuesDictionary(dictionary);
    };

    fetchLovValues();
  }, [activityData.activityTypeId, customFields]);

  const getCurrentStatus = () => {
    if (workDetails) {
      if (activities.length > 0) {
        return 'Job Created';
      }
      if (initialAssignedTo) { // Use initialAssignedTo to determine status
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
      console.log(selectedActivity);

      await fetchCustomData(workId, activity.id);

      // Prepare content for SideSheet
      const content = (
        <div className="job-detail">
          <h1 className="form-title">Task Details</h1>

          <form onSubmit={handleSubmit} className="work-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={activity.title}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={activity.description}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="activityTypeId" className="form-label">
                Activity Type
              </label>
              <select
                id="activityTypeId"
                name="activityTypeId"
                value={activity.activityTypeId}
                onChange={handleInputChange}
                className="form-select"
              >
                {activityTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="activityTypeSubtype" className="form-label">
                Activity Subtype
              </label>
              <select
                id="activityTypeSubtype"
                name="activityTypeSubtype"
                value={activityData.activityTypeSubtype}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select Activity Subtype</option>
                {activitySubtypes.map((subtype, index) => (
                  <option key={index} value={subtype}>
                    {subtype}
                  </option>
                ))}
              </select>
            </div>

            {/* Mapping over customFields to render fields */}
            {activityType && activityType.customFields &&
              activityType.customFields.map((field) => (
                <div key={field.id} className="form-group">
                  <label htmlFor={field.name} className="form-label">
                    {camelToNormalCase(field.label)}
                  </label>
                  {/* Check if field name exists in lovValuesDictionary and if valueType is not 'Boolean' */}
                  {field.valueType === "Date" ? ( // Check if valueType is 'Date'
                    <input
                      type="date" // Use input type date for date values
                      id={field.name}
                      name={field.name}
                      value={activityData[field.name] || ""}
                      onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                      className="form-input"
                    />
                  ) : field.name in lovValuesDictionary && field.valueType !== 'Boolean' ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={activityData[field.name]}
                      onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                      className="form-select"
                    >
                      {lovValuesDictionary[field.name].map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.value}
                        </option>
                      ))}
                    </select>
                  ) : field.valueType === "Boolean" ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={activityData[field.name]}
                      onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                      className="form-select"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      id={field.name}
                      name={field.name}
                      value={activityData[field.name] || ""}
                      onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                      className="form-input"
                    />
                  )}
                </div>
              ))}
            <button type="submit" className="form-button">
              Update Activity
            </button>
          </form>
        </div>
      );

      setSideSheetContent(content);
      setShowSideSheet(true);
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };


  // const handleActivityClick = async (activity) => {
  //   try {
  //     const response = await fetchAActivity(workId, activity.id);
  //     setSelectedActivity(response.payload);
  //     setShowJobDetails(true);
  //     history.push(`/cwm/${workId}/${activity.id}`);
  //   } catch (error) {
  //     console.error("Error fetching activity:", error);
  //   }
  // };

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
      setInitialAssignedTo(workDetails.assignedTo); // Update initialAssignedTo after saving
      // Call getCurrentStatus again to update the progress bar status
      const updatedStatus = getCurrentStatus();
      console.log("Updated status:", updatedStatus);
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

  // Utility function to convert camelCase to normal casing
  const camelToNormalCase = (camelCase) => {
    const words = camelCase.split(/(?=[A-Z])/); // Split camelCase string into words
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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
            {activities.map((activity, index) => (
              <div className="detail-row" key={activity.id}>
                <label className="job-label">Task #{index + 1}</label> {/* Use index to dynamically number the tasks */}
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

        {showSideSheet && (
          <SideSheet
            sheetBody={sideSheetContent}
            isOpen={showSideSheet}
            onClose={() => setShowSideSheet(false)}
          />
        )}
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
