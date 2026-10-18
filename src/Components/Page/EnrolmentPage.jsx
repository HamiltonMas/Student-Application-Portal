import React, { useState } from 'react';
import './EnrolmentPage.css';

const EnrolmentPage = ({ formData, onBack, onSubmit }) => {
  const [enrolmentData, setEnrolmentData] = useState({
    title: '',
    firstName: formData.firstName || 'Hamilton',
    initials: 'H',
    preferredName: 'Hamilton',
    lastName: formData.lastName || 'b',
    gender: formData.gender || 'Male',
    maritalStatus: '',
    birthYear: formData.birthYear || '2001',
    birthMonth: formData.birthMonth || '12',
    birthDay: formData.birthDay || '22',
    homeLanguage: '',
    ethnicGroup: '',
    country: 'SOUTH AFRICA',
    citizenship: 'R.S.A.',
    nationalId: formData.nationalId || '0112225529083',
    activityLastYear: '',
    schoolLeavingType: '',
    highSchoolYear: formData.highSchoolYear || '2021',
    mostRecentHighSchool: '',
    enterSchoolIfNotListed: '',
    previousStudentNumber: formData.previousStudentNumber || '',
    email: formData.email || 'masipahamilton6@gmail.com',
    mobilePhone: formData.phone || '+27729242639',
    homePhone: '',
    workPhone: '',
    faxNumber: '',
    postalAddress: '',
    postalCode: '',
    differentPhysicalAddress: false,
    
    // Physical address fields
    physicalStreet: '',
    physicalSuburb: '',
    physicalCity: '',
    physicalProvince: '',
    physicalPostalCode: '',
    
    // New educational fields
    schoolLeavingStatus: '',
    examNumber: '',
    completionYear: '',
    currentGrade: '',
    otherSituation: '',
    
    nextOfKin: [
      {
        name: '',
        relationship: '',
        mobilePhone: '',
        homePhone: '',
        workPhone: '',
        postalAddress: '',
        postalCode: ''
      }
    ]
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEnrolmentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    validateField(field, enrolmentData[field]);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'postalCode':
        if (value && !/^\d{4}$/.test(value)) {
          newErrors.postalCode = 'Postal code must be 4 digits';
        } else {
          delete newErrors.postalCode;
        }
        break;
      case 'physicalPostalCode':
        if (enrolmentData.differentPhysicalAddress && value && !/^\d{4}$/.test(value)) {
          newErrors.physicalPostalCode = 'Physical postal code must be 4 digits';
        } else {
          delete newErrors.physicalPostalCode;
        }
        break;
      case 'examNumber':
        if (enrolmentData.schoolLeavingStatus === 'completed' && !value) {
          newErrors.examNumber = 'Exam number is required for Grade 12 completers';
        } else {
          delete newErrors.examNumber;
        }
        break;
      case 'completionYear':
        if (enrolmentData.schoolLeavingStatus === 'completed' && !value) {
          newErrors.completionYear = 'Completion year is required';
        } else {
          delete newErrors.completionYear;
        }
        break;
      case 'currentGrade':
        if (enrolmentData.schoolLeavingStatus === 'current' && !value) {
          newErrors.currentGrade = 'Current grade is required';
        } else {
          delete newErrors.currentGrade;
        }
        break;
      case 'otherSituation':
        if (enrolmentData.schoolLeavingStatus === 'other' && !value) {
          newErrors.otherSituation = 'Please specify your educational situation';
        } else {
          delete newErrors.otherSituation;
        }
        break;
      case 'enterSchoolIfNotListed':
        if (enrolmentData.mostRecentHighSchool === 'other' && !value) {
          newErrors.enterSchoolIfNotListed = 'Please enter your school name';
        } else {
          delete newErrors.enterSchoolIfNotListed;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const handleNextOfKinChange = (index, field, value) => {
    const updatedNextOfKin = [...enrolmentData.nextOfKin];
    updatedNextOfKin[index] = {
      ...updatedNextOfKin[index],
      [field]: value
    };
    setEnrolmentData(prev => ({
      ...prev,
      nextOfKin: updatedNextOfKin
    }));
  };

  const addNextOfKin = () => {
    setEnrolmentData(prev => ({
      ...prev,
      nextOfKin: [
        ...prev.nextOfKin,
        {
          name: '',
          relationship: '',
          mobilePhone: '',
          homePhone: '',
          workPhone: '',
          postalAddress: '',
          postalCode: ''
        }
      ]
    }));
  };

  const removeNextOfKin = (index) => {
    if (enrolmentData.nextOfKin.length > 1) {
      const updatedNextOfKin = enrolmentData.nextOfKin.filter((_, i) => i !== index);
      setEnrolmentData(prev => ({
        ...prev,
        nextOfKin: updatedNextOfKin
      }));
    }
  };

  // Helper function to extract city from address (basic implementation)
  const extractCityFromAddress = (address) => {
    const cities = ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Kimberley', 'Polokwane', 'Nelspruit', 'Mbombela', 'Rustenburg', 'Pietermaritzburg'];
    for (let city of cities) {
      if (address.toLowerCase().includes(city.toLowerCase())) {
        return city;
      }
    }
    return '';
  };

  const copyPostalToPhysical = () => {
    setEnrolmentData(prev => ({
      ...prev,
      physicalStreet: prev.postalAddress,
      physicalCity: extractCityFromAddress(prev.postalAddress),
      physicalPostalCode: prev.postalCode
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = [
      'title', 'initials', 'lastName', 'maritalStatus', 'homeLanguage', 
      'ethnicGroup', 'activityLastYear', 'schoolLeavingType', 'postalCode',
      'schoolLeavingStatus'
    ];
    
    const missingFields = requiredFields.filter(field => !enrolmentData[field]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields marked with *');
      return;
    }

    // Validate educational section based on school leaving status
    const educationalErrors = [];
    
    if (enrolmentData.schoolLeavingStatus === 'completed') {
      if (!enrolmentData.examNumber) educationalErrors.push('Exam number is required for Grade 12 completers');
      if (!enrolmentData.completionYear) educationalErrors.push('Completion year is required');
    }
    
    if (enrolmentData.schoolLeavingStatus === 'current' && !enrolmentData.currentGrade) {
      educationalErrors.push('Current grade is required');
    }
    
    if (enrolmentData.schoolLeavingStatus === 'other' && !enrolmentData.otherSituation) {
      educationalErrors.push('Please specify your educational situation');
    }
    
    if (enrolmentData.mostRecentHighSchool === 'other' && !enrolmentData.enterSchoolIfNotListed) {
      educationalErrors.push('Please enter your school name');
    }
    
    if (educationalErrors.length > 0) {
      alert('Please complete all required educational information:\n' + educationalErrors.join('\n'));
      return;
    }

    // Validate physical address if different from postal
    if (enrolmentData.differentPhysicalAddress) {
      const physicalAddressErrors = [];
      
      if (!enrolmentData.physicalStreet) physicalAddressErrors.push('Physical street address is required');
      if (!enrolmentData.physicalCity) physicalAddressErrors.push('Physical city is required');
      if (!enrolmentData.physicalProvince) physicalAddressErrors.push('Physical province is required');
      if (!enrolmentData.physicalPostalCode) physicalAddressErrors.push('Physical postal code is required');
      
      if (physicalAddressErrors.length > 0) {
        alert('Please complete all required physical address fields:\n' + physicalAddressErrors.join('\n'));
        return;
      }
    }

    const invalidNextOfKin = enrolmentData.nextOfKin.some(kin => 
      !kin.name || !kin.relationship || !kin.mobilePhone
    );
    
    if (invalidNextOfKin) {
      alert('Please fill in all required next of kin information (Name, Relationship, and Mobile Phone)');
      return;
    }

    // Submit the data and continue to course selection
    onSubmit(enrolmentData);
  };

  return (
    <div className="enrolment-page">
      <div className="enrolment-container">
        <div className="enrolment-header">
          <div className="header-icon">
            <i className="fas fa-user-graduate"></i>
          </div>
          <div className="header-content">
            <h1>Application for Enrolment</h1>
            <p className="subtitle">
              Please complete the following biographical detail in order to begin processing your application to Xinghalana.
            </p>
            <div className="notice">
              <i className="fas fa-info-circle"></i>
              If you are a returning student please ignore mandatory fields on this page.
            </div>
          </div>
          <div className="application-badge">
            <span className="badge">Step 2: Enrolment</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Section title="Applicant Personal Information" icon="fas fa-user">
            <div className="form-grid">
              <FormGroup label="Title" required error={errors.title} touched={touched.title}>
                <select 
                  name="title" 
                  value={enrolmentData.title}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('title')}
                  required
                  className={errors.title && touched.title ? 'error' : ''}
                >
                  <option value="">--- Please select ---</option>
                  <option value="mr">Mr</option>
                  <option value="mrs">Mrs</option>
                  <option value="ms">Ms</option>
                  <option value="dr">Dr</option>
                  <option value="prof">Prof</option>
                </select>
              </FormGroup>

              <FormGroup label="First name(s)">
                <input 
                  type="text" 
                  value={enrolmentData.firstName}
                  readOnly
                  className="read-only"
                />
              </FormGroup>

              <FormGroup label="Initials" required error={errors.initials} touched={touched.initials}>
                <input 
                  type="text" 
                  name="initials"
                  value={enrolmentData.initials}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('initials')}
                  maxLength="5"
                  required
                  className={errors.initials && touched.initials ? 'error' : ''}
                />
              </FormGroup>

              <FormGroup label="Preferred name">
                <input 
                  type="text" 
                  name="preferredName"
                  value={enrolmentData.preferredName}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup label="Last/family name" required>
                <input 
                  type="text" 
                  value={enrolmentData.lastName}
                  readOnly
                  className="read-only"
                />
              </FormGroup>

              <FormGroup label="Select your gender">
                <input 
                  type="text" 
                  value={enrolmentData.gender}
                  readOnly
                  className="read-only"
                />
              </FormGroup>

              <FormGroup label="Marital status" required error={errors.maritalStatus} touched={touched.maritalStatus}>
                <select 
                  name="maritalStatus" 
                  value={enrolmentData.maritalStatus}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('maritalStatus')}
                  required
                  className={errors.maritalStatus && touched.maritalStatus ? 'error' : ''}
                >
                  <option value="">--- Please select ---</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </FormGroup>

              <FormGroup label="Date of birth">
                <div className="date-display">
                  {enrolmentData.birthYear} - {enrolmentData.birthMonth} - {enrolmentData.birthDay}
                </div>
              </FormGroup>

              <FormGroup label="Home language" required error={errors.homeLanguage} touched={touched.homeLanguage}>
                <select 
                  name="homeLanguage" 
                  value={enrolmentData.homeLanguage}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('homeLanguage')}
                  required
                  className={errors.homeLanguage && touched.homeLanguage ? 'error' : ''}
                >
                  <option value="">--- Please select ---</option>
                  <option value="english">English</option>
                  <option value="afrikaans">Afrikaans</option>
                  <option value="zulu">Zulu</option>
                  <option value="xhosa">Xhosa</option>
                  <option value="sotho">Sotho</option>
                  <option value="tswana">Tswana</option>
                </select>
              </FormGroup>

              <FormGroup label="Ethnic group" required error={errors.ethnicGroup} touched={touched.ethnicGroup}>
                <select 
                  name="ethnicGroup" 
                  value={enrolmentData.ethnicGroup}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('ethnicGroup')}
                  required
                  className={errors.ethnicGroup && touched.ethnicGroup ? 'error' : ''}
                >
                  <option value="">--- Please select ---</option>
                  <option value="black">Black</option>
                  <option value="white">White</option>
                  <option value="coloured">Coloured</option>
                  <option value="indian">Indian</option>
                  <option value="other">Other</option>
                </select>
              </FormGroup>

              <FormGroup label="Country of residence">
                <input 
                  type="text" 
                  value={enrolmentData.country}
                  readOnly
                  className="read-only"
                />
              </FormGroup>

              <FormGroup label="Select your citizenship">
                <input 
                  type="text" 
                  value={enrolmentData.citizenship}
                  readOnly
                  className="read-only"
                />
              </FormGroup>

              <FormGroup label="National ID number">
                <input 
                  type="text" 
                  value={enrolmentData.nationalId}
                  readOnly
                  className="read-only"
                />
              </FormGroup>

              <FormGroup label="Activity last year" required error={errors.activityLastYear} touched={touched.activityLastYear}>
                <select 
                  name="activityLastYear" 
                  value={enrolmentData.activityLastYear}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('activityLastYear')}
                  required
                  className={errors.activityLastYear && touched.activityLastYear ? 'error' : ''}
                >
                  <option value="">--- Please select ---</option>
                  <option value="studying">Studying</option>
                  <option value="working">Working</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="other">Other</option>
                </select>
              </FormGroup>

              <FormGroup label="School leaving type" required error={errors.schoolLeavingType} touched={touched.schoolLeavingType}>
                <select 
                  name="schoolLeavingType" 
                  value={enrolmentData.schoolLeavingType}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('schoolLeavingType')}
                  required
                  className={errors.schoolLeavingType && touched.schoolLeavingType ? 'error' : ''}
                >
                  <option value="">--- Please select ---</option>
                  <option value="matric">Matric</option>
                  <option value="equivalent">Equivalent Qualification</option>
                  <option value="other">Other</option>
                </select>
              </FormGroup>

              <FormGroup label="Last year of High School (YYYY)">
                <input 
                  type="text" 
                  value={enrolmentData.highSchoolYear}
                  readOnly
                  className="read-only"
                />
              </FormGroup>
            </div>
          </Section>

          <Section title="Educational Information" icon="fas fa-school">
            <div className="form-grid">
              {/* School Leaving Status */}
              <FormGroup label="School Leaving Status" required fullWidth error={errors.schoolLeavingStatus} touched={touched.schoolLeavingStatus}>
                <select 
                  name="schoolLeavingStatus" 
                  value={enrolmentData.schoolLeavingStatus}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('schoolLeavingStatus')}
                  required
                  className={errors.schoolLeavingStatus && touched.schoolLeavingStatus ? 'error' : ''}
                >
                  <option value="">--- Please select your status ---</option>
                  <option value="completed">I have completed Grade 12</option>
                  <option value="current">I am currently in Grade 12</option>
                  <option value="other">Other (Please specify)</option>
                </select>
              </FormGroup>

              {/* Conditional Fields based on School Leaving Status */}
              {enrolmentData.schoolLeavingStatus === 'completed' && (
                <>
                  <FormGroup label="Grade 12 Examination Number" required fullWidth error={errors.examNumber} touched={touched.examNumber}>
                    <input 
                      type="text" 
                      name="examNumber"
                      value={enrolmentData.examNumber}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('examNumber')}
                      placeholder="Enter your Grade 12 exam number"
                      required
                      className={errors.examNumber && touched.examNumber ? 'error' : ''}
                    />
                    <div className="help-text">
                      Please enter your official Grade 12 examination number as it appears on your certificate
                    </div>
                  </FormGroup>

                  <FormGroup label="Year of Grade 12 Completion" required error={errors.completionYear} touched={touched.completionYear}>
                    <select 
                      name="completionYear" 
                      value={enrolmentData.completionYear}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('completionYear')}
                      required
                      className={errors.completionYear && touched.completionYear ? 'error' : ''}
                    >
                      <option value="">--- Select year ---</option>
                      {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </FormGroup>
                </>
              )}

              {enrolmentData.schoolLeavingStatus === 'current' && (
                <FormGroup label="Current Grade" required fullWidth error={errors.currentGrade} touched={touched.currentGrade}>
                  <select 
                    name="currentGrade" 
                    value={enrolmentData.currentGrade}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('currentGrade')}
                    required
                    className={errors.currentGrade && touched.currentGrade ? 'error' : ''}
                  >
                    <option value="">--- Select your current grade ---</option>
                    <option value="grade12">Grade 12</option>
                    <option value="grade11">Grade 11</option>
                    <option value="grade10">Grade 10</option>
                  </select>
                  <div className="help-text">
                    Please select the grade you are currently completing
                  </div>
                </FormGroup>
              )}

              {enrolmentData.schoolLeavingStatus === 'other' && (
                <FormGroup label="Please specify your situation" required fullWidth error={errors.otherSituation} touched={touched.otherSituation}>
                  <textarea 
                    name="otherSituation"
                    value={enrolmentData.otherSituation}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('otherSituation')}
                    placeholder="Please describe your educational situation..."
                    rows="3"
                    required
                    className={errors.otherSituation && touched.otherSituation ? 'error' : ''}
                  />
                  <div className="help-text">
                    If you have not completed Grade 12 or are not currently in school, please provide details
                  </div>
                </FormGroup>
              )}

              {/* Most recent high school (now conditional) */}
              {enrolmentData.schoolLeavingStatus && enrolmentData.schoolLeavingStatus !== 'other' && (
                <FormGroup label="Most recent high school" fullWidth required error={errors.mostRecentHighSchool} touched={touched.mostRecentHighSchool}>
                  <select 
                    name="mostRecentHighSchool" 
                    value={enrolmentData.mostRecentHighSchool}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('mostRecentHighSchool')}
                    required
                    className={errors.mostRecentHighSchool && touched.mostRecentHighSchool ? 'error' : ''}
                  >
                    <option value="">--- Please select your school ---</option>
                    <option value="alexandra_high">Alexandra High School</option>
                    <option value="bishops">Bishops Diocesan College</option>
                    <option value="campbell">Campbell College</option>
                    <option value="durban_high">Durban High School</option>
                    <option value="grey_college">Grey College</option>
                    <option value="herschel">Herschel Girls' School</option>
                    <option value="jeppe_high">Jeppe High School for Boys</option>
                    <option value="kingswood">Kingswood College</option>
                    <option value="maritzburg">Maritzburg College</option>
                    <option value="parktown">Parktown High School for Girls</option>
                    <option value="rondebosch">Rondebosch Boys' High School</option>
                    <option value="st_marys">St Mary's School, Waverley</option>
                    <option value="wynberg">Wynberg Boys' High School</option>
                    <option value="other">My school is not listed</option>
                  </select>
                  <div className="help-text">
                    Select your most recent high school from the list
                  </div>
                </FormGroup>
              )}

              {/* Show this field only if "other" is selected for school */}
              {enrolmentData.mostRecentHighSchool === 'other' && (
                <FormGroup label="Enter your school name" required fullWidth error={errors.enterSchoolIfNotListed} touched={touched.enterSchoolIfNotListed}>
                  <input 
                    type="text" 
                    name="enterSchoolIfNotListed"
                    value={enrolmentData.enterSchoolIfNotListed}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('enterSchoolIfNotListed')}
                    placeholder="Enter your school's full name"
                    required
                    className={errors.enterSchoolIfNotListed && touched.enterSchoolIfNotListed ? 'error' : ''}
                  />
                  <div className="help-text">
                    Please enter the complete name of your high school
                  </div>
                </FormGroup>
              )}

              {/* Previous Student Number */}
              <FormGroup label="Previous Xinghalana Student Number" fullWidth>
                <input 
                  type="text" 
                  name="previousStudentNumber"
                  value={enrolmentData.previousStudentNumber}
                  onChange={handleInputChange}
                  placeholder="If applicable"
                />
                <div className="help-text">
                  Only fill this if you have previously studied at Xinghalana
                </div>
              </FormGroup>
            </div>
          </Section>

          <Section title="Applicant Contact Information" icon="fas fa-address-book">
            <div className="form-grid">
              <FormGroup label="Email address">
                <input 
                  type="email" 
                  value={enrolmentData.email}
                  readOnly
                  className="read-only"
                />
              </FormGroup>

              <FormGroup label="Cellular/mobile phone number" required>
                <input 
                  type="tel" 
                  value={enrolmentData.mobilePhone}
                  readOnly
                  className="read-only"
                />
                <div className="help-text">e.g. +27831234567 *</div>
              </FormGroup>

              <FormGroup label="Home phone number">
                <input 
                  type="tel" 
                  name="homePhone"
                  value={enrolmentData.homePhone}
                  onChange={handleInputChange}
                  placeholder="+27..."
                />
              </FormGroup>

              <FormGroup label="Work phone number">
                <input 
                  type="tel" 
                  name="workPhone"
                  value={enrolmentData.workPhone}
                  onChange={handleInputChange}
                  placeholder="+27..."
                />
              </FormGroup>

              <FormGroup label="Fax number">
                <input 
                  type="tel" 
                  name="faxNumber"
                  value={enrolmentData.faxNumber}
                  onChange={handleInputChange}
                  placeholder="+27..."
                />
              </FormGroup>
            </div>
          </Section>

          <Section title="Applicant Address Information" icon="fas fa-map-marker-alt">
            <div className="form-grid">
              {/* Postal Address */}
              <FormGroup label="Postal Address" fullWidth required error={errors.postalAddress} touched={touched.postalAddress}>
                <textarea 
                  name="postalAddress"
                  value={enrolmentData.postalAddress}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('postalAddress')}
                  placeholder="Enter your complete postal address"
                  rows="3"
                  required
                  className={errors.postalAddress && touched.postalAddress ? 'error' : ''}
                />
              </FormGroup>

              <FormGroup label="Postal Code" required error={errors.postalCode} touched={touched.postalCode}>
                <input 
                  type="text" 
                  name="postalCode"
                  value={enrolmentData.postalCode}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('postalCode')}
                  placeholder="Enter postal code"
                  required
                  className={errors.postalCode && touched.postalCode ? 'error' : ''}
                />
                <div className="help-text">
                  If the relevant postal code cannot be found, use the postal code "0000"
                </div>
              </FormGroup>

              {/* Different Physical Address Checkbox */}
              <FormGroup fullWidth>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="differentPhysicalAddress"
                    checked={enrolmentData.differentPhysicalAddress}
                    onChange={handleInputChange}
                  />
                  If your physical/residential address differs from postal address, please tick here
                </label>
              </FormGroup>

              {/* Physical Address Fields - Conditionally Shown */}
              {enrolmentData.differentPhysicalAddress && (
                <div className="physical-address-section conditional-section">
                  <div className="section-subheader">
                    <i className="fas fa-home"></i>
                    <h3>Physical/Residential Address</h3>
                  </div>
                  
                  <div className="form-grid">
                    <FormGroup label="Street Address" fullWidth required>
                      <input 
                        type="text" 
                        name="physicalStreet"
                        value={enrolmentData.physicalStreet}
                        onChange={handleInputChange}
                        placeholder="Enter street number and name"
                        required
                      />
                    </FormGroup>

                    <FormGroup label="Suburb">
                      <input 
                        type="text" 
                        name="physicalSuburb"
                        value={enrolmentData.physicalSuburb}
                        onChange={handleInputChange}
                        placeholder="Enter suburb"
                      />
                    </FormGroup>

                    <FormGroup label="City/Town" required>
                      <input 
                        type="text" 
                        name="physicalCity"
                        value={enrolmentData.physicalCity}
                        onChange={handleInputChange}
                        placeholder="Enter city or town"
                        required
                      />
                    </FormGroup>

                    <FormGroup label="Province" required>
                      <select 
                        name="physicalProvince" 
                        value={enrolmentData.physicalProvince}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">--- Select Province ---</option>
                        <option value="eastern_cape">Eastern Cape</option>
                        <option value="free_state">Free State</option>
                        <option value="gauteng">Gauteng</option>
                        <option value="kzn">KwaZulu-Natal</option>
                        <option value="limpopo">Limpopo</option>
                        <option value="mpumalanga">Mpumalanga</option>
                        <option value="north_west">North West</option>
                        <option value="northern_cape">Northern Cape</option>
                        <option value="western_cape">Western Cape</option>
                      </select>
                    </FormGroup>

                    <FormGroup label="Postal Code" required error={errors.physicalPostalCode} touched={touched.physicalPostalCode}>
                      <input 
                        type="text" 
                        name="physicalPostalCode"
                        value={enrolmentData.physicalPostalCode}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('physicalPostalCode')}
                        placeholder="Enter postal code"
                        required
                        className={errors.physicalPostalCode && touched.physicalPostalCode ? 'error' : ''}
                      />
                      <div className="help-text">
                        Postal code for your physical address
                      </div>
                    </FormGroup>

                    <FormGroup label="Country">
                      <input 
                        type="text" 
                        value="SOUTH AFRICA"
                        readOnly
                        className="read-only"
                      />
                    </FormGroup>

                    {/* Same as Postal Address Button */}
                    <FormGroup fullWidth>
                      <button 
                        type="button" 
                        className="btn-copy-address"
                        onClick={copyPostalToPhysical}
                      >
                        <i className="fas fa-copy"></i>
                        Use Same as Postal Address
                      </button>
                    </FormGroup>
                  </div>
                </div>
              )}
            </div>
          </Section>

          <Section title="Next of Kin Personal and Contact Information" icon="fas fa-users">
            {enrolmentData.nextOfKin.map((kin, index) => (
              <div key={index} className="next-of-kin-section">
                <div className="section-header">
                  <h4>Next of Kin {enrolmentData.nextOfKin.length > 1 ? index + 1 : ''}</h4>
                  {enrolmentData.nextOfKin.length > 1 && (
                    <button 
                      type="button" 
                      className="btn-remove"
                      onClick={() => removeNextOfKin(index)}
                    >
                      <i className="fas fa-times"></i>
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="form-grid">
                  <FormGroup label="Next of kin's name(s)" required>
                    <input 
                      type="text" 
                      value={kin.name}
                      onChange={(e) => handleNextOfKinChange(index, 'name', e.target.value)}
                      placeholder="Full name"
                      required
                    />
                  </FormGroup>

                  <FormGroup label="Next of Kin relationship" required>
                    <select 
                      value={kin.relationship}
                      onChange={(e) => handleNextOfKinChange(index, 'relationship', e.target.value)}
                      required
                    >
                      <option value="">--- Please select ---</option>
                      <option value="parent">Parent</option>
                      <option value="spouse">Spouse</option>
                      <option value="sibling">Sibling</option>
                      <option value="child">Child</option>
                      <option value="other">Other</option>
                    </select>
                  </FormGroup>

                  <FormGroup label="Next of kin's mobile/cellular phone number" required>
                    <input 
                      type="tel" 
                      value={kin.mobilePhone}
                      onChange={(e) => handleNextOfKinChange(index, 'mobilePhone', e.target.value)}
                      placeholder="+27..."
                      required
                    />
                  </FormGroup>

                  <FormGroup label="Next of kin's home phone number">
                    <input 
                      type="tel" 
                      value={kin.homePhone}
                      onChange={(e) => handleNextOfKinChange(index, 'homePhone', e.target.value)}
                      placeholder="+27..."
                    />
                  </FormGroup>

                  <FormGroup label="Next of kin's work phone number">
                    <input 
                      type="tel" 
                      value={kin.workPhone}
                      onChange={(e) => handleNextOfKinChange(index, 'workPhone', e.target.value)}
                      placeholder="+27..."
                    />
                  </FormGroup>

                  <FormGroup label="Postal address" fullWidth>
                    <textarea 
                      value={kin.postalAddress}
                      onChange={(e) => handleNextOfKinChange(index, 'postalAddress', e.target.value)}
                      placeholder="Next of kin's postal address"
                      rows="2"
                    />
                  </FormGroup>

                  <FormGroup label="Postal Code">
                    <input 
                      type="text" 
                      value={kin.postalCode}
                      onChange={(e) => handleNextOfKinChange(index, 'postalCode', e.target.value)}
                      placeholder="Postal code"
                    />
                    <div className="help-text">
                      If the relevant postal code cannot be found, use the postal code "0000"
                    </div>
                  </FormGroup>
                </div>
              </div>
            ))}

            <button type="button" className="btn-add-kin" onClick={addNextOfKin}>
              <i className="fas fa-plus"></i>
              Add Another Next of Kin
            </button>
          </Section>

          <div className="enrolment-actions">
            <button type="button" onClick={onBack} className="btn btn-back">
              <i className="fas fa-arrow-left"></i>
              Back to Confirmation
            </button>
            <button type="submit" className="btn btn-primary">
              Continue to Course Selection
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Section = ({ title, icon, children }) => (
  <div className="enrolment-section">
    <div className="section-header">
      <i className={icon}></i>
      <h2>{title}</h2>
    </div>
    <div className="section-content">
      {children}
    </div>
  </div>
);

const FormGroup = ({ label, children, required, fullWidth, helpText, error, touched }) => (
  <div className={`form-group ${fullWidth ? 'full-width' : ''} ${error && touched ? 'error' : ''}`}>
    {label && (
      <label>
        {label}
        {required && <span className="required"> *</span>}
      </label>
    )}
    {children}
    {helpText && <div className="help-text">{helpText}</div>}
    {error && touched && <div className="error-message">{error}</div>}
  </div>
);

export default EnrolmentPage;