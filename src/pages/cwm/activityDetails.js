import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link from react-router-dom
import { fetchAWork, fetchAActivity } from "../../services/api";
import EditActivityForm from './editActivityForm';
import Breadcrumb from '../../components/Breadcrumb';
import './activityDetails.css';

const ActivityDetails = () => {
    const { workId, activityId } = useParams(); // Get the asset ID from the URL params
    const [loading, setLoading] = useState(true);
    const [showEditActivityForm, setshowEditActivityForm] = useState(false);
    const [work, setWork] = useState(null);
    const [oneActivity, setOneActivity] = useState([]);

    const breadcrumbItems = [
        { label: 'Home', link: '/' },
        { label: 'Work', link: '/cwm/search' },
        { label: 'Work Details', link: `/cwm/${workId}` },
        { label: 'Activity Details', link: `/cwm/${workId}/${activityId}` },
    ];

    // Fetch element path data on component mount
    const fetchData = async () => {
        try {
            const workResponse = await fetchAWork(workId);
            setWork(workResponse.payload);
            const activityResponse = await fetchAActivity(workId, activityId);
            setOneActivity(activityResponse.payload);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [workId, activityId]);

    const toggleEditForm = () => {
        setshowEditActivityForm(prevState => !prevState);
    };

    const renderWorkDetails = (work) => {
        return (
            <>
                <tr><td className="work-label">Status</td><td>{work.title}</td></tr>
                <tr><td className="work-label">Assigned To</td><td>{work.workType.title}</td></tr>
                <tr><td className="work-label">Work Type</td><td>{work.location.name}</td></tr>
                <tr><td className="work-label">Scheduling Priority</td><td>{work.shopGroup.name}</td></tr>
            </>
        );
    };


    return (
        <div className='activity-content-container'>

            <div className="activity-details-container">
                <Breadcrumb items={breadcrumbItems} style={{ marginLeft: '20px' }} />

                <div className="edit-button-container">
                    <button className="edit-button" onClick={toggleEditForm}>Edit</button>
                </div>

                {showEditActivityForm && <EditActivityForm showEditActivityForm={showEditActivityForm} setshowEditActivityForm={setshowEditActivityForm} />}

                {oneActivity && ( // Conditionally render EditActivityForm
                    <EditActivityForm
                        showEditActivityForm={showEditActivityForm}
                        setshowEditActivityForm={setshowEditActivityForm}
                        workId={workId}
                        activityId={activityId}
                        activityData={oneActivity} // Pass the fetched activity data
                    />
                )}

                <div className='work-card'>
                    {/* Asset Details */}
                    {work && (
                    <div className='work-card'>
                        <p>Work Summary </p>
                        <hr className="line" />
                        <div className="container">
                            <table>
                                <tbody>
                                    {renderWorkDetails(work)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <div className='work-card'>
                {/* Asset Details */}
                {work && (
                    <div>
                        <p>Activity Summary </p>
                        <hr className="line" />
                        <div>
                            <div className="container">
                                <div className="column left-column">
                                    <p className="work-label">Status</p>
                                    <p className="work-label">Assigned To</p>
                                    <p className="work-label">Work Type</p>
                                    <p className="work-label">Scheduling Priority</p>
                                </div>
                                <div className="column right-column">
                                    <p>{work.title}</p>
                                    <p>{work.workType.title}</p>
                                    <p>{work.location.name}</p>
                                    <p>{work.shopGroup.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className='work-card'>
                {/* Asset Details */}
                {work && (
                    <div>
                        <p>Work Release Conditions </p>
                        <hr className="line" />

                        <div className="container">
                            <div className="column left-column">
                                <p className="work-label">Title</p>
                                <p className="work-label">Description</p>
                            </div>
                            <div className="column right-column">
                                <p>{work.title}</p>
                                <p>{work.description}</p>
                            </div>
                        </div>

                        <div>
                            <hr className="line" />
                            <div className="container">
                                <div className="column left-column">
                                    <p className="work-label">Type</p>
                                    <p className="work-label">Subtype</p>
                                    <p className="work-label">Area</p>
                                    <p className="work-label">Area Manager</p>
                                    <p className="work-label">Shop</p>
                                </div>
                                <div className="column right-column">
                                    <p>{work.title}</p>
                                    <p>{work.workType.title}</p>
                                    <p>{work.location.name}</p>
                                    <p>User1, User1 </p>
                                    <p>{work.shopGroup.name}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
                <hr className="line" />
            </div>
        </div>

        </div >
    );
};

export default ActivityDetails;
