import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { fetchAllActivity, createBucket, fetchAllBucket, fetchBucketTypes, fetchBucketStatus } from '../../services/api';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './pmm.css';

function Pmm() {
    const [activeTab, setActiveTab] = useState('Current PMM');
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [description, setDescription] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [bucketTypes, setBucketTypes] = useState([]);
    const [bucketStatus, setBucketStatus] = useState([]);
    const [buckets, setBuckets] = useState([]);
    const [allJobsData, setAllJobsData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // useEffect(() => {
    //     if (activeTab === 'All Jobs') {
    //         fetchAllActivity()
    //             .then(data => {
    //                 setAllJobsData(data.payload);
    //             })
    //             .catch(error => {
    //                 console.error('Error fetching activities:', error);
    //             });
    //     }
    // }, [activeTab]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchBucketTypes();
                const status = await fetchBucketStatus();
                const bucket = await fetchAllBucket();
                setBuckets(bucket.payload);
                setBucketTypes(data.payload);
                setBucketStatus(status.payload);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const newSlot = {
            description: description,
            type: selectedType,
            status: selectedStatus,
            from: startDate ? startDate.toISOString() : null,
            to: endDate ? endDate.toISOString() : null
        };

        createBucket(newSlot)
            .then(response => {
                console.log('New slot created:', response);
                toast.success('New slot created successfully!');
                // Optionally, refresh the job list or handle UI updates here
                setStartDate(null);
                setEndDate(null);
                setDescription('');
                setSelectedType('');
                setShowModal(false);
            })
            .catch(error => {
                toast.error('Error creating new slot.');
                console.error('Error creating new slot:', error);
            });
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredJobs = allJobsData.filter(job =>
        job.description.includes(searchTerm) || job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Current PMM':
                return <div>Content for Current PMM</div>;
            case 'All Jobs':
                return (
                    <div className="all-jobs-content">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="search-input"
                            style={{width: "100%"}}
                        />
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((activity) => (
                                <div className="job-container" key={activity.id}>
                                    <div className="job-title">Activity Number: {activity.activityNumber}</div>
                                    <div className="job-description">Description: {activity.description}</div>
                                    <div className="job-number">Work Number: {activity.workNumber}</div>
                                </div>
                            ))
                        ) : (
                            <div>No jobs found</div>
                        )}
                    </div>
                
                );
            case 'My Jobs':
                return <div>Content for My Jobs</div>;
            case 'Archived Dates':
                return <div>Content for Archived Dates</div>;
            default:
                return null;
        }
    };

    return (
        <div className="pmm-page">
            <header className="page-header">
                <h1>Maintenance Manager</h1>
            </header>
            <div className="pmm-container">
                <aside className="sidebar">
                    <button className="create-slot-button" onClick={toggleModal}>
                        Create New Slot
                    </button>
                    <div className="info-box">
                        <p>This is some informational text.</p>
                    </div>
                </aside>
                <main className="main-section">
                    <div className="tables-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Upcoming Planned Machine Maintenances</th>
                                </tr>
                            </thead>
                            <tbody>
                                {buckets.map(bucket => (
                                    <tr key={bucket.id}>
                                        <td>
                                            {new Date(bucket.from).toLocaleDateString()}&nbsp;&nbsp;&nbsp;
                                            {new Date(bucket.to).toLocaleDateString()}&nbsp;&nbsp;&nbsp;
                                            {bucket.type.value}&nbsp;&nbsp;&nbsp;
                                            {bucket.status.value}&nbsp;&nbsp;&nbsp;
                                            {bucket.description}&nbsp;&nbsp;&nbsp;
                                            {bucket.date}
                                        </td>
                                    </tr>
                                ))}
                                {!buckets.length && (
                                    <tr>
                                        <td colSpan="5">No upcoming planned maintenances</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="tabs-container">
                        <div className="pmmtabs">
                            {['Current PMM', 'All Jobs', 'My Jobs', 'Archived Dates'].map(tab => (
                                <button
                                    key={tab}
                                    className={`pmmtab-button ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="tab-content">
                            {renderTabContent()}
                        </div>
                    </div>
                </main>
            </div>

            {showModal && (
                <div className="pmm-modal">
                    <div className="modal-content">
                        <span className="close" onClick={toggleModal}>&times;</span>
                        <h2>Add New Slot</h2>
                        <form onSubmit={handleFormSubmit}>
                            <label>
                                Start Date: 
                                <DatePicker
                                    selected={startDate}
                                    onChange={date => setStartDate(date)}
                                    dateFormat="MM/dd/yyyy"
                                    isClearable
                                    placeholderText="Select start date"
                                    className="date-picker"
                                    required
                                />
                            </label>
                            <label>
                                End Date: 
                                <DatePicker
                                    selected={endDate}
                                    onChange={date => setEndDate(date)}
                                    dateFormat="MM/dd/yyyy"
                                    isClearable
                                    placeholderText="Select end date"
                                    className="date-picker"
                                    required
                                />
                            </label>
                            <label>
                                Type:
                                <select 
                                    value={selectedType} 
                                    onChange={(e) => setSelectedType(e.target.value)} 
                                    className='pmm-form-input'
                                    required
                                >
                                    <option value="">Select type</option>
                                    {bucketTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.value}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Status:
                                <select 
                                    value={selectedStatus} 
                                    onChange={(e) => setSelectedStatus(e.target.value)} 
                                    className='pmm-form-input'
                                    required
                                >
                                    <option value="">Select Status</option>
                                    {bucketStatus.map((type) => (
                                        <option key={type.id} value={type.id}>{type.value}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </label>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Pmm;
