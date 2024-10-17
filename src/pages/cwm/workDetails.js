import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { updateWork, addToBucket, fetchAllBucket } from "../../services/api";
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

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`cwm-tab ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  );
}

const WorkDetails = () => {
  const { workId } = useParams();
  const location = useLocation();
  const selectedDomain = location.state?.selectedDomain;
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const sidebarRef = useRef(null);
  const [activeTab, setActiveTab] = useState("activityLog");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showSideSheet, setShowSideSheet] = useState(false);
  const [sideSheetContent, setSideSheetContent] = useState(null);
  const [buckets, setBuckets] = useState([]);
  const [originalBucketId, setOriginalBucketId] = useState(null);  // Store the original bucketId
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [temporaryBucketId, setTemporaryBucketId] = useState("");


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
  } = useWorkDetails(selectedDomain, workId);

  useEffect(() => {
    const fetchWorkDetails = async () => {
      try {
        const response = await fetchAllBucket();
        setBuckets(response.payload);
        if (workDetails?.bucketId) {
          setOriginalBucketId(workDetails.bucketId);
          console.log(workDetails.domain.id);
        }
      } catch (error) {
        console.error("Error fetching work details:", error);
      }
    };
console.log(selectedDomain);
    fetchWorkDetails();
  }, [workId, workDetails]);

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

  const mapStatusToStep = (backendStatus) => {
    const statusMap = {
      PendingAssignment: "Pending Assignment",
      PendingApproval: "Pending Approval",
      ReadyForWork: "Ready for Work",
      WorkInProgress: "Work in Progress",
      WorkComplete: "Work Complete",
      Closed: "Closed",
      Created: "Created",
    };

    // Default to 'Pending Assignment' if status is not found in the map
    return statusMap[backendStatus];
  };

  const getCurrentStatus = () => {
    if (workDetails?.currentStatus?.status) {
      return mapStatusToStep(workDetails.currentStatus.status);
    }
    return ''; // Default case if no status is available
  };


  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = async (e, field, customFieldId = null) => {
    const newValue = e.target.value;
  
    console.log('New value:', newValue); // <-- Debug the new value
    console.log('CustomFieldId:', customFieldId); // <-- Check which custom field is being updated
  
    if (customFieldId) {
      const updatedCustomFields = workDetails.customFields.map((customField) => {
        if (customField.id === customFieldId) {
          console.log('Updating field:', customField); // <-- See which field is being updated
          return { ...customField, value: newValue }; // Update the field's value
        }
        return customField;
      });
  
      setWorkDetails({
        ...workDetails,
        customFields: updatedCustomFields, // Update the state with new custom field values
      });

      console.log("CUSTOM FIELDS", customFields);
    } else {
      setWorkDetails({
        ...workDetails,
        [field]: newValue,
      });

    }
  
    console.log('Updated WorkDetails:', workDetails); // <-- Check if the state is updated correctly
  };
  

  const handleEditClick = () => {
    console.log("Edit button clicked"); // Add this line
    setIsEditing(true);
    setHasUnsavedChanges(false); // Reset change tracking on entering edit mode
  };


  const handleCancelClick = () => {
    setIsEditing(false);
    setHasUnsavedChanges(false); // Reset change tracking on cancel
    // Optionally, you might want to fetch the original workDetails again to reset any local changes.
  };

  const handleShowForm = () => {
    setShowTaskForm(true);
  };
  const handleSubmit = async () => {
    if (isEditing) {
      try {
        const updatedWorkDetails = {
          ...workDetails,
          customFields: workDetails.customFields.map(field => ({
            id: field.id,
            value: field.value,
          })),
        };

        console.log("Updated Work Details:", updatedWorkDetails);

        await updateWork(workDetails.domain.id, workId, updatedWorkDetails);
        toast.success("Work details updated successfully!");
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Error updating work details:", error);
        toast.error("Failed to update work details.");
      }
    }
    setIsEditing(!isEditing);
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
      {/* Tab Bar */}
      <div className="tab-extension">
        <div className="tab-bar">
          <NavLink to={`/cwm/dashboard`}>Dashboard</NavLink>
          <NavLink to={`/cwm/search`}>Search</NavLink>
          <NavLink to={`/cwm/admin`}>Admin</NavLink>
        </div>
      </div>
      <div style={{ marginLeft: "20px" }}>
        <Breadcrumb items={breadcrumbItems} style={{ paddingLeft: "40px" }} />
      </div>
      <div className="work-content-container">
        <ProgressBar currentStatus={getCurrentStatus()} />
        <div className="header-container">
          <h3>Issue</h3>
          <button
            className="save-button"
            onClick={handleSubmit} // Call handleSubmit directly
            disabled={false}
          >
            {isEditing ? "Save" : "Edit"}
          </button>

          {isEditing && (
            <button className="cancel-button" onClick={handleCancelClick}>
              Cancel
            </button>
          )}
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
                <SelectField
                  label="Bucket"
                  value={temporaryBucketId || workDetails.currentBucketAssociation?.bucket?.id || ""}
                  options={[
                    { value: "", label: "Select a bucket" },
                    ...buckets.map(bucket => ({
                      value: bucket.id,
                      label: bucket.description,
                    })),
                  ]}
                  onChange={(e) => handleInputChange(e, 'bucketId')}
                  disabled={!isEditing}
                />

              </div>

              <div className="cater-column">
                <SelectField
                  label="Area"
                  value={workDetails.location}
                  options={locations}
                  onChange={(e) => handleInputChange(e, 'location')}
                  disabled={!isEditing} // Disable if not editing
                />
                <DetailRow label="Area Manager" value={workDetails.location.locationManagerUserId} />
                <SelectField
                  label="Subsystem"
                  value={workDetails.subsystem}
                  options={lovValues}
                  onChange={(e) => handleInputChange(e, 'subsystem')}
                  disabled={!isEditing} // Disable if not editing
                />
                <SelectField
                  label="Shop"
                  value={workDetails.shopGroup.name}
                  options={shopgroups}
                  onChange={(e) => handleInputChange(e, 'shopGroup.name')}
                  disabled={!isEditing} // Disable if not editing
                />
                <SelectField
                  label="Assigned To"
                  value={workDetails.assignedTo}
                  options={shopGroupUsers.map(user => ({ id: user.mail, value: user.mail, name: user.gecos }))}
                  onChange={(e) => handleInputChange(e, 'assignedTo')}
                  disabled={!isEditing} // Disable if not editing
                />
                <DetailRow label="Asset">
                  <input
                    type="text"
                    value={workDetails.asset}
                    className="input-field"
                    onChange={(e) => handleInputChange(e, 'asset')}
                    disabled={!isEditing} // Disable if not editing
                  />
                </DetailRow>
              </div>
            </div>

            <div className="full-width-row">
              <DetailRow label="Title">
                <input
                  type="text"
                  value={workDetails.title}
                  className="input-field"
                  onChange={(e) => handleInputChange(e, 'title')}
                  disabled={!isEditing} // Disable if not editing
                />
              </DetailRow>
              <DetailRow label="Description">
                <textarea
                  value={workDetails.description}
                  className="textarea-field"
                  onChange={(e) => handleInputChange(e, 'description')}
                  disabled={!isEditing} // Disable if not editing
                />
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
          <h2>Custom Fields</h2>
          <div className="custom-fields-container">
            {customFields.length > 0 ? (
              <div className="custom-fields-grid">
                {customFields.map((field) => (
                  <DetailRow key={field.id} label={field.description}>
                    {field.valueType === "LOV" ? (
                      <SelectField
                        className="input-field"
                        value={field.value || ""} // Set to empty string if no value
                        options={[
                          { value: "", label: "Select an option" },
                          ...field.lovValues.map(lov => ({
                            value: lov.value,
                            label: lov.description,
                          })),
                        ]}
                        onChange={(e) => handleInputChange(e, 'customField', field.id)} // Pass the customFieldId here
                        disabled={!isEditing}
                      />
                    ) : (
                      <input
                        className="input-field"
                        type={field.valueType === "Double" ? "number" : "text"}
                        value={field.value || ""} // Default to empty string
                        onChange={(e) => handleInputChange(e, 'customField', field.id)} // Pass the customFieldId here
                        disabled={!isEditing}
                      />
                    )}
                  </DetailRow>
                ))}
              </div>
            ) : (
              <p>No custom fields available.</p>
            )}
          </div>

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
