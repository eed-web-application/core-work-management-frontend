import React, { useState } from 'react';
import styles from './reportPage.module.css'; // Importing CSS module

const ReportPage = () => {
    const [formData, setFormData] = useState({
        // Classification
        ticketNumber: '1',
        domain: 'TEC',
        type: 'Software',
        subtype: 'Bug',
        relatedTickets: '',

        // Task Details
        urgency: 'High',
        status: 'Open',
        title: 'Application crashes when clicking on save',
        description: 'The application consistently crashes whenever the user tries to save data.',

        // Team & Area Information
        area: 'Development',
        areaMgr: 'John Smith',
        subsystem: 'Frontend',
        shopMain: 'SWE',
        shopAlt: 'CTL',
        group: 'DevOps',

        // Workflow & Approval
        wwDate: '',
        wwComment: '',
        createdBy: 'John Doe',
        createdDate: '2024-09-19',
        mgrDate: '',
        mgrComment: '',
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSave = () => {
        setIsEditing(false);
        alert('Ticket details have been saved.');
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>#{formData.ticketNumber}</h1>
                {!isEditing ? (
                    <button onClick={handleEdit} className={styles.editButton}>Edit</button>
                ) : (
                    <button onClick={handleSave} className={styles.saveButton}>Save</button>
                )}
            </header>

            {/* Subtitle section for domain, type, and subtype */}
            <div className={styles.subtitle}>
                <span className={styles.subtitleItem}>Domain <strong>{formData.domain}</strong></span>
                <span className={styles.subtitleItem}>Type <strong>{formData.type}</strong></span>
                <span className={styles.subtitleItem}>Subtype <strong>{formData.subtype}</strong></span>
            </div>

            {/* Main Grid Layout */}
            <div className={styles.mainGrid}>

                {/* 70% Section for Task Details */}
                <div className={styles.detailsSection}>
                    <div className={styles.ticketGrid70}>
                        <div className={styles.ticketField}>
                            <label htmlFor="urgency" className={styles.label}>Urgency</label>
                            <input
                                type="text"
                                id="urgency"
                                name="urgency"
                                value={formData.urgency}
                                onChange={handleChange}
                                className={styles.inputField}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className={styles.ticketField}>
                            <label htmlFor="status" className={styles.label}>Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={styles.selectField}
                                disabled={!isEditing}
                            >
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.ticketGridFull}>
                        <div className={styles.ticketField}>
                            <label htmlFor="wwDate" className={styles.label}>Watch & Wait Date</label>
                            <input
                                type="date"
                                id="wwDate"
                                name="wwDate"
                                value={formData.wwDate}
                                onChange={handleChange}
                                className={styles.inputField}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className={styles.ticketField}>
                            <label htmlFor="wwComment" className={styles.label}>Watch & Wait Comment</label>
                            <textarea
                                id="wwComment"
                                name="wwComment"
                                value={formData.wwComment}
                                onChange={handleChange}
                                className={styles.textareaField}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className={styles.ticketField}>
                            <label htmlFor="mgrDate" className={styles.label}>Manager Approval Date</label>
                            <input
                                type="date"
                                id="mgrDate"
                                name="mgrDate"
                                value={formData.mgrDate}
                                onChange={handleChange}
                                className={styles.inputField}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className={styles.ticketField}>
                            <label htmlFor="mgrComment" className={styles.label}>Manager Comment</label>
                            <textarea
                                id="mgrComment"
                                name="mgrComment"
                                value={formData.mgrComment}
                                onChange={handleChange}
                                className={styles.textareaField}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    <div className={styles.ticketGrid70}>
                        <div className={styles.ticketField}>
                            <label htmlFor="createdBy" className={styles.label}>Created By</label>
                            <input
                                type="text"
                                id="createdBy"
                                name="createdBy"
                                value={formData.createdBy}
                                className={styles.inputField}
                                disabled
                            />
                        </div>
                        <div className={styles.ticketField}>
                            <label htmlFor="createdDate" className={styles.label}>Created Date</label>
                            <input
                                type="date"
                                id="createdDate"
                                name="createdDate"
                                value={formData.createdDate}
                                className={styles.inputField}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                {/* 30% Section for Team & Area Information */}
                <div className={styles.teamSection}>
                    {/* <div className={styles.sectionTitle}>TEAM & AREA INFORMATION</div> */}
                    <div className={styles.ticketField}>
                        <label htmlFor="area" className={styles.label}>Area</label>
                        <input
                            type="text"
                            id="area"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            className={styles.inputField}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className={styles.ticketField}>
                        <label htmlFor="areaMgr" className={styles.label}>Area Manager</label>
                        <input
                            type="text"
                            id="areaMgr"
                            name="areaMgr"
                            value={formData.areaMgr}
                            onChange={handleChange}
                            className={styles.inputField}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className={styles.ticketField}>
                        <label htmlFor="subsystem" className={styles.label}>Subsystem</label>
                        <input
                            type="text"
                            id="subsystem"
                            name="subsystem"
                            value={formData.subsystem}
                            onChange={handleChange}
                            className={styles.inputField}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className={styles.ticketField}>
                        <label htmlFor="group" className={styles.label}>Group</label>
                        <input
                            type="text"
                            id="group"
                            name="group"
                            value={formData.group}
                            onChange={handleChange}
                            className={styles.inputField}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className={styles.ticketField}>
                        <label htmlFor="shop" className={styles.label}>Shop</label>
                        <input
                            type="text"
                            id="shop"
                            name="shop"
                            value={formData.shopMain}
                            onChange={handleChange}
                            className={styles.inputField}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                {/* 100% Section for Title and Description */}
                <div className={styles.fullWidthSection}>
                    <div className={styles.ticketField}>
                        <label htmlFor="title" className={styles.label}>Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={styles.inputField}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className={styles.ticketField}>
                        <label htmlFor="description" className={styles.label}>Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={styles.textareaField}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportPage;
