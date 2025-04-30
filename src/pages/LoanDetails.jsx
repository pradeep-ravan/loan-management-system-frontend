import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { 
  validateLoanAmount, 
  validateInterestRate, 
  validateTenure, 
  validateDisbursementDate, 
  validateRepaymentDates 
} from '../utils/validation';
import { createLoan } from '../utils/apiService';

const LoanDetails = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    disbursementDate: '',
    loanAmount: '',
    interestRate: '',
    tenure: '',
    repaymentDates: ['']
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userDetails = localStorage.getItem('userDetails');
    
    if (!userId) {
      alert('Please complete your personal details first');
      navigate('/');
      return;
    }
    
    if (userDetails) {
      setUserData(JSON.parse(userDetails));
    }
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleRepaymentDateChange = (index, value) => {
    const newDates = [...formData.repaymentDates];
    newDates[index] = value;
    
    setFormData(prev => ({
      ...prev,
      repaymentDates: newDates
    }));
    
    if (errors?.repaymentDates) {
      setErrors(prev => ({
        ...prev,
        repaymentDates: ''
      }));
    }
  };
  
  const addRepaymentDate = () => {
    setFormData(prev => ({
      ...prev,
      repaymentDates: [...prev.repaymentDates, '']
    }));
  };
  
  const removeRepaymentDate = (index) => {
    if (formData?.repaymentDates?.length > 1) {
      const newDates = [...formData.repaymentDates];
      newDates?.splice(index, 1);
      
      setFormData(prev => ({
        ...prev,
        repaymentDates: newDates
      }));
    }
  };
  
  const validateForm = () => {
    const validationErrors = {};
    
    const loanAmountError = validateLoanAmount(formData?.loanAmount);
    if (loanAmountError) validationErrors?.loanAmount = loanAmountError;
    
    const interestRateError = validateInterestRate(formData?.interestRate);
    if (interestRateError) validationErrors?.interestRate = interestRateError;
    
    const tenureError = validateTenure(formData.tenure);
    if (tenureError) validationErrors?.tenure = tenureError;
    
    const disbursementDateError = validateDisbursementDate(formData?.disbursementDate);
    if (disbursementDateError) validationErrors?.disbursementDate = disbursementDateError;
    
    const filteredDates = formData?.repaymentDates?.filter(date => date?.trim() !== '');
    const repaymentDatesError = validateRepaymentDates(filteredDates, formData?.disbursementDate);
    if (repaymentDatesError) validationErrors?.repaymentDates = repaymentDatesError;
    
    return validationErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors)?.length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('User not found. Please complete your personal details first.');
      }
      
      const cleanedData = {
        ...formData,
        userId,
        repaymentDates: formData?.repaymentDates?.filter(date => date?.trim() !== '')
      };
      
      const response = await createLoan(cleanedData);
      
      localStorage.setItem('loanId', response.data._id);
      localStorage.setItem('loanDetails', JSON.stringify(response.data));
      
      navigate('/ledger');
    } catch (error) {
      console.error('Error submitting form:', error);
      
      if (error.message) {
        setErrors(prev => ({
          ...prev,
          api: Array.isArray(error.message) ? error.message.join(', ') : error.message
        }));
      } else {
        alert('There was an error submitting loan details. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const calculateEstimatedEMI = () => {
    const loanAmount = parseFloat(formData?.loanAmount);
    const interestRate = parseFloat(formData?.interestRate);
    const tenure = parseInt(formData?.tenure);
    
    if (!loanAmount || !interestRate || !tenure) {
      return null;
    }
    
    const monthlyRate = interestRate / 12 / 100;
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    
    return Math.round(emi * 100) / 100;
  };
  
  const estimatedEMI = calculateEstimatedEMI();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full mx-auto space-y-8">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-indigo-600 px-6 py-8 text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Loan Details
            </h2>
            <p className="mt-2 text-sm text-indigo-200">
              Please provide your loan requirements
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-full h-8 w-8 flex items-center justify-center bg-green-500 text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Personal Details</p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-full h-8 w-8 flex items-center justify-center bg-indigo-600 text-white font-bold">
                    2
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Loan Details</p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-full h-8 w-8 flex items-center justify-center bg-gray-300 text-gray-600 font-bold">
                    3
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Loan Schedule</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* User Summary */}
          {userData && (
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 h-10 w-10 flex items-center justify-center text-blue-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-blue-900">Applicant: {userData?.name}</h3>
                  <p className="text-sm text-blue-700">PAN: {userData?.pan}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Form Section */}
          <div className="px-6 py-6">
            {errors.api && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors?.api}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Loan Information</h3>
                  <p className="text-sm text-gray-500 mb-2">Enter the basic loan parameters</p>
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <FormInput
                    label="Disbursement Date"
                    name="disbursementDate"
                    type="date"
                    value={formData?.disbursementDate}
                    onChange={handleChange}
                    error={errors?.disbursementDate}
                    required
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <FormInput
                    label="Loan Amount (₹)"
                    name="loanAmount"
                    type="number"
                    value={formData?.loanAmount}
                    onChange={handleChange}
                    error={errors?.loanAmount}
                    placeholder="Enter loan amount"
                    min="1000"
                    required
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <FormInput
                    label="Interest Rate (% per annum)"
                    name="interestRate"
                    type="number"
                    value={formData?.interestRate}
                    onChange={handleChange}
                    error={errors?.interestRate}
                    placeholder="Enter interest rate"
                    min="0.1"
                    max="100"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <FormInput
                    label="Tenure (in months)"
                    name="tenure"
                    type="number"
                    value={formData?.tenure}
                    onChange={handleChange}
                    error={errors?.tenure}
                    placeholder="Enter loan tenure in months"
                    min="1"
                    required
                  />
                </div>
                
                {/* EMI Preview */}
                {estimatedEMI && (
                  <div className="col-span-2 bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-green-800">Estimated Monthly EMI</p>
                        <p className="text-xs text-green-600">Based on entered values</p>
                      </div>
                      <div className="text-xl font-bold text-green-700">
                        ₹{estimatedEMI?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Repayment Schedule</h3>
                  <p className="text-sm text-gray-500 mb-2">Add one or more repayment dates</p>
                </div>
                
                <div className="col-span-2">
                  <div className="space-y-3">
                    {formData?.repaymentDates?.map((date, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="flex-grow">
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => handleRepaymentDateChange(index, e.target.value)}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md shadow-sm"
                            min={formData?.disbursementDate || undefined}
                            required
                          />
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeRepaymentDate(index)}
                          disabled={formData?.repaymentDates?.length <= 1}
                          className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 transition-colors duration-200"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    
                    {errors?.repaymentDates && (
                      <p className="mt-1 text-sm text-red-600">{errors?.repaymentDates}</p>
                    )}
                    
                    <button
                      type="button"
                      onClick={addRepaymentDate}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                      <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Another Repayment Date
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Back
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors duration-200 ease-in-out flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : 'Calculate EMI Schedule'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Footer with tips */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tips:</h4>
            <ul className="text-xs text-gray-500 space-y-1 pl-5 list-disc">
              <li>Higher loan tenures reduce EMI but increase total interest payment</li>
              <li>You can add multiple repayment dates for flexible payment options</li>
              <li>Disbursement date must be before any repayment date</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;