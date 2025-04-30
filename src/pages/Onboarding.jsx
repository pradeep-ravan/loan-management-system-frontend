import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { validateOnboardingFields } from '../utils/validation';
import { createUser } from '../utils/apiService';

const Onboarding = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    pan: '',
    aadhar: '',
    gstin: '',
    udyam: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const validationErrors = validateOnboardingFields(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await createUser(formData);
      
      localStorage.setItem('userId', response?.data._id);
      localStorage.setItem('userDetails', JSON.stringify(response?.data));
      
      navigate('/loan-details');
    } catch (error) {
      console.error('Error submitting form:', error);
      
      if (error.message) {
        setErrors(prev => ({
          ...prev,
          api: Array.isArray(error.message) ? error.message.join(', ') : error.message
        }));
      } else {
        alert('There was an error submitting your details. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full mx-auto space-y-8">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-indigo-600 px-6 py-8 text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Loan Management System
            </h2>
            <p className="mt-2 text-sm text-indigo-200">
              Please provide your details to get started with your loan application
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-full h-8 w-8 flex items-center justify-center bg-indigo-600 text-white font-bold">
                    1
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Personal Details</p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-full h-8 w-8 flex items-center justify-center bg-gray-300 text-gray-600 font-bold">
                    2
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Loan Details</p>
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
                    <p className="text-sm text-red-700">
                      {errors?.api}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h3>
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <FormInput
                    label="Full Name"
                    name="name"
                    value={formData?.name}
                    onChange={handleChange}
                    error={errors?.name}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <FormInput
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    value={formData?.dob}
                    onChange={handleChange}
                    error={errors?.dob}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Identity Documents</h3>
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <FormInput
                    label="PAN Number"
                    name="pan"
                    value={formData?.pan?.toUpperCase()}
                    onChange={handleChange}
                    error={errors?.pan}
                    placeholder="ABCDE1234F"
                    required
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <FormInput
                    label="Aadhar Number"
                    name="aadhar"
                    value={formData?.aadhar}
                    onChange={handleChange}
                    error={errors?.aadhar}
                    placeholder="123456789012"
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Business Information</h3>
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <FormInput
                    label="GSTIN"
                    name="gstin"
                    value={formData?.gstin?.toUpperCase()}
                    onChange={handleChange}
                    error={errors?.gstin}
                    placeholder="22AAAAA0000A1Z5"
                    required
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <FormInput
                    label="UDYAM Registration Number"
                    name="udyam"
                    value={formData?.udyam?.toUpperCase()} 
                    onChange={handleChange}
                    error={errors?.udyam}
                    placeholder="UDYAM-XX-XX-XXXXXXX"
                    required
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors duration-200 ease-in-out"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : 'Continue to Loan Details'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 text-right text-xs text-gray-500 italic">
            All your information is secured with bank-grade encryption
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;