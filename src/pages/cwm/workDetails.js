import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { fetchAWork, fetchActivitiesOfWork, fetchShopGroups, fetchLocations, fetchAActivity, updateWork, fetchShopGroup, fetchLovValuesForField, fetchActivityType, fetchActivitySubtype } from "../../services/api";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumb from "../../components/Breadcrumb";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import ActivityForm from "./taskForm";
import SideSheet from "../../components/SideSheet";
import ActivityDetailForm from './activityDetailForm';
import activityStyles from './activitySideSheet.module.css';
import "./workDetails.css";

const WorkDetails = () => {
  const { workId, activityId } = useParams();
  const [loading, setLoading] = useState(true);

  const [workDetails, setWorkDetails] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const sidebarRef = useRef(null);
  const [activeTab, setActiveTab] = useState("activityLog");
  const [shopGroupUsers, setShopGroupUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [shopgroups, setShopgroups] = useState([]);
  const [lovValues, setLovValues] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [initialAssignedTo, setInitialAssignedTo] = useState(null);
  const [showSideSheet, setShowSideSheet] = useState(false);
  const [sideSheetContent, setSideSheetContent] = useState(null);

  const [activityData, setActivityData] = useState({});
  const [activityTypes, setActivityTypes] = useState([]);
  const [activityType, setActivityType] = useState(null);
  const [activitySubtypes, setActivitySubtypes] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [lovValuesDictionary, setLovValuesDictionary] = useState({});

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
          fetchActivitiesOfWork(workId),
        ]);
        setWorkDetails(workResponse.payload);
        setInitialAssignedTo(workResponse.payload.assignedTo);
        setActivities(activityResponse.payload);

        // populate assignedTo, locations, and shop groups dropdowns
        const shopGroupResponse = await fetchShopGroup(workResponse.payload.shopGroup.id);
        setShopGroupUsers(shopGroupResponse.payload.users.map(user => user.user));
        const locationsResponse = await fetchLocations();
        setLocations(locationsResponse.payload);
        const shopgroupsResponse = await fetchShopGroups();
        setShopgroups(shopgroupsResponse.payload);

        // Fetch LOV values for subsystem
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

  const fetchActivityData = async (workId, activityId) => {
    try {
      const activityResponse = await fetchAActivity(workId, activityId);
      console.log(activityResponse.payload);
      const { title, description, activityNumber, activityType, activityTypeSubtype, customFields } = activityResponse.payload;
      const activityTypeId = activityType ? activityType.id : "";

      setActivityType(activityType);

      const customFieldsData = {};
      customFields.forEach((field) => {
        customFieldsData[field.name] = field.value.value;
      });

      setActivityData({
        title,
        description,
        activityNumber,
        activityTypeId,
        activityTypeSubtype,
        ...customFieldsData,
      });
      console.log("setActivityData", activityData);

      setCustomFields(customFields);

      const typeResponse = await fetchActivityType();
      setActivityTypes(typeResponse.payload || []);

      const subtypeResponse = await fetchActivitySubtype();
      setActivitySubtypes(subtypeResponse.payload || []);
      console.log(activitySubtypes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
      console.log("setLovValuesDictionary", lovValuesDictionary);
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
      await fetchActivityData(workId, activity.id);
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };

  useEffect(() => {
    if (selectedActivity && activityData) {
      const content = (
        <ActivityDetailForm
          workDetails={workDetails}
          activity={selectedActivity}
          activityTypes={activityTypes}
          activityType={activityType}
          activitySubtypes={activitySubtypes}
          handleInputChange={handleInputChange}
          handleCustomFieldChange={handleCustomFieldChange}
          camelToNormalCase={camelToNormalCase}
          activityData={activityData}
          handleSubmit={handleSubmit}
        />
      );
      setSideSheetContent(content);
      setShowSideSheet(true);
    }
  }, [selectedActivity, activityData]);


  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

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
    setShowTaskForm(true);
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

  const DetailRow = ({ label, value, children }) => (
    <div className="detail-row">
      <label className="work-label">{label}</label>
      {children ? children : <span className="text-field">{value}</span>}
    </div>
  );

  const SelectField = ({ label, value, options, onChange }) => (
    <DetailRow label={label}>
      <select value={value} className="input-field" onChange={onChange}>
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.name || option.value}
          </option>
        ))}
      </select>
    </DetailRow>
  );

  const Tabs = ({ activeTab, handleTabChange, tabs }) => (
    <div className="tabs-container">
      <div className="tab-buttons">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">{tabs.find((tab) => tab.id === activeTab)?.content}</div>
    </div>
  );

  const ActivityLog = ({ workDetails }) => (
    <div className="status-log-container">
      {workDetails?.statusHistory?.length ? (
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
  );

  const CommentsSection = ({ comments, newComment, setNewComment, handleCommentSubmit }) => (
    <div className="comments-section">
      <h3>Comments</h3>
      <div className="comment-form">
        <textarea
          className="comment-input"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="add-comment-button" onClick={handleCommentSubmit}>Post Comment</button>
      </div>
      <div className="comment-list">
        {comments.length > 0 ? comments.map((comment) => <Comment key={comment.id} comment={comment} />) : <p>No comments yet</p>}
      </div>
    </div>
  );

  const convertCamelCaseToNormalCase = (camelCaseString) => {
    const normalizedString = camelCaseString.replace(/([A-Z])/g, " $1");
    return normalizedString.charAt(0).toUpperCase() + normalizedString.slice(1);
  };

  const formatDateTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateTimeString));
  };

  const camelToNormalCase = (str) => str.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());

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
                <DetailRow label="CATER ID" value={workDetails.workNumber} />
                <DetailRow label="Status" value={convertCamelCaseToNormalCase(workDetails.currentStatus.status)} />
                <DetailRow label="Type" value={workDetails.workType.title} />
                <DetailRow label="Project" value="LCLS" />
                <DetailRow label="Reported By" value={workDetails.createdBy} />
                <DetailRow label="Reported Date" value={formatDateTime(workDetails.createdDate)} />
              </div>

              <div className="cater-column">
                <SelectField label="Area" value={workDetails.location} options={locations} onChange={(e) => handleInputChange(e, 'location')} />
                <DetailRow label="Area Manager" value={workDetails.location.locationManagerUserId} />
                <SelectField label="Subsystem" value={workDetails.subsystem} options={lovValues} onChange={(e) => handleInputChange(e, 'subsystem')} />
                <SelectField label="Shop" value={workDetails.shopGroup.name} options={shopgroups} onChange={(e) => handleInputChange(e, 'shopGroup.name')} />
                <SelectField label="Assigned To" value={workDetails.assignedTo} options={shopGroupUsers.map(user => ({ id: user.mail, value: user.mail, name: user.gecos }))} onChange={(e) => handleInputChange(e, 'assignedTo')} />
                <DetailRow label="Asset">
                  <input type="text" value={workDetails.asset} className="input-field" onChange={(e) => handleInputChange(e, 'asset')} />
                </DetailRow>
              </div>
            </div>

            <div className="full-width-row">
              <DetailRow label="Title">
                <input type="text" value={workDetails.title} className="input-field" onChange={(e) => handleInputChange(e, 'title')} />
              </DetailRow>
              <DetailRow label="Description">
                <textarea value={workDetails.description} className="textarea-field" onChange={(e) => handleInputChange(e, 'description')} />
              </DetailRow>
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
            <div className="newTask-button-container">
              <button className="modern-button" onClick={handleShowForm}> + </button>
              {showTaskForm && <ActivityForm showTaskForm={showTaskForm} setShowTaskForm={setShowTaskForm} />}
            </div>
          </div>

          <ul className="activity-list">
            {activities.map((activity, index) => (
              <div className="detail-row" key={activity.id}>
                <label className="job-label">Task #{index + 1}</label>
                <li className={`activity-item ${selectedActivity?.id === activity.id ? "selected" : ""}`} onClick={() => handleActivityClick(activity)}>
                  <div className="activity-status">
                    <span className="activity-status-label">Status: </span>
                    <span className="activity-status-value">{convertCamelCaseToNormalCase(activity.currentStatus.status)}</span>
                  </div>
                  <p>Title: {activity.title}</p>
                  <p>{activity.description}</p>
                </li>
              </div>
            ))}
          </ul>
        </div>

        {showSideSheet && <SideSheet sheetBody={sideSheetContent} isOpen={showSideSheet} onClose={() => setShowSideSheet(false)} styles={activityStyles} />}
        <hr /><br />

        <Tabs
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          tabs={[
            { id: "activityLog", label: "Activity Log", content: <ActivityLog workDetails={workDetails} /> },
            { id: "comments", label: "Comments", content: <CommentsSection comments={comments} newComment={newComment} setNewComment={setNewComment} handleCommentSubmit={handleCommentSubmit} /> },
            { id: "emailsSent", label: "Emails Sent", content: "" },
            { id: "elogEntries", label: "eLog Entries", content: "" },
          ]}
        />
      </div>
    </div>
  );
};

export default WorkDetails;
