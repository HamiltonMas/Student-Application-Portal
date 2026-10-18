import React, { useState } from 'react';
import './App.css';
import ConfirmationPage from './Components/Page/PersonalDetailsConfirmationPage';
import EnrolmentPage from './Components/Page/EnrolmentPage';
import CourseSelectionPage from './Components/Page/CourseSelectionPage';
import AcademicHistoryPage from './Components/Page/AcademicHistoryPage';
import ReviewConfirmPage from './Components/Page/ReviewConfirmPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('application');
  const [formData, setFormData] = useState({
    hasNationalId: '',
    nationalId: '',
    previousStudentNumber: '',
    firstName: '',
    lastName: '',
    gender: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    email: '',
    phone: '',
    highSchoolYear: '',
    studiedBefore: ''
  });

  const [enrolmentData, setEnrolmentData] = useState(null);
  const [courseSelectionData, setCourseSelectionData] = useState(null);
  const [academicHistoryData, setAcademicHistoryData] = useState(null);

  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());

  function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ['firstName', 'lastName', 'gender', 'birthYear', 'birthMonth', 'birthDay', 'email', 'phone', 'highSchoolYear', 'studiedBefore'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields before continuing.');
      return;
    }

    if (formData.hasNationalId === 'yes' && !formData.nationalId) {
      alert('Please enter your National ID number.');
      return;
    }

    setCurrentPage('confirmation');
  };

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
  };

  const handleBackToApplication = () => {
    setCurrentPage('application');
  };

  const handleBackToConfirmation = () => {
    setCurrentPage('confirmation');
  };

  const handleBackToEnrolment = () => {
    setCurrentPage('enrolment');
  };

  const handleBackToCourseSelection = () => {
    setCurrentPage('course-selection');
  };

  const handleBackToAcademicHistory = () => {
    setCurrentPage('academic-history');
  };

  const handleContinueToEnrolment = () => {
    setCurrentPage('enrolment');
  };

  const handleContinueToCourseSelection = (enrolmentData) => {
    setEnrolmentData(enrolmentData);
    setCurrentPage('course-selection');
  };

  const handleContinueToAcademicHistory = (courseSelectionData) => {
    setCourseSelectionData(courseSelectionData);
    setCurrentPage('academic-history');
  };

  const handleContinueToReview = (academicHistoryData) => {
    setAcademicHistoryData(academicHistoryData);
    setCurrentPage('review-confirm');
  };

  const handleFinalSubmit = (finalData) => {
    const completeApplicationData = {
      ...formData,
      ...enrolmentData,
      ...courseSelectionData,
      ...academicHistoryData,
      ...finalData,
      applicationId: `XING-APP-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      submissionDate: new Date().toISOString()
    };
    
    console.log('Final application submitted:', completeApplicationData);
    
    // Show success message with application summary
    const submissionDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    alert(`Application submitted successfully!\n\nApplication Summary:\n- Name: ${completeApplicationData.firstName} ${completeApplicationData.lastName}\n- Course: ${completeApplicationData.firstChoiceCourseDetails?.name}\n- Faculty: ${completeApplicationData.facultyName}\n- Application ID: ${completeApplicationData.applicationId}\n- Submission Date: ${submissionDate}\n\nYou will receive a confirmation email shortly.`);
    
    // Reset the application
    setCurrentPage('application');
    setFormData({
      hasNationalId: '',
      nationalId: '',
      previousStudentNumber: '',
      firstName: '',
      lastName: '',
      gender: '',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      email: '',
      phone: '',
      highSchoolYear: '',
      studiedBefore: ''
    });
    setEnrolmentData(null);
    setCourseSelectionData(null);
    setAcademicHistoryData(null);
  };

  // Render different pages based on currentPage state
  if (currentPage === 'confirmation') {
    return (
      <ConfirmationPage 
        formData={formData}
        onBack={handleBackToApplication}
        onSubmit={handleContinueToEnrolment}
      />
    );
  }

  if (currentPage === 'enrolment') {
    return (
      <EnrolmentPage 
        formData={formData}
        onBack={handleBackToConfirmation}
        onSubmit={handleContinueToCourseSelection}
      />
    );
  }

  if (currentPage === 'course-selection') {
    return (
      <CourseSelectionPage 
        enrolmentData={enrolmentData}
        onBack={handleBackToEnrolment}
        onSubmit={handleContinueToAcademicHistory}
      />
    );
  }

  if (currentPage === 'academic-history') {
    return (
      <AcademicHistoryPage 
        applicationData={{
          ...formData,
          ...enrolmentData,
          ...courseSelectionData
        }}
        onBack={handleBackToCourseSelection}
        onSubmit={handleContinueToReview}
      />
    );
  }

  if (currentPage === 'review-confirm') {
    return (
      <ReviewConfirmPage 
        applicationData={{
          ...formData,
          ...enrolmentData,
          ...courseSelectionData,
          ...academicHistoryData
        }}
        onBack={handleBackToAcademicHistory}
        onSubmit={handleFinalSubmit}
      />
    );
  }

  return (
    <div className="app">
      <div className="container">
        <Header />
        <ApplicationCard 
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          captchaCode={captchaCode}
          refreshCaptcha={refreshCaptcha}
        />
        <FeaturesSection />
        <Footer />
      </div>
    </div>
  );
};

const Header = () => (
  <header className="header">
    <div className="logo-container">
      <div className="logo">
        <i className="fas fa-graduation-cap"></i>
      </div>
      <div>
        <h1>Xinghalana Student Application Portal</h1>
        <p className="subtitle">Begin your academic journey with South Africa's premier institution of higher learning</p>
      </div>
    </div>
    <div className="stats">
      <div className="stat">
        <span className="stat-number">40,000+</span>
        <span className="stat-label">Students</span>
      </div>
      <div className="stat">
        <span className="stat-number">200+</span>
        <span className="stat-label">Programs</span>
      </div>
      <div className="stat">
        <span className="stat-number">95%</span>
        <span className="stat-label">Graduate Success</span>
      </div>
    </div>
  </header>
);

const ApplicationCard = ({ formData, handleInputChange, handleSubmit, captchaCode, refreshCaptcha }) => (
  <div className="application-card">
    <div className="card-header">
      <i className="fas fa-pencil-alt"></i>
      <h2>New Student Application</h2>
    </div>
    <div className="card-body">
      <div className="intro-text">
        <i className="fas fa-info-circle"></i>
        If you would like to start or continue your studies at Xinghalana as a new student, please complete this form and press the continue button.
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormSection 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>

        <CaptchaSection 
          captchaCode={captchaCode}
          refreshCaptcha={refreshCaptcha}
        />

        <div className="action-buttons">
          <button type="button" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i>
            Save & Return Later
          </button>
          <button type="submit" className="btn btn-primary">
            Continue Application
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </form>
    </div>
  </div>
);

const FormSection = ({ formData, handleInputChange }) => (
  <>
    <div className="form-group full-width">
      <label className="required">Do you have a valid South African National ID number?</label>
      <div className="radio-group">
        <div className="radio-option">
          <input
            type="radio"
            id="hasIdYes"
            name="hasNationalId"
            value="yes"
            checked={formData.hasNationalId === 'yes'}
            onChange={handleInputChange}
          />
          <label htmlFor="hasIdYes">Yes</label>
        </div>
        <div className="radio-option">
          <input
            type="radio"
            id="hasIdNo"
            name="hasNationalId"
            value="no"
            checked={formData.hasNationalId === 'no'}
            onChange={handleInputChange}
          />
          <label htmlFor="hasIdNo">No</label>
        </div>
      </div>
    </div>

    {formData.hasNationalId === 'yes' && (
      <div className="form-group">
        <label className="required">National ID number</label>
        <input
          type="text"
          name="nationalId"
          value={formData.nationalId}
          onChange={handleInputChange}
          placeholder="Enter your ID number"
          required
        />
      </div>
    )}

    <div className="form-group">
      <label>Previous Xinghalana Student Number</label>
      <input
        type="text"
        name="previousStudentNumber"
        value={formData.previousStudentNumber}
        onChange={handleInputChange}
        placeholder="If applicable"
      />
    </div>

    <div className="form-group">
      <label className="required">First name(s)</label>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
        placeholder="Enter your first name(s)"
        required
      />
    </div>

    <div className="form-group">
      <label className="required">Last/family name</label>
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
        placeholder="Enter your last name"
        required
      />
    </div>

    <div className="form-group">
      <label className="required">Select your gender</label>
      <select
        name="gender"
        value={formData.gender}
        onChange={handleInputChange}
        required
      >
        <option value="">Please select</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
        <option value="prefer-not-to-say">Prefer not to say</option>
      </select>
    </div>

    <div className="form-group">
      <label className="required">Date of birth</label>
      <div className="date-group">
        <select
          name="birthYear"
          value={formData.birthYear}
          onChange={handleInputChange}
          required
        >
          <option value="">Year (YYYY)</option>
          {Array.from({length: 50}, (_, i) => new Date().getFullYear() - 16 - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select
          name="birthMonth"
          value={formData.birthMonth}
          onChange={handleInputChange}
          required
        >
          <option value="">Month</option>
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
            <option key={month} value={index + 1}>{month}</option>
          ))}
        </select>
        <select
          name="birthDay"
          value={formData.birthDay}
          onChange={handleInputChange}
          required
        >
          <option value="">Day</option>
          {Array.from({length: 31}, (_, i) => i + 1).map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="form-group">
      <label className="required">Email address</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="your.email@example.com"
        required
      />
    </div>

    <div className="form-group">
      <label className="required">Cellular/mobile phone number</label>
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        placeholder="e.g. +27831234567"
        required
      />
    </div>

    <div className="form-group">
      <label className="required">Last year of High School (YYYY)</label>
      <select
        name="highSchoolYear"
        value={formData.highSchoolYear}
        onChange={handleInputChange}
        required
      >
        <option value="">Select year</option>
        {Array.from({length: 10}, (_, i) => new Date().getFullYear() - i).map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label className="required">Have you studied at a Tertiary Institution before?</label>
      <select
        name="studiedBefore"
        value={formData.studiedBefore}
        onChange={handleInputChange}
        required
      >
        <option value="">Please select</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>
  </>
);

const CaptchaSection = ({ captchaCode, refreshCaptcha }) => (
  <div className="captcha-container">
    <h3>Data capture verification challenge</h3>
    <p>Please verify you are human by entering the code below</p>
    <div className="captcha-box">
      {captchaCode}
    </div>
    <div className="captcha-controls">
      <input 
        type="text" 
        placeholder="Enter the code above" 
        className="captcha-input"
      />
      <button type="button" className="btn btn-secondary" onClick={refreshCaptcha}>
        <i className="fas fa-redo"></i>
        Reload Code
      </button>
    </div>
    <div className="captcha-note">
      <i className="fas fa-info-circle"></i>
      CAPTCHA verification servlet currently disabled check SOD CP/WZ on SMNT-12
    </div>
  </div>
);

const FeaturesSection = () => (
  <div className="features-section">
    <h2>Why Choose Xinghalana?</h2>
    <div className="features-grid">
      <div className="feature-card">
        <div className="feature-icon">
          <i className="fas fa-globe-africa"></i>
        </div>
        <h3>Global Recognition</h3>
        <p>Ranked among the top universities in Africa with international accreditation and partnerships.</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">
          <i className="fas fa-book-open"></i>
        </div>
        <h3>Diverse Programs</h3>
        <p>Choose from over 200 undergraduate and postgraduate programs across multiple disciplines.</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">
          <i className="fas fa-user-graduate"></i>
        </div>
        <h3>Student Support</h3>
        <p>Comprehensive support services including academic advising, counseling, and career guidance.</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">
          <i className="fas fa-laptop-house"></i>
        </div>
        <h3>Modern Facilities</h3>
        <p>State-of-the-art laboratories, libraries, and digital learning resources across all campuses.</p>
      </div>
    </div>
  </div>
);

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-section">
        <h4>Contact Information</h4>
        <p><i className="fas fa-phone"></i> +27 (0)31 260 1111</p>
        <p><i className="fas fa-envelope"></i> enquiries@xinghalana.ac.za</p>
        <p><i className="fas fa-map-marker-alt"></i> Xinghalana College</p>
      </div>
      <div className="footer-section">
        <h4>Quick Links</h4>
        <a href="#"><i className="fas fa-chevron-right"></i> Academic Programs</a>
        <a href="#"><i className="fas fa-chevron-right"></i> Admission Requirements</a>
        <a href="#"><i className="fas fa-chevron-right"></i> Fees & Funding</a>
        <a href="#"><i className="fas fa-chevron-right"></i> Campus Life</a>
      </div>
      <div className="footer-section">
        <h4>Support</h4>
        <a href="#"><i className="fas fa-chevron-right"></i> Application Help</a>
        <a href="#"><i className="fas fa-chevron-right"></i> Technical Support</a>
        <a href="#"><i className="fas fa-chevron-right"></i> FAQs</a>
        <a href="#"><i className="fas fa-chevron-right"></i> Contact Admissions</a>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2024 Xinghalana College. All rights reserved.</p>
    </div>
  </footer>
);

export default App;