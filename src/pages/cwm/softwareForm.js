import React, { useState } from 'react';
import styles from './softwareForm.module.css'; // Import CSS module

function SoftwareForm() {
  // State for all the form fields
  const [formData, setFormData] = useState({
    ticketNumber: '1',
    domain: 'TEC',
    title: '',
    description: '',
    status: '',
    relatedTickets: '',
    type: '',
    subtype: '',
    urgency: '',
    area: '',
    areaMgr: '',
    subsystem: '',
    shopMain: '',
    shopAlt: '',
    group: '',
    assignedTo: '',
    wwDate: '',
    wwComment: '',
    createdBy: '',
    createdDate: '',
    mgrDate: '',
    mgrComment: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // You would send the formData to your server or API here
  };

  return (
    <form onSubmit={handleSubmit} className={styles.softwareForm}>

<fieldset className={styles.formSection}>
  <legend className={styles.legend}>Task Information</legend>
  
  <div className={styles.formGroupGrid}>
    <div className={styles.formGroup}>
      <label htmlFor="taskTitle" className={styles.label}>Task Title *</label>
      <input
        type="text"
        id="taskTitle"
        name="taskTitle"
        value={formData.taskTitle}
        onChange={handleChange}
        required
        className={styles.input}
      />
    </div>
  
    <div className={styles.formGroup}>
      <label htmlFor="jobNumber" className={styles.label}>Job Number</label>
      <input
        type="text"
        id="jobNumber"
        name="jobNumber"
        value={formData.jobNumber}
        onChange={handleChange}
        className={styles.input}
      />
    </div>
  
    <div className={styles.formGroup}>
      <label htmlFor="status" className={styles.label}>Status *</label>
      <select
        id="status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
        className={styles.select}
      >
        <option value="">Select Status</option>
        <option value="new">New</option>
        <option value="inProgress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  
    <div className={styles.formGroup}>
      <label htmlFor="description" className={styles.label}>Description *</label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        className={styles.textarea}
      ></textarea>
    </div>
  </div>
</fieldset>

<fieldset className={styles.formSection}>
  <legend className={styles.legend}>Resource and Team</legend>
  
  <div className={styles.formGroupGrid}>
    <div className={styles.formGroup}>
      <label htmlFor="resource" className={styles.label}>Resource *</label>
      <input
        type="text"
        id="resource"
        name="resource"
        value={formData.resource}
        onChange={handleChange}
        required
        className={styles.input}
      />
    </div>
    
    <div className={styles.formGroup}>
      <label htmlFor="group" className={styles.label}>Group *</label>
      <input
        type="text"
        id="group"
        name="group"
        value={formData.group}
        onChange={handleChange}
        required
        className={styles.input}
      />
    </div>

    {/* Add more fields in the same grid format */}
  </div>
</fieldset>

      
      {/* 1. Requestor Information */}
      {/* <fieldset className={styles.formSection}>
        <legend className={styles.legend}>Requestor Information</legend>
        <div className={styles.formGroup}>
          <label htmlFor="createdBy" className={styles.label}>Created By (Auto-filled)</label>
          <input type="text" id="createdBy" name="createdBy" disabled className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="createdDate" className={styles.label}>Created Date (Auto-filled)</label>
          <input type="text" id="createdDate" name="createdDate" disabled className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="modifiedBy" className={styles.label}>Modified By (Auto-filled)</label>
          <input type="text" id="modifiedBy" name="modifiedBy" disabled className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="modifiedDate" className={styles.label}>Modified Date (Auto-filled)</label>
          <input type="text" id="modifiedDate" name="modifiedDate" disabled className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="areaManagerModifiedDate" className={styles.label}>Area Manager and Admin Modified Date (Auto-filled)</label>
          <input type="text" id="areaManagerModifiedDate" name="areaManagerModifiedDate" disabled className={styles.input} />
        </div>
      </fieldset> */}

      {/* 2. Task Information */}
      <fieldset className={styles.formSection}>
        <legend className={styles.legend}>Task Information</legend>

        <div className={styles.formGroup}>
          <label htmlFor="taskTitle" className={styles.label}>Task Title *</label>
          <input
            type="text"
            id="taskTitle"
            name="taskTitle"
            value={formData.taskTitle}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="jobNumber" className={styles.label}>Job Number</label>
          <input
            type="text"
            id="jobNumber"
            name="jobNumber"
            value={formData.jobNumber}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status" className={styles.label}>Status *</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="">Select Status</option>
            <option value="new">New</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className={styles.textarea}
          ></textarea>
        </div>
      </fieldset>

      {/* 3. Resource and Team */}
      <fieldset className={styles.formSection}>
        <legend className={styles.legend}>Resource and Team</legend>

        <div className={styles.formGroup}>
          <label htmlFor="resource" className={styles.label}>Resource *</label>
          <input
            type="text"
            id="resource"
            name="resource"
            value={formData.resource}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="group" className={styles.label}>Group *</label>
          <input
            type="text"
            id="group"
            name="group"
            value={formData.group}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="subsystem" className={styles.label}>Subsystem</label>
          <input
            type="text"
            id="subsystem"
            name="subsystem"
            value={formData.subsystem}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="shopMain" className={styles.label}>Shop Main *</label>
          <input
            type="text"
            id="shopMain"
            name="shopMain"
            value={formData.shopMain}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="shopAlt" className={styles.label}>Shop Alt</label>
          <input
            type="text"
            id="shopAlt"
            name="shopAlt"
            value={formData.shopAlt}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="area" className={styles.label}>Area *</label>
          <input
            type="text"
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="areaManager" className={styles.label}>Area Manager *</label>
          <input
            type="text"
            id="areaManager"
            name="areaManager"
            value={formData.areaManager}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
      </fieldset>

      {/* 4. Timing and Scheduling */}
      <fieldset className={styles.formSection}>
        <legend className={styles.legend}>Timing and Scheduling</legend>

        <div className={styles.formGroup}>
          <label htmlFor="timeNeeded" className={styles.label}>Time Needed *</label>
          <input
            type="number"
            id="timeNeeded"
            name="timeNeeded"
            value={formData.timeNeeded}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="timeComment" className={styles.label}>Time Comment</label>
          <input
            type="text"
            id="timeComment"
            name="timeComment"
            value={formData.timeComment}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="plannedStart" className={styles.label}>Planned Start Date & Time *</label>
          <input
            type="datetime-local"
            id="plannedStart"
            name="plannedStart"
            value={formData.plannedStart}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="plannedStop" className={styles.label}>Planned Stop Date & Time *</label>
          <input
            type="datetime-local"
            id="plannedStop"
            name="plannedStop"
            value={formData.plannedStop}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="pmmDate" className={styles.label}>PMM Date</label>
          <input
            type="date"
            id="pmmDate"
            name="pmmDate"
            value={formData.pmmDate}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="schedulingPriority" className={styles.label}>Scheduling Priority *</label>
          <select
            id="schedulingPriority"
            name="schedulingPriority"
            value={formData.schedulingPriority}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </fieldset>

      {/* 5. Technical Requirements */}
      <fieldset className={styles.formSection}>
        <legend className={styles.legend}>Technical Requirements</legend>

        <div className={styles.formGroup}>
          <label htmlFor="systemsRequired" className={styles.label}>Systems Required *</label>
          <input
            type="text"
            id="systemsRequired"
            name="systemsRequired"
            value={formData.systemsRequired}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="systemsAffected" className={styles.label}>Systems Affected *</label>
          <input
            type="text"
            id="systemsAffected"
            name="systemsAffected"
            value={formData.systemsAffected}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="accessRequirements" className={styles.label}>Access Requirements</label>
          <input
            type="text"
            id="accessRequirements"
            name="accessRequirements"
            value={formData.accessRequirements}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="beamRequirements" className={styles.label}>Beam Requirements</label>
          <input
            type="text"
            id="beamRequirements"
            name="beamRequirements"
            value={formData.beamRequirements}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="beamComment" className={styles.label}>Beam Comment</label>
          <input
            type="text"
            id="beamComment"
            name="beamComment"
            value={formData.beamComment}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
      </fieldset>

      {/* 6. Risk and Contingency Planning */}
      <fieldset className={styles.formSection}>
        <legend className={styles.legend}>Risk and Contingency Planning</legend>

        <div className={styles.formGroup}>
          <label htmlFor="riskBenefit" className={styles.label}>Risk/Benefit *</label>
          <textarea
            id="riskBenefit"
            name="riskBenefit"
            value={formData.riskBenefit}
            onChange={handleChange}
            required
            className={styles.textarea}
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="dependencies" className={styles.label}>Dependencies *</label>
          <textarea
            id="dependencies"
            name="dependencies"
            value={formData.dependencies}
            onChange={handleChange}
            required
            className={styles.textarea}
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="backoutPlan" className={styles.label}>Backout Plan *</label>
          <textarea
            id="backoutPlan"
            name="backoutPlan"
            value={formData.backoutPlan}
            onChange={handleChange}
            required
            className={styles.textarea}
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="testPlan" className={styles.label}>Test Plan *</label>
          <textarea
            id="testPlan"
            name="testPlan"
            value={formData.testPlan}
            onChange={handleChange}
            required
            className={styles.textarea}
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="releaseConditions" className={styles.label}>Release Conditions</label>
          <input
            type="text"
            id="releaseConditions"
            name="releaseConditions"
            value={formData.releaseConditions}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
      </fieldset>

      {/* 7. Additional Information */}
      <fieldset className={styles.formSection}>
        <legend className={styles.legend}>Additional Information</legend>

        <div className={styles.formGroup}>
          <label htmlFor="invasive" className={styles.label}>Invasive *</label>
          <select
            id="invasive"
            name="invasive"
            value={formData.invasive}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="">Select Invasive Status</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="invasiveComment" className={styles.label}>Invasive Comment</label>
          <input
            type="text"
            id="invasiveComment"
            name="invasiveComment"
            value={formData.invasiveComment}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="workType" className={styles.label}>Work Type</label>
          <input
            type="text"
            id="workType"
            name="workType"
            value={formData.workType}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="comments" className={styles.label}>Comments</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            className={styles.textarea}
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="attachments" className={styles.label}>Attachments and Files</label>
          <input
            type="file"
            id="attachments"
            name="attachments"
            onChange={handleChange}
            className={styles.fileInput}
          />
        </div>
      </fieldset>

      {/* 8. Change/Review Process */}
      <fieldset className={styles.formSection}>
        <legend className={styles.legend}>Change/Review Process</legend>

        <div className={styles.formGroup}>
          <label htmlFor="cdReviewDate" className={styles.label}>CD Review Date</label>
          <input
            type="date"
            id="cdReviewDate"
            name="cdReviewDate"
            value={formData.cdReviewDate}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="cdComments" className={styles.label}>CD Comments</label>
          <textarea
            id="cdComments"
            name="cdComments"
            value={formData.cdComments}
            onChange={handleChange}
            className={styles.textarea}
          ></textarea>
        </div>
      </fieldset>

      {/* 9. Submit */}
      <div className={styles.formGroup}>
        <button type="submit" className={styles.submitButton}>Submit Request</button>
      </div>
    </form>
  );
}

export default SoftwareForm;

