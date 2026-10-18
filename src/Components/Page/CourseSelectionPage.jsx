import React, { useState, useEffect } from 'react';
import styles from './CourseSelectionPage.module.css';

const CourseSelectionPage = ({ enrolmentData, onBack, onSubmit }) => {
  // Sample data structure for faculties and courses
  const facultiesData = {
    faculty_of_science: {
      name: "Faculty of Science",
      description: "Programs in natural sciences, mathematics, and technology",
      courses: {
        full_time: [
          { id: 'bsc_computer_science', name: 'BSc Computer Science', duration: '3 years', requirements: 'Mathematics & Physical Science' },
          { id: 'bsc_mathematics', name: 'BSc Mathematics', duration: '3 years', requirements: 'Mathematics' },
          { id: 'bsc_physics', name: 'BSc Physics', duration: '3 years', requirements: 'Mathematics & Physical Science' },
          { id: 'bsc_chemistry', name: 'BSc Chemistry', duration: '3 years', requirements: 'Mathematics & Physical Science' },
          { id: 'bsc_biology', name: 'BSc Biological Sciences', duration: '3 years', requirements: 'Mathematics & Life Sciences' }
        ],
        part_time: [
          { id: 'bsc_computer_science_pt', name: 'BSc Computer Science (Part-time)', duration: '4 years', requirements: 'Mathematics & Physical Science' },
          { id: 'bsc_mathematics_pt', name: 'BSc Mathematics (Part-time)', duration: '4 years', requirements: 'Mathematics' }
        ]
      }
    },
    faculty_of_arts: {
      name: "Faculty of Arts & Humanities",
      description: "Programs in social sciences, languages, and creative arts",
      courses: {
        full_time: [
          { id: 'ba_psychology', name: 'BA Psychology', duration: '3 years', requirements: 'Any NSC subjects' },
          { id: 'ba_sociology', name: 'BA Sociology', duration: '3 years', requirements: 'Any NSC subjects' },
          { id: 'ba_literature', name: 'BA English Literature', duration: '3 years', requirements: 'English Home Language' },
          { id: 'ba_history', name: 'BA History', duration: '3 years', requirements: 'Any NSC subjects' }
        ],
        part_time: [
          { id: 'ba_psychology_pt', name: 'BA Psychology (Part-time)', duration: '4 years', requirements: 'Any NSC subjects' },
          { id: 'ba_sociology_pt', name: 'BA Sociology (Part-time)', duration: '4 years', requirements: 'Any NSC subjects' }
        ]
      }
    },
    faculty_of_business: {
      name: "Faculty of Business & Commerce",
      description: "Programs in business management, economics, and finance",
      courses: {
        full_time: [
          { id: 'bcom_general', name: 'BCom General', duration: '3 years', requirements: 'Mathematics & English' },
          { id: 'bcom_accounting', name: 'BCom Accounting', duration: '3 years', requirements: 'Mathematics & Accounting' },
          { id: 'bcom_economics', name: 'BCom Economics', duration: '3 years', requirements: 'Mathematics' },
          { id: 'bcom_marketing', name: 'BCom Marketing', duration: '3 years', requirements: 'Mathematics & English' }
        ],
        part_time: [
          { id: 'bcom_general_pt', name: 'BCom General (Part-time)', duration: '4 years', requirements: 'Mathematics & English' },
          { id: 'bcom_accounting_pt', name: 'BCom Accounting (Part-time)', duration: '4 years', requirements: 'Mathematics & Accounting' }
        ]
      }
    },
    faculty_of_engineering: {
      name: "Faculty of Engineering & Technology",
      description: "Programs in engineering and technology disciplines",
      courses: {
        full_time: [
          { id: 'beng_civil', name: 'BEng Civil Engineering', duration: '4 years', requirements: 'Mathematics, Physical Science & English' },
          { id: 'beng_electrical', name: 'BEng Electrical Engineering', duration: '4 years', requirements: 'Mathematics, Physical Science & English' },
          { id: 'beng_mechanical', name: 'BEng Mechanical Engineering', duration: '4 years', requirements: 'Mathematics, Physical Science & English' },
          { id: 'beng_software', name: 'BEng Software Engineering', duration: '4 years', requirements: 'Mathematics, Physical Science & English' }
        ],
        part_time: [
          { id: 'beng_civil_pt', name: 'BEng Civil Engineering (Part-time)', duration: '6 years', requirements: 'Mathematics, Physical Science & English' },
          { id: 'beng_electrical_pt', name: 'BEng Electrical Engineering (Part-time)', duration: '6 years', requirements: 'Mathematics, Physical Science & English' }
        ]
      }
    },
    faculty_of_health: {
      name: "Faculty of Health Sciences",
      description: "Programs in medical and health-related fields",
      courses: {
        full_time: [
          { id: 'bsc_nursing', name: 'BSc Nursing', duration: '4 years', requirements: 'Mathematics, Life Sciences & English' },
          { id: 'bsc_pharmacy', name: 'BSc Pharmacy', duration: '4 years', requirements: 'Mathematics, Physical Science & Life Sciences' },
          { id: 'bsc_biomedical', name: 'BSc Biomedical Sciences', duration: '3 years', requirements: 'Mathematics, Physical Science & Life Sciences' }
        ],
        part_time: [
          { id: 'bsc_nursing_pt', name: 'BSc Nursing (Part-time)', duration: '6 years', requirements: 'Mathematics, Life Sciences & English' }
        ]
      }
    }
  };

  const [selectionData, setSelectionData] = useState({
    faculty: '',
    modeOfStudy: '',
    intakeYear: new Date().getFullYear(),
    intakeSemester: 'semester1',
    firstChoiceCourse: '',
    secondChoiceCourse: '',
    thirdChoiceCourse: ''
  });

  const [availableCourses, setAvailableCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Update available courses when faculty or mode of study changes
  useEffect(() => {
    if (selectionData.faculty && selectionData.modeOfStudy) {
      const faculty = facultiesData[selectionData.faculty];
      if (faculty && faculty.courses[selectionData.modeOfStudy]) {
        setAvailableCourses(faculty.courses[selectionData.modeOfStudy]);
        
        // Reset course selections when courses change
        setSelectionData(prev => ({
          ...prev,
          firstChoiceCourse: '',
          secondChoiceCourse: '',
          thirdChoiceCourse: ''
        }));
      }
    } else {
      setAvailableCourses([]);
    }
  }, [selectionData.faculty, selectionData.modeOfStudy]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectionData(prev => ({
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

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    validateField(field, selectionData[field]);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'faculty':
        if (!value) {
          newErrors.faculty = 'Please select a faculty';
        } else {
          delete newErrors.faculty;
        }
        break;
      case 'modeOfStudy':
        if (!value) {
          newErrors.modeOfStudy = 'Please select mode of study';
        } else {
          delete newErrors.modeOfStudy;
        }
        break;
      case 'firstChoiceCourse':
        if (!value) {
          newErrors.firstChoiceCourse = 'First choice course is required';
        } else {
          delete newErrors.firstChoiceCourse;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const getCurrentFaculty = () => {
    return selectionData.faculty ? facultiesData[selectionData.faculty] : null;
  };

  const getCourseDetails = (courseId) => {
    if (!courseId || !selectionData.faculty || !selectionData.modeOfStudy) return null;
    
    const faculty = facultiesData[selectionData.faculty];
    const courses = faculty.courses[selectionData.modeOfStudy];
    return courses.find(course => course.id === courseId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = ['faculty', 'modeOfStudy', 'firstChoiceCourse'];
    const missingFields = requiredFields.filter(field => !selectionData[field]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields marked with *');
      return;
    }

    // Validate that courses are unique
    const selectedCourses = [
      selectionData.firstChoiceCourse,
      selectionData.secondChoiceCourse,
      selectionData.thirdChoiceCourse
    ].filter(course => course !== '');

    const uniqueCourses = new Set(selectedCourses);
    if (uniqueCourses.size !== selectedCourses.length) {
      alert('Please select different courses for each choice');
      return;
    }

    // Prepare submission data
    const submissionData = {
      ...selectionData,
      facultyName: getCurrentFaculty()?.name,
      firstChoiceCourseDetails: getCourseDetails(selectionData.firstChoiceCourse),
      secondChoiceCourseDetails: getCourseDetails(selectionData.secondChoiceCourse),
      thirdChoiceCourseDetails: getCourseDetails(selectionData.thirdChoiceCourse)
    };

    onSubmit(submissionData);
  };

  const currentFaculty = getCurrentFaculty();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div className={styles.headerContent}>
            <h1>Course Selection & Faculty</h1>
            <p className={styles.subtitle}>
              Please select your preferred faculty and courses for the upcoming academic year.
            </p>
            <div className={styles.applicantInfo}>
              <div className={styles.infoItem}>
                <strong>Applicant:</strong> {enrolmentData.firstName} {enrolmentData.lastName}
              </div>
              <div className={styles.infoItem}>
                <strong>Student ID:</strong> {enrolmentData.previousStudentNumber || 'New Applicant'}
              </div>
            </div>
          </div>
          <div className={styles.applicationBadge}>
            <span className={styles.badge}>Step 3: Course Selection</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Faculty Selection Section */}
          <Section title="Faculty Selection" icon="fas fa-university">
            <div className={styles.formGrid}>
              <FormGroup 
                label="Select Faculty" 
                required 
                error={errors.faculty} 
                touched={touched.faculty}
              >
                <select 
                  name="faculty" 
                  value={selectionData.faculty}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('faculty')}
                  required
                  className={`${styles.select} ${errors.faculty && touched.faculty ? styles.formGroupError : ''}`}
                >
                  <option value="">--- Please select a faculty ---</option>
                  {Object.entries(facultiesData).map(([key, faculty]) => (
                    <option key={key} value={key}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </FormGroup>

              {currentFaculty && (
                <div className={styles.facultyDescription}>
                  <div className={styles.descriptionHeader}>
                    <i className="fas fa-info-circle"></i>
                    <h4>About {currentFaculty.name}</h4>
                  </div>
                  <p>{currentFaculty.description}</p>
                </div>
              )}
            </div>
          </Section>

          {/* Study Details Section */}
          <Section title="Study Details" icon="fas fa-calendar-alt">
            <div className={styles.formGrid}>
              <FormGroup 
                label="Mode of Study" 
                required 
                error={errors.modeOfStudy} 
                touched={touched.modeOfStudy}
              >
                <select 
                  name="modeOfStudy" 
                  value={selectionData.modeOfStudy}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('modeOfStudy')}
                  required
                  className={`${styles.select} ${errors.modeOfStudy && touched.modeOfStudy ? styles.formGroupError : ''}`}
                >
                  <option value="">--- Select mode of study ---</option>
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                </select>
              </FormGroup>

              <FormGroup label="Intake Year" required>
                <select 
                  name="intakeYear" 
                  value={selectionData.intakeYear}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  {Array.from({length: 5}, (_, i) => new Date().getFullYear() + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup label="Intake Semester" required>
                <select 
                  name="intakeSemester" 
                  value={selectionData.intakeSemester}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="semester1">Semester 1 (January)</option>
                  <option value="semester2">Semester 2 (July)</option>
                </select>
              </FormGroup>
            </div>
          </Section>

          {/* Course Selection Section */}
          <Section title="Course Selection" icon="fas fa-book">
            <div className={styles.courseSelectionInfo}>
              <p>
                Please select your course preferences in order of priority. Your first choice will be given priority consideration.
                {availableCourses.length > 0 && ` ${availableCourses.length} courses available for selection.`}
              </p>
            </div>

            <div className={styles.formGrid}>
              <FormGroup 
                label="First Choice Course *" 
                required 
                error={errors.firstChoiceCourse} 
                touched={touched.firstChoiceCourse}
              >
                <select 
                  name="firstChoiceCourse" 
                  value={selectionData.firstChoiceCourse}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('firstChoiceCourse')}
                  required
                  disabled={!selectionData.faculty || !selectionData.modeOfStudy}
                  className={`${styles.select} ${errors.firstChoiceCourse && touched.firstChoiceCourse ? styles.formGroupError : ''}`}
                >
                  <option value="">--- Select first choice ---</option>
                  {availableCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                {selectionData.firstChoiceCourse && (
                  <CourseDetails course={getCourseDetails(selectionData.firstChoiceCourse)} />
                )}
              </FormGroup>

              <FormGroup label="Second Choice Course">
                <select 
                  name="secondChoiceCourse" 
                  value={selectionData.secondChoiceCourse}
                  onChange={handleInputChange}
                  disabled={!selectionData.faculty || !selectionData.modeOfStudy}
                  className={styles.select}
                >
                  <option value="">--- Select second choice (optional) ---</option>
                  {availableCourses.map(course => (
                    <option key={course.id} value={course.id} disabled={course.id === selectionData.firstChoiceCourse}>
                      {course.name}
                    </option>
                  ))}
                </select>
                {selectionData.secondChoiceCourse && (
                  <CourseDetails course={getCourseDetails(selectionData.secondChoiceCourse)} />
                )}
              </FormGroup>

              <FormGroup label="Third Choice Course">
                <select 
                  name="thirdChoiceCourse" 
                  value={selectionData.thirdChoiceCourse}
                  onChange={handleInputChange}
                  disabled={!selectionData.faculty || !selectionData.modeOfStudy}
                  className={styles.select}
                >
                  <option value="">--- Select third choice (optional) ---</option>
                  {availableCourses.map(course => (
                    <option 
                      key={course.id} 
                      value={course.id} 
                      disabled={course.id === selectionData.firstChoiceCourse || course.id === selectionData.secondChoiceCourse}
                    >
                      {course.name}
                    </option>
                  ))}
                </select>
                {selectionData.thirdChoiceCourse && (
                  <CourseDetails course={getCourseDetails(selectionData.thirdChoiceCourse)} />
                )}
              </FormGroup>
            </div>

            {availableCourses.length === 0 && selectionData.faculty && selectionData.modeOfStudy && (
              <div className={styles.noCoursesMessage}>
                <i className="fas fa-exclamation-triangle"></i>
                No courses available for the selected faculty and mode of study.
              </div>
            )}
          </Section>

          {/* Course Requirements Summary */}
          {selectionData.firstChoiceCourse && (
            <Section title="Admission Requirements" icon="fas fa-clipboard-check">
              <div className={styles.requirementsSummary}>
                <h4>Minimum Requirements for Your Selected Courses</h4>
                <div className={styles.requirementsList}>
                  {selectionData.firstChoiceCourse && (
                    <div className={styles.requirementItem}>
                      <strong>First Choice:</strong> {getCourseDetails(selectionData.firstChoiceCourse)?.requirements}
                    </div>
                  )}
                  {selectionData.secondChoiceCourse && (
                    <div className={styles.requirementItem}>
                      <strong>Second Choice:</strong> {getCourseDetails(selectionData.secondChoiceCourse)?.requirements}
                    </div>
                  )}
                  {selectionData.thirdChoiceCourse && (
                    <div className={styles.requirementItem}>
                      <strong>Third Choice:</strong> {getCourseDetails(selectionData.thirdChoiceCourse)?.requirements}
                    </div>
                  )}
                </div>
                <div className={styles.requirementsNote}>
                  <i className="fas fa-info-circle"></i>
                  Meeting minimum requirements does not guarantee admission. Selection is competitive and based on academic merit.
                </div>
              </div>
            </Section>
          )}

          <div className={styles.actions}>
            <button type="button" onClick={onBack} className={`${styles.btn} ${styles.btnBack}`}>
              <i className="fas fa-arrow-left"></i>
              Back to Enrolment
            </button>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
              Continue to Academic History
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Course Details Component
const CourseDetails = ({ course }) => {
  if (!course) return null;

  return (
    <div className={styles.courseDetails}>
      <div className={styles.detailItem}>
        <span className={styles.detailLabel}>Duration:</span>
        <span className={styles.detailValue}>{course.duration}</span>
      </div>
      <div className={styles.detailItem}>
        <span className={styles.detailLabel}>Requirements:</span>
        <span className={styles.detailValue}>{course.requirements}</span>
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
const FormGroup = ({ label, children, required, fullWidth, helpText, error, touched }) => (
  <div className={`${styles.formGroup} ${fullWidth ? styles.formGroupFullWidth : ''} ${error && touched ? styles.formGroupError : ''}`}>
    {label && (
      <label>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
    )}
    {children}
    {helpText && <div className="help-text">{helpText}</div>}
    {error && touched && <div className={styles.errorMessage}>{error}</div>}
  </div>
);

export default CourseSelectionPage;