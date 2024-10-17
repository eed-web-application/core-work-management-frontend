import React, { useState } from 'react';
import { addAttachment, previewAttachment, downloadAttachment } from './api'; // Import your API functions

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [attachmentId, setAttachmentId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [token, setToken] = useState(null); // Optionally you can set token here.

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload the file
  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('uploadFile', file); // Key should match your API's requirement

      try {
        const response = await addAttachment(formData, token); // Assuming 'addAttachment' sends the file to the server
        if (response.errorCode === 0) {
          alert('File uploaded successfully');
          setAttachmentId(response.payload); // Store the attachmentId for preview and download
        } else {
          alert(`Error: ${response.errorMessage}`);
        }
      } catch (error) {
        console.error('Error uploading file:', error.message);
      }
    }
  };

  // Preview the file
  const handlePreview = async () => {
    if (attachmentId) {
      try {
        const previewUrl = `/api/cwm/v1/${attachmentId}/preview.jpg`; // Direct preview URL
        setPreviewUrl(previewUrl);
      } catch (error) {
        console.error('Error previewing file:', error.message);
      }
    }
  };

  // Download the file
  const handleDownload = async () => {
    if (attachmentId) {
      try {
        const response = await downloadAttachment(attachmentId, token); // Call the download function
        // Handle download logic (e.g., show download link or trigger download)
        const blob = new Blob([response], { type: 'application/octet-stream' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `${attachmentId}.jpg`; // Customize filename
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } catch (error) {
        console.error('Error downloading file:', error.message);
      }
    }
  };

  return (
    <div>
      <h1>Upload and Manage Attachments</h1>

      {/* Upload Form */}
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>

      {/* Preview Section */}
      {attachmentId && <button onClick={handlePreview}>Preview Attachment</button>}
      {previewUrl && <img src={previewUrl} alt="Preview" />}

      {/* Download Section */}
      {attachmentId && <button onClick={handleDownload}>Download Attachment</button>}
    </div>
  );
};

export default FileUpload;
