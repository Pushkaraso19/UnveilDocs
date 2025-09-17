import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './DashboardSidebar.css';

const DashboardSidebar = ({ activeDocument, setActiveDocument, onDocumentUpload }) => {
  const [documents, setDocuments] = useState([
    { id: 1, name: "Comprehensive Auto Policy", active: true, type: "pdf", uploadDate: "2023-10-15" },
    { id: 2, name: "Homeowners Insurance Policy", active: false, type: "pdf", uploadDate: "2023-09-22" },
    { id: 3, name: "Life Insurance Plan Details", active: false, type: "docx", uploadDate: "2023-11-05" },
    { id: 4, name: "Umbrella Policy Addendum", active: false, type: "pdf", uploadDate: "2023-08-17" }
  ]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDocumentClick = (id) => {
    const updatedDocs = documents.map(doc => ({
      ...doc,
      active: doc.id === id
    }));
    setDocuments(updatedDocs);
    const selectedDoc = updatedDocs.find(doc => doc.id === id);
    setActiveDocument(selectedDoc);
  };

  const addNewDocument = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.docx';
    fileInput.multiple = true;
    
    fileInput.onchange = (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        setIsUploading(true);
        
        setTimeout(() => {
          const newFiles = Array.from(files).map((file, index) => ({
            id: documents.length + index + 1,
            name: file.name,
            active: false,
            type: file.name.split('.').pop(),
            uploadDate: new Date().toISOString().split('T')[0]
          }));
          
          setDocuments([...documents, ...newFiles]);
          setIsUploading(false);
          
          if (onDocumentUpload) {
            onDocumentUpload(newFiles);
          }
        }, 1500);
      }
    };
    
    fileInput.click();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar-header">
        <h2 className="dashboard-sidebar-title">Documents</h2>
        <button 
          className="dashboard-sidebar-add-btn"
          onClick={addNewDocument}
          disabled={isUploading}
        >
          {isUploading ? (
            <div className="sidebar-spinner"></div>
          ) : (
            <span className="material-symbols-outlined">add</span>
          )}
        </button>
      </div>
      
      <div className="dashboard-sidebar-actions">
        <Link to="/" className="dashboard-sidebar-home-link">
          <span className="material-symbols-outlined">home</span>
          <span>Back to Home</span>
        </Link>
      </div>
      
      <nav className="dashboard-sidebar-nav">
        {documents.map((doc) => (
          <div 
            key={doc.id}
            className={`dashboard-sidebar-doc-item ${doc.active ? 'active' : ''}`}
            onClick={() => handleDocumentClick(doc.id)}
          >
            <span className={`material-symbols-outlined dashboard-sidebar-doc-icon ${doc.active ? 'active' : ''}`}>
              description
            </span>
            <div className="dashboard-sidebar-doc-content">
              <p className="dashboard-sidebar-doc-name">{doc.name}</p>
              <p className="dashboard-sidebar-doc-meta">{formatDate(doc.uploadDate)} · {doc.type.toUpperCase()}</p>
            </div>
            <span className={`material-symbols-outlined dashboard-sidebar-doc-status ${doc.active ? 'active' : ''}`}>
              {doc.active ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span>
          </div>
        ))}
      </nav>
      
      <div className="dashboard-sidebar-footer">
        <a className="dashboard-sidebar-footer-item" href="#">
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </a>
        <a className="dashboard-sidebar-footer-item" href="#">
          <span className="material-symbols-outlined">history</span>
          <span>Recent Questions</span>
        </a>
        <a className="dashboard-sidebar-footer-item" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </a>
      </div>
    </aside>
  );
};

export default DashboardSidebar;