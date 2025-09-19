import React, { useState } from 'react';
import './ReuploadConfirmModal.css';

const ReuploadConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    const [step, setStep] = useState(1);

    const handleFirstConfirm = () => {
        onConfirm();
        handleClose();
    };

    const handleClose = () => {
        setStep(1);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Confirm Reupload</h3>
                    <button className="modal-close-btn" onClick={handleClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="modal-body">
                    <div className="modal-icon warning">
                        <span className="material-symbols-outlined">warning</span>
                    </div>
                    <p><strong>Are you sure you want to reupload a new file?</strong></p>
                    <p className="modal-warning-text">
                        This will remove the current file and any analysis progress. This action cannot be undone.
                    </p>
                </div>
                
                <div className="modal-actions">
                    <button className="modal-btn modal-btn-cancel" onClick={handleClose}>
                        Cancel
                    </button>
                    <button className="modal-btn modal-btn-danger" onClick={handleFirstConfirm}>
                        Yes, Reupload
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReuploadConfirmModal;
