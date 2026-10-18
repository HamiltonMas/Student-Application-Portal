import React, { useState } from 'react';
import styles from './ReviewConfirmPage.module.css';

const ReviewConfirmPage = ({ applicationData, onBack, onSubmit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [formData, setFormData] = useState(applicationData);

  // Sections data structure
  const sections = [
    {
      id: 'personal',
      title: 'Personal Details',
      icon: 'fas fa-user',
      fields: [
        { label: 'First Name', value: formData.firstName, path: 'firstName' },
        { label: 'Last Name', value: formData.lastName, path: 'lastName' },
        { label: 'Gender', value: formData.gender, path: 'gender' },
        { label: 'Date of Birth', value: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`, path: 'birth' },
        { label: 'National ID', value: formData.nationalId, path: 'nationalId' },
        { label: 'Email', value: formData.email, path: 'email' },
        { label: 'Phone', value: formData.phone, path: 'phone' }
      ]
    },
    {
      id: 'enrolment',
      title: 'Enrolment Information',
      icon: 'fas fa-address-card',
      fields: [
        { label: 'Title', value: formData.title, path: 'title' },
        { label: 'Initials', value: formData.initials, path: 'initials' },
        { label: 'Preferred Name', value: formData.preferredName, path: 'preferredName' },
        { label: 'Marital Status', value: formData.maritalStatus, path: 'maritalStatus' },
        { label: 'Home Language', value: formData.homeLanguage, path: 'homeLanguage' },
        { label: 'Ethnic Group', value: formData.ethnicGroup, path: 'ethnicGroup' },
        { label: 'Postal Address', value: formData.postalAddress, path: 'postalAddress' },
        { label: 'Postal Code', value: formData.postalCode, path: 'postalCode' }
      ]
    },
    {
      id: 'education',
      title: 'Educational Background',
      icon: 'fas fa-graduation-cap',
      fields: [
        { label: 'High School Year', value: formData.highSchoolYear, path: 'highSchoolYear' },
        { label: 'School Leaving Status', value: formData.schoolLeavingStatus, path: 'schoolLeavingStatus' },
        { label: 'Most Recent School', value: formData.mostRecentHighSchool, path: 'mostRecentHighSchool' },
        { label: 'Exam Number', value: formData.examNumber, path: 'examNumber' },
        { label: 'Completion Year', value: formData.completionYear, path: 'completionYear' }
      ]
    },
    {
      id: 'course',
      title: 'Course Selection',
      icon: 'fas fa-book',
      fields: [
        { label: 'Faculty', value: formData.facultyName, path: 'faculty' },
        { label: 'Mode of Study', value: formData.modeOfStudy, path: 'modeOfStudy' },
        { label: 'Intake Year', value: formData.intakeYear, path: 'intakeYear' },
        { label: 'Intake Semester', value: formData.intakeSemester, path: 'intakeSemester' },
        { label: 'First Choice', value: formData.firstChoiceCourseDetails?.name, path: 'firstChoice' },
        { label: 'Second Choice', value: formData.secondChoiceCourseDetails?.name, path: 'secondChoice' },
        { label: 'Third Choice', value: formData.thirdChoiceCourseDetails?.name, path: 'thirdChoice' }
      ]
    },
    {
      id: 'academic',
      title: 'Academic History',
      icon: 'fas fa-file-alt',
      fields: [
        { label: 'Matric Year', value: formData.matricYear, path: 'matricYear' },
        { label: 'Exam Number', value: formData.examNumber, path: 'academicExamNumber' },
        { label: 'Subjects Completed', value: `${formData.matricSubjects?.filter(s => s.subject && s.grade).length || 0} subjects`, path: 'subjects' }
      ]
    },
    {
      id: 'documents',
      title: 'Uploaded Documents',
      icon: 'fas fa-paperclip',
      fields: [
        { label: 'ID Document', value: formData.idDocument ? 'Uploaded' : 'Not uploaded', path: 'idDocument' },
        { label: 'Matric Documents', value: `${formData.uploadedDocuments?.length || 0} files`, path: 'matricDocuments' },
        { label: 'Tertiary Documents', value: `${formData.tertiaryQualifications?.reduce((acc, qual) => acc + qual.uploadedDocuments.length, 0) || 0} files`, path: 'tertiaryDocuments' }
      ]
    }
  ];

  const handleEditSection = (sectionId) => {
    setIsEditing(true);
    setCurrentSection(sectionId);
  };

  const handleSaveSection = () => {
    setIsEditing(false);
    setCurrentSection(null);
    // In a real app, you would save the changes to your state or backend
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentSection(null);
    // Reset form data to original
    setFormData(applicationData);
  };

  const handleFieldChange = (path, value) => {
    // This is a simplified version - in a real app you'd handle nested paths
    setFormData(prev => ({
      ...prev,
      [path]: value
    }));
  };

  const handleSubmit = () => {
    // Validate all required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 
      'facultyName', 'firstChoiceCourseDetails'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      alert('Please complete all required fields before submitting.');
      return;
    }

    onSubmit(formData);
  };

  const getCompletionPercentage = () => {
    const totalFields = sections.reduce((acc, section) => acc + section.fields.length, 0);
    const completedFields = sections.reduce((acc, section) => 
      acc + section.fields.filter(field => field.value && field.value !== '').length, 0
    );
    return Math.round((completedFields / totalFields) * 100);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <i className="fas fa-clipboard-check"></i>
          </div>
          <div className={styles.headerContent}>
            <h1>Review & Confirm Your Application</h1>
            <p className={styles.subtitle}>
              Please review all your information before submitting your application
            </p>
            <div className={styles.applicantInfo}>
              <div className={styles.infoItem}>
                <strong>Applicant:</strong> {formData.firstName} {formData.lastName}
              </div>
              <div className={styles.infoItem}>
                <strong>Application ID:</strong> {formData.applicationId || `XING-APP-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`}
              </div>
              <div className={styles.infoItem}>
                <strong>Completion:</strong> {getCompletionPercentage()}%
              </div>
            </div>
          </div>
          <div className={styles.applicationBadge}>
            <span className={styles.badge}>Final Step: Review & Submit</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <h3>Application Progress</h3>
            <span className={styles.progressPercentage}>{getCompletionPercentage()}% Complete</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
          <div className={styles.progressSteps}>
            {['Personal', 'Enrolment', 'Course', 'Academic', 'Review'].map((step, index) => (
              <div key={step} className={styles.progressStep}>
                <div className={`${styles.stepDot} ${getCompletionPercentage() >= (index + 1) * 20 ? styles.completed : ''}`}>
                  {index + 1}
                </div>
                <span className={styles.stepLabel}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Application Summary */}
        <div className={styles.summarySection}>
          <div className={styles.summaryHeader}>
            <h2>Application Summary</h2>
            <div className={styles.summaryStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{sections.length}</span>
                <span className={styles.statLabel}>Sections</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {sections.reduce((acc, section) => acc + section.fields.filter(f => f.value).length, 0)}
                </span>
                <span className={styles.statLabel}>Fields Completed</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {formData.uploadedDocuments?.length + (formData.idDocument ? 1 : 0) || 0}
                </span>
                <span className={styles.statLabel}>Documents</span>
              </div>
            </div>
          </div>
        </div>

        {/* Review Sections */}
        <div className={styles.reviewSections}>
          {sections.map(section => (
            <ReviewSection
              key={section.id}
              section={section}
              isEditing={isEditing && currentSection === section.id}
              onEdit={() => handleEditSection(section.id)}
              onSave={handleSaveSection}
              onCancel={handleCancelEdit}
              onFieldChange={handleFieldChange}
            />
          ))}
        </div>

        {/* Important Notes */}
        <div className={styles.importantNotes}>
          <h3>
            <i className="fas fa-exclamation-circle"></i>
            Before You Submit
          </h3>
          <div className={styles.notesGrid}>
            <div className={styles.noteItem}>
              <i className="fas fa-check-circle"></i>
              <div>
                <h4>Verify All Information</h4>
                <p>Ensure all personal details, course selections, and academic information are accurate</p>
              </div>
            </div>
            <div className={styles.noteItem}>
              <i className="fas fa-file-contract"></i>
              <div>
                <h4>Application Agreement</h4>
                <p>By submitting, you agree to the terms and conditions of application</p>
              </div>
            </div>
            <div className={styles.noteItem}>
              <i className="fas fa-envelope"></i>
              <div>
                <h4>Confirmation Email</h4>
                <p>You will receive a confirmation email with your application details</p>
              </div>
            </div>
            <div className={styles.noteItem}>
              <i className="fas fa-edit"></i>
              <div>
                <h4>Editing After Submission</h4>
                <p>Contact admissions office for any changes after submission</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button 
            type="button" 
            onClick={onBack}
            className={`${styles.btn} ${styles.btnBack}`}
          >
            <i className="fas fa-arrow-left"></i>
            Back to Academic History
          </button>
          
          <div className={styles.primaryActions}>
            <button 
              type="button" 
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => window.print()}
            >
              <i className="fas fa-print"></i>
              Print Application
            </button>
            <button 
              type="button" 
              onClick={handleSubmit}
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={getCompletionPercentage() < 90}
            >
              <i className="fas fa-paper-plane"></i>
              Submit Application
            </button>
          </div>
        </div>

        {getCompletionPercentage() < 90 && (
          <div className={styles.completionWarning}>
            <i className="fas fa-exclamation-triangle"></i>
            Please complete all required sections (minimum 90%) before submitting your application
          </div>
        )}

        {/* Footer Note */}
        <div className={styles.footerNote}>
          <i className="fas fa-shield-alt"></i>
          <p>
            Your application data is secure and encrypted. Xinghalana College complies with 
            the Protection of Personal Information Act (POPIA). 
            <a href="#"> View our privacy policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Review Section Component
const ReviewSection = ({ section, isEditing, onEdit, onSave, onCancel, onFieldChange }) => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <i className={section.icon}></i>
          <h3>{section.title}</h3>
        </div>
        <div className={styles.sectionActions}>
          {!isEditing ? (
            <button 
              type="button" 
              onClick={onEdit}
              className={styles.editButton}
            >
              <i className="fas fa-edit"></i>
              Edit
            </button>
          ) : (
            <div className={styles.editActions}>
              <button 
                type="button" 
                onClick={onSave}
                className={styles.saveButton}
              >
                <i className="fas fa-check"></i>
                Save
              </button>
              <button 
                type="button" 
                onClick={onCancel}
                className={styles.cancelButton}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.sectionContent}>
        <div className={styles.fieldsGrid}>
          {section.fields.map((field, index) => (
            <div key={index} className={styles.fieldItem}>
              <label className={styles.fieldLabel}>{field.label}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={field.value || ''}
                  onChange={(e) => onFieldChange(field.path, e.target.value)}
                  className={styles.fieldInput}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              ) : (
                <span className={`${styles.fieldValue} ${!field.value ? styles.empty : ''}`}>
                  {field.value || 'Not provided'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewConfirmPage;