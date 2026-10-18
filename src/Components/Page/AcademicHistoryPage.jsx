import React, { useState } from 'react';
import styles from './AcademicHistoryPage.module.css';

const AcademicHistoryPage = ({ applicationData, onBack, onSubmit }) => {
  // Common South African matric subjects
  const matricSubjects = [
    'Mathematics',
    'Mathematical Literacy',
    'Physical Sciences',
    'Life Sciences',
    'English Home Language',
    'English First Additional Language',
    'Afrikaans Home Language',
    'Afrikaans First Additional Language',
    'IsiZulu Home Language',
    'IsiZulu First Additional Language',
    'IsiXhosa Home Language',
    'IsiXhosa First Additional Language',
    'Geography',
    'History',
    'Accounting',
    'Business Studies',
    'Economics',
    'Tourism',
    'Consumer Studies',
    'Hospitality Studies',
    'Information Technology',
    'Computer Applications Technology',
    'Engineering Graphics and Design',
    'Civil Technology',
    'Mechanical Technology',
    'Electrical Technology',
    'Agricultural Sciences',
    'Agricultural Technology',
    'Life Orientation',
    'Religion Studies',
    'Visual Arts',
    'Music',
    'Dramatic Arts',
    'Dance Studies'
  ];

  const gradeOptions = [
    { value: '', label: 'Select Grade' },
    { value: 'A', label: 'A (80-100%)' },
    { value: 'B', label: 'B (70-79%)' },
    { value: 'C', label: 'C (60-69%)' },
    { value: 'D', label: 'D (50-59%)' },
    { value: 'E', label: 'E (40-49%)' },
    { value: 'F', label: 'F (0-39%)' },
    { value: 'pending', label: 'Results Pending' },
    { value: 'not_taken', label: 'Not Taken' }
  ];

  const [subjectCount, setSubjectCount] = useState(6); // Default to 6 subjects
  const [academicData, setAcademicData] = useState({
    // Matriculation information
    matricYear: applicationData?.highSchoolYear || '',
    examNumber: applicationData?.examNumber || '',
    
    // Matric subjects and grades - start with 6 subjects
    matricSubjects: Array(6).fill().map((_, index) => ({
      subject: '',
      grade: '',
      level: index === 0 ? 'home_language' : index === 1 ? 'first_additional' : 'other'
    })),
    
    // Tertiary qualifications
    hasTertiaryQualifications: 'no',
    tertiaryQualifications: [
      {
        institution: '',
        qualification: '',
        yearCompleted: '',
        duration: '',
        majorSubjects: '',
        uploadedDocuments: []
      }
    ],
    
    // ID Document
    idDocument: null,
    
    // Uploaded documents
    uploadedDocuments: []
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAcademicData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubjectCountChange = (e) => {
    const count = parseInt(e.target.value) || 6;
    setSubjectCount(count);
    
    // Update subjects array based on new count
    const currentSubjects = [...academicData.matricSubjects];
    const newSubjects = [];
    
    for (let i = 0; i < count; i++) {
      if (i < currentSubjects.length) {
        // Keep existing subject data
        newSubjects.push(currentSubjects[i]);
      } else {
        // Add new empty subject
        newSubjects.push({
          subject: '',
          grade: '',
          level: i === 0 ? 'home_language' : i === 1 ? 'first_additional' : 'other'
        });
      }
    }
    
    setAcademicData(prev => ({
      ...prev,
      matricSubjects: newSubjects
    }));
  };

  const handleMatricSubjectChange = (index, field, value) => {
    const updatedSubjects = [...academicData.matricSubjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: value
    };
    setAcademicData(prev => ({
      ...prev,
      matricSubjects: updatedSubjects
    }));
  };

  const addSubject = () => {
    const newSubject = {
      subject: '',
      grade: '',
      level: 'other'
    };
    
    setAcademicData(prev => ({
      ...prev,
      matricSubjects: [...prev.matricSubjects, newSubject]
    }));
    setSubjectCount(prev => prev + 1);
  };

  const removeSubject = (index) => {
    if (academicData.matricSubjects.length > 1) {
      const updatedSubjects = academicData.matricSubjects.filter((_, i) => i !== index);
      setAcademicData(prev => ({
        ...prev,
        matricSubjects: updatedSubjects
      }));
      setSubjectCount(prev => prev - 1);
    }
  };

  const handleTertiaryQualificationChange = (index, field, value) => {
    const updatedQualifications = [...academicData.tertiaryQualifications];
    updatedQualifications[index] = {
      ...updatedQualifications[index],
      [field]: value
    };
    setAcademicData(prev => ({
      ...prev,
      tertiaryQualifications: updatedQualifications
    }));
  };

  const addTertiaryQualification = () => {
    setAcademicData(prev => ({
      ...prev,
      tertiaryQualifications: [
        ...prev.tertiaryQualifications,
        {
          institution: '',
          qualification: '',
          yearCompleted: '',
          duration: '',
          majorSubjects: '',
          uploadedDocuments: []
        }
      ]
    }));
  };

  const removeTertiaryQualification = (index) => {
    if (academicData.tertiaryQualifications.length > 1) {
      const updatedQualifications = academicData.tertiaryQualifications.filter((_, i) => i !== index);
      setAcademicData(prev => ({
        ...prev,
        tertiaryQualifications: updatedQualifications
      }));
    }
  };

  const handleFileUpload = (e, qualificationIndex = null, documentType = 'general') => {
    const files = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        alert(`File ${file.name} must be PDF, JPG, or PNG`);
        return false;
      }
      if (!isValidSize) {
        alert(`File ${file.name} must be smaller than 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      if (documentType === 'id') {
        // Handle ID document upload (single file)
        setAcademicData(prev => ({
          ...prev,
          idDocument: validFiles[0] // Only take the first file for ID
        }));
      } else if (qualificationIndex !== null) {
        // Add to specific qualification
        const updatedQualifications = [...academicData.tertiaryQualifications];
        updatedQualifications[qualificationIndex].uploadedDocuments = [
          ...updatedQualifications[qualificationIndex].uploadedDocuments,
          ...validFiles
        ];
        setAcademicData(prev => ({
          ...prev,
          tertiaryQualifications: updatedQualifications
        }));
      } else {
        // Add to general uploaded documents
        setAcademicData(prev => ({
          ...prev,
          uploadedDocuments: [...prev.uploadedDocuments, ...validFiles]
        }));
      }
    }
  };

  const removeUploadedFile = (fileIndex, qualificationIndex = null, documentType = 'general') => {
    if (documentType === 'id') {
      setAcademicData(prev => ({
        ...prev,
        idDocument: null
      }));
    } else if (qualificationIndex !== null) {
      const updatedQualifications = [...academicData.tertiaryQualifications];
      updatedQualifications[qualificationIndex].uploadedDocuments = 
        updatedQualifications[qualificationIndex].uploadedDocuments.filter((_, i) => i !== fileIndex);
      setAcademicData(prev => ({
        ...prev,
        tertiaryQualifications: updatedQualifications
      }));
    } else {
      setAcademicData(prev => ({
        ...prev,
        uploadedDocuments: prev.uploadedDocuments.filter((_, i) => i !== fileIndex)
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate matric subjects
    const hasMatricSubjects = academicData.matricSubjects.some(subject => 
      subject.subject && subject.grade
    );

    if (!hasMatricSubjects) {
      newErrors.matricSubjects = 'Please add at least one matric subject with grade';
    }

    // Validate ID document
    if (!academicData.idDocument) {
      newErrors.idDocument = 'ID document is required';
    }

    // Validate tertiary qualifications if user has them
    if (academicData.hasTertiaryQualifications === 'yes') {
      academicData.tertiaryQualifications.forEach((qual, index) => {
        if (!qual.institution) {
          newErrors[`tertiary_institution_${index}`] = 'Institution name is required';
        }
        if (!qual.qualification) {
          newErrors[`tertiary_qualification_${index}`] = 'Qualification name is required';
        }
        if (!qual.yearCompleted) {
          newErrors[`tertiary_year_${index}`] = 'Year completed is required';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please complete all required fields before continuing.');
      return;
    }

    // Prepare data for submission
    const submissionData = {
      ...academicData,
      applicantName: `${applicationData.firstName} ${applicationData.lastName}`,
      selectedFaculty: applicationData.facultyName,
      selectedCourse: applicationData.firstChoiceCourseDetails?.name
    };

    onSubmit(submissionData);
  };

  const getLevelLabel = (level) => {
    switch (level) {
      case 'home_language': return 'Home Language';
      case 'first_additional': return 'First Additional Language';
      case 'other': return 'Other Subject';
      default: return 'Subject';
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <i className="fas fa-file-alt"></i>
          </div>
          <div className={styles.headerContent}>
            <h1>Academic History & Qualifications</h1>
            <p className={styles.subtitle}>
              Please provide your academic history including matriculation results and any tertiary qualifications.
            </p>
            <div className={styles.applicantInfo}>
              <div className={styles.infoItem}>
                <strong>Applicant:</strong> {applicationData.firstName} {applicationData.lastName}
              </div>
              <div className={styles.infoItem}>
                <strong>Selected Course:</strong> {applicationData.firstChoiceCourseDetails?.name}
              </div>
              <div className={styles.infoItem}>
                <strong>Faculty:</strong> {applicationData.facultyName}
              </div>
            </div>
          </div>
          <div className={styles.applicationBadge}>
            <span className={styles.badge}>Step 4: Academic History</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ID Document Section */}
          <Section title="Identity Document" icon="fas fa-id-card">
            <div className={styles.uploadSection}>
              <p className={styles.sectionHelp}>
                Please upload a clear copy of your South African ID document or passport. 
                This is required for identity verification.
              </p>
              
              <div className={styles.uploadArea}>
                <input
                  type="file"
                  id="idDocument"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, null, 'id')}
                  className={styles.fileInput}
                />
                <label htmlFor="idDocument" className={styles.uploadLabel}>
                  <i className="fas fa-id-card"></i>
                  <span>Upload ID Document</span>
                  <small>PDF, JPG, PNG up to 5MB</small>
                </label>
              </div>

              {/* Uploaded ID Document */}
              {academicData.idDocument && (
                <div className={styles.uploadedFiles}>
                  <h5>Uploaded ID Document:</h5>
                  <div className={styles.fileItem}>
                    <i className="fas fa-id-card"></i>
                    <span className={styles.fileName}>{academicData.idDocument.name}</span>
                    <span className={styles.fileSize}>
                      ({(academicData.idDocument.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                    <button
                      type="button"
                      className={styles.removeFile}
                      onClick={() => removeUploadedFile(null, null, 'id')}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              )}

              {errors.idDocument && (
                <div className={styles.errorMessage}>
                  {errors.idDocument}
                </div>
              )}

              <div className={styles.uploadTips}>
                <h6>Tips for a good ID photo:</h6>
                <ul>
                  <li>Ensure all text is clear and readable</li>
                  <li>Take the photo in good lighting</li>
                  <li>Make sure the entire ID is visible</li>
                  <li>Avoid glare and shadows</li>
                  <li>File must be in PDF, JPG, or PNG format</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Matriculation Information Section */}
          <Section title="Matriculation / Grade 12 Results" icon="fas fa-graduation-cap">
            <div className={styles.formGrid}>
              <FormGroup label="Matriculation Year" required>
                <input
                  type="text"
                  name="matricYear"
                  value={academicData.matricYear}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('matricYear')}
                  required
                  className={styles.input}
                />
              </FormGroup>

              <FormGroup label="Examination Number">
                <input
                  type="text"
                  name="examNumber"
                  value={academicData.examNumber}
                  onChange={handleInputChange}
                  placeholder="If available"
                  className={styles.input}
                />
              </FormGroup>

              <FormGroup label="Number of Subjects" required>
                <select
                  value={subjectCount}
                  onChange={handleSubjectCountChange}
                  className={styles.select}
                >
                  {[6, 7, 8, 9, 10, 11, 12].map(num => (
                    <option key={num} value={num}>
                      {num} Subjects
                    </option>
                  ))}
                </select>
                <small className={styles.helpText}>
                  Select the total number of subjects you completed/will complete
                </small>
              </FormGroup>
            </div>

            <div className={styles.subjectsSection}>
              <div className={styles.sectionHeaderRow}>
                <h3>Subjects and Grades</h3>
                <button
                  type="button"
                  className={styles.addSubjectButton}
                  onClick={addSubject}
                >
                  <i className="fas fa-plus"></i>
                  Add Another Subject
                </button>
              </div>
              
              <p className={styles.sectionHelp}>
                Please enter your matric subjects and corresponding grades. Add at least 6 subjects including your languages.
                Most students take 7-9 subjects.
              </p>

              {academicData.matricSubjects.map((subject, index) => (
                <div key={index} className={styles.subjectRow}>
                  <div className={styles.subjectLevel}>
                    <span className={styles.levelBadge}>
                      {getLevelLabel(subject.level)}
                    </span>
                  </div>
                  
                  <div className={styles.subjectSelect}>
                    <select
                      value={subject.subject}
                      onChange={(e) => handleMatricSubjectChange(index, 'subject', e.target.value)}
                      className={styles.select}
                    >
                      <option value="">Select Subject</option>
                      {matricSubjects.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.gradeSelect}>
                    <select
                      value={subject.grade}
                      onChange={(e) => handleMatricSubjectChange(index, 'grade', e.target.value)}
                      className={styles.select}
                    >
                      {gradeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {academicData.matricSubjects.length > 1 && (
                    <div className={styles.subjectActions}>
                      <button
                        type="button"
                        className={styles.removeSubject}
                        onClick={() => removeSubject(index)}
                        title="Remove subject"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {errors.matricSubjects && (
                <div className={styles.errorMessage}>
                  {errors.matricSubjects}
                </div>
              )}

              <div className={styles.subjectStats}>
                <p>
                  <strong>{academicData.matricSubjects.filter(s => s.subject && s.grade).length}</strong> 
                  out of <strong>{academicData.matricSubjects.length}</strong> subjects completed
                </p>
              </div>
            </div>

            {/* Matric Certificate Upload */}
            <div className={styles.uploadSection}>
              <h4>Upload Matric Certificate/Statement of Results</h4>
              <p className={styles.uploadHelp}>
                Upload a clear scan or photo of your matric certificate or statement of results. 
                Accepted formats: PDF, JPG, PNG (Max 5MB per file)
              </p>
              
              <div className={styles.uploadArea}>
                <input
                  type="file"
                  id="matricCertificate"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e)}
                  className={styles.fileInput}
                />
                <label htmlFor="matricCertificate" className={styles.uploadLabel}>
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>Click to upload matric documents</span>
                  <small>PDF, JPG, PNG up to 5MB each</small>
                </label>
              </div>

              {/* Uploaded Files List */}
              {academicData.uploadedDocuments.length > 0 && (
                <div className={styles.uploadedFiles}>
                  <h5>Uploaded Documents:</h5>
                  {academicData.uploadedDocuments.map((file, index) => (
                    <div key={index} className={styles.fileItem}>
                      <i className="fas fa-file"></i>
                      <span className={styles.fileName}>{file.name}</span>
                      <span className={styles.fileSize}>
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <button
                        type="button"
                        className={styles.removeFile}
                        onClick={() => removeUploadedFile(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>

          {/* Tertiary Qualifications Section */}
          <Section title="Tertiary Qualifications" icon="fas fa-university">
            <div className={styles.formGroup}>
              <label className={styles.required}>
                Do you have any tertiary qualifications?
              </label>
              <div className={styles.radioGroup}>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="hasTertiaryQualifications"
                    value="yes"
                    checked={academicData.hasTertiaryQualifications === 'yes'}
                    onChange={handleInputChange}
                  />
                  <span className={styles.radioLabel}>Yes</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="hasTertiaryQualifications"
                    value="no"
                    checked={academicData.hasTertiaryQualifications === 'no'}
                    onChange={handleInputChange}
                  />
                  <span className={styles.radioLabel}>No</span>
                </label>
              </div>
            </div>

            {academicData.hasTertiaryQualifications === 'yes' && (
              <div className={styles.tertiaryQualifications}>
                {academicData.tertiaryQualifications.map((qual, index) => (
                  <div key={index} className={styles.qualificationCard}>
                    <div className={styles.cardHeader}>
                      <h4>Qualification {index + 1}</h4>
                      {academicData.tertiaryQualifications.length > 1 && (
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => removeTertiaryQualification(index)}
                        >
                          <i className="fas fa-times"></i>
                          Remove
                        </button>
                      )}
                    </div>

                    <div className={styles.formGrid}>
                      <FormGroup label="Institution Name" required error={errors[`tertiary_institution_${index}`]}>
                        <input
                          type="text"
                          value={qual.institution}
                          onChange={(e) => handleTertiaryQualificationChange(index, 'institution', e.target.value)}
                          placeholder="e.g., University of Johannesburg"
                          className={styles.input}
                          required
                        />
                      </FormGroup>

                      <FormGroup label="Qualification" required error={errors[`tertiary_qualification_${index}`]}>
                        <input
                          type="text"
                          value={qual.qualification}
                          onChange={(e) => handleTertiaryQualificationChange(index, 'qualification', e.target.value)}
                          placeholder="e.g., Bachelor of Science"
                          className={styles.input}
                          required
                        />
                      </FormGroup>

                      <FormGroup label="Year Completed" required error={errors[`tertiary_year_${index}`]}>
                        <select
                          value={qual.yearCompleted}
                          onChange={(e) => handleTertiaryQualificationChange(index, 'yearCompleted', e.target.value)}
                          className={styles.select}
                          required
                        >
                          <option value="">Select Year</option>
                          {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </FormGroup>

                      <FormGroup label="Duration">
                        <select
                          value={qual.duration}
                          onChange={(e) => handleTertiaryQualificationChange(index, 'duration', e.target.value)}
                          className={styles.select}
                        >
                          <option value="">Select Duration</option>
                          <option value="1 year">1 Year</option>
                          <option value="2 years">2 Years</option>
                          <option value="3 years">3 Years</option>
                          <option value="4 years">4 Years</option>
                          <option value="other">Other</option>
                        </select>
                      </FormGroup>

                      <FormGroup label="Major Subjects" fullWidth>
                        <textarea
                          value={qual.majorSubjects}
                          onChange={(e) => handleTertiaryQualificationChange(index, 'majorSubjects', e.target.value)}
                          placeholder="List your major subjects or areas of specialization"
                          rows="3"
                          className={styles.textarea}
                        />
                      </FormGroup>

                      {/* Qualification Document Upload */}
                      <FormGroup label="Upload Qualification Documents" fullWidth>
                        <div className={styles.uploadArea}>
                          <input
                            type="file"
                            id={`qualificationDocs-${index}`}
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, index)}
                            className={styles.fileInput}
                          />
                          <label htmlFor={`qualificationDocs-${index}`} className={styles.uploadLabel}>
                            <i className="fas fa-cloud-upload-alt"></i>
                            <span>Upload certificates/transcripts</span>
                            <small>PDF, JPG, PNG up to 5MB each</small>
                          </label>
                        </div>

                        {/* Uploaded Files List */}
                        {qual.uploadedDocuments.length > 0 && (
                          <div className={styles.uploadedFiles}>
                            {qual.uploadedDocuments.map((file, fileIndex) => (
                              <div key={fileIndex} className={styles.fileItem}>
                                <i className="fas fa-file"></i>
                                <span className={styles.fileName}>{file.name}</span>
                                <span className={styles.fileSize}>
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                                <button
                                  type="button"
                                  className={styles.removeFile}
                                  onClick={() => removeUploadedFile(fileIndex, index)}
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </FormGroup>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className={styles.addButton}
                  onClick={addTertiaryQualification}
                >
                  <i className="fas fa-plus"></i>
                  Add Another Qualification
                </button>
              </div>
            )}
          </Section>

          {/* Additional Documents Section */}
          <Section title="Additional Supporting Documents" icon="fas fa-paperclip">
            <div className={styles.uploadSection}>
              <p className={styles.sectionHelp}>
                Upload any additional documents that support your application (e.g., proof of address, 
                other certificates, recommendation letters). These documents will strengthen your application.
              </p>
              
              <div className={styles.uploadArea}>
                <input
                  type="file"
                  id="additionalDocuments"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e)}
                  className={styles.fileInput}
                />
                <label htmlFor="additionalDocuments" className={styles.uploadLabel}>
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>Click to upload additional documents</span>
                  <small>PDF, JPG, PNG up to 5MB each</small>
                </label>
              </div>

              {/* Uploaded Files List */}
              {academicData.uploadedDocuments.length > 0 && (
                <div className={styles.uploadedFiles}>
                  <h5>Uploaded Additional Documents:</h5>
                  {academicData.uploadedDocuments.map((file, index) => (
                    <div key={index} className={styles.fileItem}>
                      <i className="fas fa-file"></i>
                      <span className={styles.fileName}>{file.name}</span>
                      <span className={styles.fileSize}>
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <button
                        type="button"
                        className={styles.removeFile}
                        onClick={() => removeUploadedFile(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>

          <div className={styles.actions}>
            <button type="button" onClick={onBack} className={`${styles.btn} ${styles.btnBack}`}>
              <i className="fas fa-arrow-left"></i>
              Back to Course Selection
            </button>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
              Continue to Review
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Section Component
const Section = ({ title, icon, children }) => (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      <i className={icon}></i>
      <h2>{title}</h2>
    </div>
    <div className={styles.sectionContent}>
      {children}
    </div>
  </div>
);

// Reusable FormGroup Component
const FormGroup = ({ label, children, required, fullWidth, error }) => (
  <div className={`${styles.formGroup} ${fullWidth ? styles.formGroupFullWidth : ''}`}>
    {label && (
      <label className={required ? styles.required : ''}>
        {label}
      </label>
    )}
    {children}
    {error && <div className={styles.errorMessage}>{error}</div>}
  </div>
);

export default AcademicHistoryPage;