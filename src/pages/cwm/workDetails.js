import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { updateWork } from "../../services/api";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumb from "../../components/Breadcrumb";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import ActivityForm from "./taskForm";
import SideSheet from "../../components/SideSheet";
import activityStyles from './activitySideSheet.module.css';
import useWorkDetails from '../../hooks/useWorkDetails';
import SelectField from "../../components/SelectField";
import Tabs from "../../components/Tabs";
import CommentsSection from "../../components/CommentsSection";
import "./workDetails.css";

const WorkDetails = () => {
  const { workId } = useParams();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const sidebarRef = useRef(null);
  const [activeTab, setActiveTab] = useState("activityLog");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showSideSheet, setShowSideSheet] = useState(false);
  const [sideSheetContent, setSideSheetContent] = useState(null);

  const {
    workDetails,
    activities,
    shopGroupUsers,
    locations,
    shopgroups,
    lovValues,
    initialAssignedTo,
    loading,
    customFields,
    setWorkDetails,
  } = useWorkDetails(workId);

  const breadcrumbItems = useMemo(() => [
    { label: "Home", link: "/" },
    { label: "Issues", link: "/cwm" },
    { label: "Issue Details", link: `/cwm/${workId}` },
  ], [workId]);

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
      if (initialAssignedTo) {
        return 'Assigned Personnel';
      }
      return 'Created';
    }
    return 'Pending Assignment';
  };

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

  const handleSubmit = async () => {
    console.log("Submitting form...");
    try {
      await updateWork(workId, workDetails);
      console.log("Work details updated successfully!");
      toast.success("Work details updated successfully!");
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

  const convertCamelCaseToNormalCase = (camelCaseString) => {
    const normalizedString = camelCaseString.replace(/([A-Z])/g, " $1");
    return normalizedString.charAt(0).toUpperCase() + normalizedString.slice(1);
  };

  const formatDateTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateTimeString));
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

        {/* Display custom fields */}
        <h2>Custom Fields</h2>
        <div className="custom-fields-container">
          {customFields.length > 0 ? (
            <div className="custom-fields-grid">
              {customFields.map((field) => (
                <DetailRow key={field.id} label={field.description}>
                  {field.valueType === "LOV" ? (
                    <select className="input-field">
                      {field.lovValues.map((lov) => (
                        <option key={lov.id} value={lov.value}>
                          {lov.description}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="input-field"
                      type={field.valueType === "Double" ? "number" : "text"}
                    />
                  )}
                </DetailRow>
              ))}
            </div>
          ) : (
            <p>No custom fields available.</p>
          )}
        </div>
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
