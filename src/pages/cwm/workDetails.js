import React, { useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom'; // Import Link from react-router-dom
import { fetchAWork, fetchEntriesByOriginId, fetchActivity, fetchAActivity, fetchLogbooks } from "../../services/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import ActivityForm from './activityForm';
import EditWorkForm from './editWorkForm';
import Breadcrumb from '../../components/Breadcrumb';
import EditActivityForm from './editActivityForm';
import './activityForm.css';
import './workDetails.css';

const WorkDetails = () => {
    const { workId, activityId } = useParams(); // Get the asset ID from the URL params
    const [workDetails, setWorkDetails] = useState(null); // State to hold the asset details
    const [loading, setLoading] = useState(true);
    const [showActivityForm, setShowActivityForm] = useState(false); // State to control the visibility of the activity form
    const [showEditForm, setShowEditForm] = useState(false);
    const [activities, setActivities] = useState([]);
    const [showJobDetails, setShowJobDetails] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showEditActivityForm, setShowEditActivityForm] = useState(false);
    const sidebarRef = useRef(null); // Ref for the sidebar panel
    const [entries, setEntries] = useState([]);
    const history = useHistory();

    const breadcrumbItems = [
        { label: 'Home', link: '/' },
        { label: 'Issues', link: '/cwm' },
        { label: 'Issue Details', link: `/work/${workId}` },
    ];

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetchEntriesByOriginId('cwm:work:4');
            setEntries(response.payload);
            console.log(entries);
          } catch (error) {
            console.error("Error fetching entries:", error);
          } finally {
            setLoading(false);
          }
        };
      
        fetchData();
      }, []);

    useEffect(() => {
        const fetchTheLogbooks = async () => {
            try {
                const response = await fetchLogbooks();
            } catch (error) {
                console.error("Error fetching logbooks:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTheLogbooks();
    }, []);

    useEffect(() => {
        const fetchWorkDetails = async () => {
            try {
                const response = await fetchAWork(workId);
                setWorkDetails(response.payload);
            } catch (error) {
                console.error("Error fetching work details:", error);
            } finally {
                setLoading(false);
            }
        };
        const fetchActivities = async () => {
            try {
                const response = await fetchActivity(workId);
                setActivities(response.payload);
            } catch (error) {
                console.error("Error fetching activities:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkDetails();
        fetchActivities();

        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setShowJobDetails(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [workId]);

    const toggleEditForm = () => setShowEditForm(prevState => !prevState);
    const toggleEditSidebarForm = () => setShowEditActivityForm(prevState => !prevState);

    const handleActivityClick = async (activity) => {
        try {
            // Fetch details of the selected activity
            const response = await fetchAActivity(workId, activity.id);
            setSelectedActivity(response.payload); // Set the details of the selected activity
            setShowJobDetails(true); // Show the job details sidebar
            history.push(`/work/${workId}/${activity.id}`); // Push the activity ID to the URL
        } catch (error) {
            console.error("Error fetching activity:", error);
        }
    };

    // Utility function to convert camelCase to Capitalized words
    const convertCamelCaseToNormalCase = (camelCaseString) => {
        const normalizedString = camelCaseString.replace(/([A-Z])/g, ' $1'); // Replace capital letters with space followed by the letter
        return normalizedString.charAt(0).toUpperCase() + normalizedString.slice(1);
    };


    return (
        <div className='work-content-container'>
            <div className={`work-details-container ${showJobDetails ? 'small-width' : ''}`}>
                <Breadcrumb items={breadcrumbItems} style={{ marginLeft: '20px' }} />

                <div className="edit-button-container">
                    <button className="edit-button" onClick={toggleEditForm}>Edit</button>
                </div>

                {showEditForm && <EditWorkForm showEditWorkForm={showEditForm} setshowEditWorkForm={setShowEditForm} />}

                <div className='work-card'>
                    {/* Asset Details */}
                    {workDetails ? (
                        <div>
                            <p>CATER ID: {workDetails.workNumber} (TEC) </p>
                            <span className="tag">{workDetails.workType.title}</span>
                            <hr className="line" />

                            <div className="details-container">
                                <table className="aligned-table">
                                    <tbody>
                                        <tr>
                                            <td className="work-label">Title</td>
                                            <td>{workDetails.title}</td>
                                        </tr>
                                        <tr>
                                            <td className="work-label">Description</td>
                                            <td>{workDetails.description}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                    <hr className="line" />

                    {workDetails && (
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {/* First column with dark grey text */}
                            <div style={{ color: 'darkgrey', marginRight: '10px' }}>
                                <p id="attachments">
                                    <span style={{ marginRight: '10px' }}><FontAwesomeIcon icon={faBell} style={{ color: 'maroon' }} /></span>
                                    <span>Status</span>
                                </p>
                                <p id="location">
                                    <span style={{ marginRight: '10px' }}><FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'gold' }} /></span>
                                    <span>Area</span>
                                </p>
                                {workDetails.assignedTo && workDetails.assignedTo.length > 0 ? (
                                    <p id="assigned-to">
                                        <span style={{ marginRight: '10px' }}><FontAwesomeIcon icon={faUser} /></span>
                                        <span>Assigned To</span>
                                    </p>
                                ) : (
                                    <p id="assigned-to">
                                        <span style={{ marginRight: '10px' }}><FontAwesomeIcon icon={faUser} /></span>
                                        <span>Assigned To</span>
                                    </p>
                                )}
                            </div>
                            {/* Second column */}
                            <div>
                                <p id="attachments">{workDetails.currentStatus.status}</p>
                                {workDetails.location && (
                                    <p id="location">{workDetails.location.name} - {workDetails.location.locationManagerUserId}</p>
                                )}
                                {workDetails.assignedTo && workDetails.assignedTo.length > 0 ? (
                                    <p id="assigned-to">{workDetails.assignedTo[0]}</p>
                                ) : (
                                    <p id="assigned-to">Unassigned</p>
                                )}
                            </div>
                        </div>

                    )}
                    {workDetails && (
                        <div>
                            <hr className="line" />
                            <div className="container">
                                <div className="column left-column">
                                    {workDetails.customFields && workDetails.customFields.map(field => (
                                        <p key={field.id} className="work-label">{convertCamelCaseToNormalCase(field.name)}</p>
                                    ))}
                                </div>
                                <div className="column right-column">
                                    {workDetails.customFields && workDetails.customFields.map(field => (
                                        <p key={field.id}>
                                            {field.value && field.value.value}
                                        </p>
                                    ))}
                                </div>
                            </div>
                            <hr className="line" />
                        </div>
                    )}

                    <p id="attachments">Attachments</p>
                    <div className="file-upload-container">
                        <input type="file" id="file-input" multiple />
                        <label htmlFor="file-input">Drag and drop files here or click to upload</label>
                        <div className="uploaded-files">
                            {/* Display uploaded files here */}
                        </div>
                    </div><br></br>

                    <hr className="line" />
                    <p id="attachments">Emails Sent</p>
                    <p>Title:</p>
                    <p>Description: </p>

                    <hr className="line" />

                    {showJobDetails && (
                        // 
                        <div ref={sidebarRef} className={`sidebar-panel ${showJobDetails ? 'open' : ''}`}>
                            {/* Display job details here */}
                            <h1 style={{ fontSize: '18px' }}>Job Details</h1>
                            {selectedActivity && (
                                <>

                                    <div className="edit-button-container">
                                        <button className="edit-button" onClick={toggleEditSidebarForm}>Edit</button>
                                    </div>

                                    {showEditActivityForm && <EditActivityForm showEditActivityForm={showEditActivityForm} setShowEditActivityForm={setShowEditActivityForm} />}

                                    <div className='activity-card'>
                                        <div>
                                            <p>Task Details </p>
                                            {/* <div>
                                                <pre>{JSON.stringify(selectedActivity, null, 2)}</pre>
                                            </div> */}
                                            <hr className="line" />

                                            <div className="container">
                                                <table className="aligned-table">
                                                    <tbody>
                                                        <tr>
                                                            <td className="work-label">Status</td>
                                                            <td>{selectedActivity.currentStatus.status}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="work-label">Title</td>
                                                            <td>{selectedActivity.title}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="work-label">Description</td>
                                                            <td>{selectedActivity.description}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div>
                                                <hr className="line" />
                                                <div className="container">
                                                    <table className="aligned-table-customdetails">
                                                        <tbody>
                                                            {selectedActivity.customFields && selectedActivity.customFields.map(field => (
                                                                <tr key={field.id}>
                                                                    <td className="left-column">{convertCamelCaseToNormalCase(field.name)}</td>
                                                                    <td className="right-column">{field.value && field.value.value}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>


                                            </div>
                                        </div>

                                        <hr className="line" />
                                    </div>

                                </>
                            )}
                        </div>
                    )}

                    {workDetails && (
                        <div className="notes-container">
                            <div className="column">
                                <p>Created By: {workDetails.createdBy}</p>
                                <p>Created Date: {workDetails.createdDate}</p>
                            </div>
                            <div className="column">
                                <p>Modified By: {workDetails.lastModifiedBy}</p>
                                <p>Modified Date: {workDetails.lastModifiedDate}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="work-details-container2">
                {/* Status and Tasks section */}
                <div className="attachments-activity-container">


                    <div className='work-card'>
                        {/* <div className="attachments-section"> */}
                        <table className='work-table'>
                            <colgroup>
                                <col style={{ borderLeft: '1px solid black' }} />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <h3 id="attachments" style={{ marginLeft: "10px" }}>Tasks<span className="new-class-button" style={{ margin: '0' }}>
                                        <button onClick={() => setShowActivityForm(!showActivityForm)} className="task-button">
                                            {showActivityForm ? "Close Activity Form" : "+"}
                                        </button>
                                        {showActivityForm && (
                                            <ActivityForm
                                                showActivityForm={showActivityForm}
                                                setShowActivityForm={setShowActivityForm}
                                            />
                                        )}
                                    </span></h3>
                                </tr>
                                {activities.map(activity => (
                                    <tr key={activity.id} onClick={() => handleActivityClick(activity)}>
                                        <td className="activity-card" style={{ borderLeft: '3px solid rgba(144, 21, 21, 1)' }}>
                                            <div>
                                                <h4>{activity.activityType.title}</h4>
                                                {/* <p>Job: {activity.workNumber}</p> */}
                                                <p>Subtype: {activity.activityTypeSubtype}</p>
                                                <p>Description: {activity.description}</p>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* </div> */}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WorkDetails;
