import React from 'react';
import './PersonalDetailsConfirmationPage.css';

const ConfirmationPage = ({ formData, onBack, onSubmit }) => {
  const applicationData = {
    firstName: formData.firstName || "Hamilton",
    lastName: formData.lastName || "b",
    gender: formData.gender || "Male",
    dateOfBirth: formData.birthYear && formData.birthMonth && formData.birthDay 
      ? `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`
      : "2001-12-22",
    hasNationalId: formData.hasNationalId || "Yes",
    passportNumber: "",
    country: "SOUTH AFRICA",
    nationalId: formData.nationalId || "0112225529083",
    previousStudentNumber: formData.previousStudentNumber || "",
    studiedBefore: formData.studiedBefore || "Yes",
    highSchoolYear: formData.highSchoolYear || "2021",
    email: formData.email || "masipahamilton6@gmail.com",
    phone: formData.phone || "+27729242639",
    applicationId: `XING-APP-2024-${Math.floor(10000 + Math.random() * 90000)}`,
    submissionDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    submissionTime: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  const handleContinue = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <div className="header-icon">
            <i className="fas fa-clipboard-check"></i>
          </div>
          <div className="header-content">
            <h1>Application Detail Confirmation</h1>
            <p className="subtitle">
              Review your details before proceeding to the enrolment form
            </p>
          </div>
          <div className="application-badge">
            <span className="badge">Step 1: Pre-Application</span>
          </div>
        </div>

        <div className="instructions-section">
          <div className="instruction">
            <i className="fas fa-edit"></i>
            <p>If you want to change anything, go back to the previous step using the Back button</p>
          </div>
          <div className="instruction">
            <i className="fas fa-arrow-right"></i>
            <p>Click the Continue button to proceed to the enrolment form</p>
          </div>
        </div>

        <div className="application-summary">
          <div className="summary-header">
            <h2>Application Summary</h2>
            <div className="summary-meta">
              <span className="app-id">ID: {applicationData.applicationId}</span>
              <span className="submission-date">
                {applicationData.submissionDate} at {applicationData.submissionTime}
              </span>
            </div>
          </div>

          <div className="summary-grid">
            <SummaryCard 
              title="Application Status"
              status="Ready for Enrolment"
              type="status"
            />
            <SummaryCard 
              title="Next Step"
              status="Complete Enrolment Form"
              type="documents"
            />
            <SummaryCard 
              title="Progress"
              status="Step 1 of 2"
              type="fee"
            />
          </div>
        </div>

        <DetailSection 
          title="Biographical Detail"
          icon="fas fa-user"
          data={[
            { label: "First name(s)", value: applicationData.firstName },
            { label: "Last/Family name", value: applicationData.lastName },
            { label: "Gender", value: applicationData.gender },
            { label: "Date of birth", value: formatDate(applicationData.dateOfBirth) },
            { label: "Has a valid South African National ID number", value: applicationData.hasNationalId },
            { label: "Passport number", value: applicationData.passportNumber || "Not provided" },
            { label: "Country of residence", value: applicationData.country },
            { label: "National ID number", value: applicationData.nationalId },
            { label: "Previous Xinghalana student number", value: applicationData.previousStudentNumber || "Not provided" },
            { label: "Have you studied at a Tertiary Institution before?", value: applicationData.studiedBefore },
            { label: "Last year of High School (YYYY)", value: applicationData.highSchoolYear }
          ]}
        />

        <DetailSection 
          title="Contact detail"
          icon="fas fa-address-book"
          data={[
            { label: "Email address", value: applicationData.email },
            { label: "Cellular/mobile phone number", value: applicationData.phone }
          ]}
        />

        <div className="important-notes">
          <h3>
            <i className="fas fa-exclamation-circle"></i>
            Important Information
          </h3>
          <div className="notes-grid">
            <div className="note-item">
              <i className="fas fa-info-circle"></i>
              <div>
                <h4>Next Step: Enrolment Form</h4>
                <p>You will now proceed to complete the detailed enrolment form with additional information</p>
              </div>
            </div>
            <div className="note-item">
              <i className="fas fa-clock"></i>
              <div>
                <h4>Time Required</h4>
                <p>The enrolment form will take approximately 10-15 minutes to complete</p>
              </div>
            </div>
            <div className="note-item">
              <i className="fas fa-file-alt"></i>
              <div>
                <h4>Information Needed</h4>
                <p>Have your address details and next of kin information ready</p>
              </div>
            </div>
            <div className="note-item">
              <i className="fas fa-phone"></i>
              <div>
                <h4>Need Help?</h4>
                <p>Contact admissions at +27 (0)31 260 1111 or enquiries@xinghalana.ac.za</p>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button onClick={onBack} className="btn btn-back">
            <i className="fas fa-arrow-left"></i>
            Back to Application
          </button>
          <div className="primary-actions">
            <button onClick={() => window.print()} className="btn btn-secondary">
              <i className="fas fa-print"></i>
              Print Summary
            </button>
            <button onClick={handleContinue} className="btn btn-primary">
              Continue to Enrolment
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <div className="footer-note">
          <i className="fas fa-shield-alt"></i>
          <p>
            Your information is secure and protected. Xinghalana complies with the Protection of Personal Information Act (POPIA).
            <a href="#"> View our privacy policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

const DetailSection = ({ title, icon, data }) => (
  <div className="detail-section">
    <div className="section-header">
      <i className={icon}></i>
      <h2>{title}</h2>
    </div>
    <div className="detail-grid">
      {data.map((item, index) => (
        <DetailItem 
          key={index}
          label={item.label}
          value={item.value}
          isEmpty={!item.value || item.value === "Not provided"}
        />
      ))}
    </div>
  </div>
);

const DetailItem = ({ label, value, isEmpty }) => (
  <div className={`detail-item ${isEmpty ? 'empty' : ''}`}>
    <label>{label}</label>
    <span className="value">{value}</span>
  </div>
);

const SummaryCard = ({ title, status, type }) => (
  <div className={`summary-card ${type}`}>
    <h3>{title}</h3>
    <div className="status-indicator">
      {type === 'status' && <i className="fas fa-check-circle"></i>}
      {type === 'documents' && <i className="fas fa-arrow-right"></i>}
      {type === 'fee' && <i className="fas fa-list-ol"></i>}
      <span>{status}</span>
    </div>
  </div>
);

const formatDate = (dateString) => {
  if (!dateString) return 'Not provided';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default ConfirmationPage;