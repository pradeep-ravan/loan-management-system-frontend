export const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name should be at least 2 characters";
    return "";
  };
  
  export const validateDOB = (dob) => {
    if (!dob) return "Date of Birth is required";
    
    const dobDate = new Date(dob);
    const today = new Date();
    
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    
    if (age < 18) return "You must be at least 18 years old";
    if (age > 100) return "Please enter a valid date of birth";
    
    return "";
  };
  
  export const validatePAN = (pan) => {
    if (!pan) return "PAN is required";
    
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan)) return "Invalid PAN format. It should be like ABCDE1234F";
    
    return "";
  };
  
  export const validateAadhar = (aadhar) => {
    if (!aadhar) return "Aadhar number is required";
    
    const aadharRegex = /^[0-9]{12}$/;
    if (!aadharRegex.test(aadhar)) return "Invalid Aadhar format. It should be 12 digits";
    
    return "";
  };
  
  export const validateGSTIN = (gstin) => {
    if (!gstin) return "GSTIN is required";
    
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstinRegex.test(gstin)) return "Invalid GSTIN format";
    
    return "";
  };
  
  export const validateUDYAM = (udyam) => {
    if (!udyam) return "UDYAM registration number is required";
    
    const udyamRegex = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/;
    if (!udyamRegex.test(udyam)) return "Invalid UDYAM format. It should be like UDYAM-XX-XX-XXXXXXX";
    
    return "";
  };
  
  export const validateOnboardingFields = (formData) => {
    const errors = {};
    
    const nameError = validateName(formData.name);
    if (nameError) errors.name = nameError;
    
    const dobError = validateDOB(formData.dob);
    if (dobError) errors.dob = dobError;
    
    const panError = validatePAN(formData.pan);
    if (panError) errors.pan = panError;
    
    const aadharError = validateAadhar(formData.aadhar);
    if (aadharError) errors.aadhar = aadharError;
    
    const gstinError = validateGSTIN(formData.gstin);
    if (gstinError) errors.gstin = gstinError;
    
    const udyamError = validateUDYAM(formData.udyam);
    if (udyamError) errors.udyam = udyamError;
    
    return errors;
  };
  
  export const validateLoanAmount = (amount) => {
    if (!amount) return "Loan amount is required";
    if (isNaN(amount) || parseFloat(amount) <= 0) return "Please enter a valid loan amount";
    return "";
  };
  
  export const validateInterestRate = (rate) => {
    if (!rate) return "Interest rate is required";
    if (isNaN(rate) || parseFloat(rate) <= 0 || parseFloat(rate) > 100) 
      return "Please enter a valid interest rate between 0 and 100";
    return "";
  };
  
  export const validateTenure = (tenure) => {
    if (!tenure) return "Tenure is required";
    if (isNaN(tenure) || parseInt(tenure) <= 0) 
      return "Please enter a valid tenure";
    return "";
  };
  
  export const validateDisbursementDate = (date) => {
    if (!date) return "Disbursement date is required";
    return "";
  };
  
  export const validateRepaymentDates = (dates, disbursementDate) => {
    if (!dates || dates.length === 0) return "At least one repayment date is required";
    
    const disbursement = new Date(disbursementDate);
    
    for (const date of dates) {
      const repayment = new Date(date);
      if (repayment <= disbursement) {
        return "Repayment dates must be after the disbursement date";
      }
    }
    
    return "";
  };