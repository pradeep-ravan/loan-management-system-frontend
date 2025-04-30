import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoanById, downloadLoanLedgerCSV, getUserById } from '../utils/apiService';

const LedgerView = () => {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [loanData, setLoanData] = useState(null);
  const [nextEMI, setNextEMI] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const loanId = localStorage.getItem('loanId');
        
        if (!userId || !loanId) {
          alert('Please complete your personal and loan details first');
          navigate('/');
          return;
        }
        
        // Use apiService to fetch data from backend
        const [userResponse, loanResponse] = await Promise.all([
          getUserById(userId),
          getLoanById(loanId)
        ]);
        
        setUserData(userResponse.data);
        setLoanData(loanResponse.data);
        
        // Find the next upcoming EMI
        const nextEmi = getNextEMIDate(loanResponse.data.emiSchedule);
        setNextEMI(nextEmi);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('There was an error loading the loan data. Please try again.');
        navigate('/loan-details');
      }
    };
    
    fetchData();
  }, [navigate]);
  
  // Helper function to get the next EMI date
  const getNextEMIDate = (schedule) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const payment of schedule) {
      const paymentDate = new Date(payment.paymentDate);
      if (paymentDate >= today && !payment.isPaid) {
        return payment;
      }
    }
    
    return null; // All EMIs are in the past or are paid
  };
  
  const handleDownloadCSV = async () => {
    try {
      const loanId = localStorage.getItem('loanId');
      
      // Use apiService to download CSV from backend
      await downloadLoanLedgerCSV(loanId);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('There was an error downloading the CSV. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-3 text-gray-700">Loading EMI details...</span>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 py-6 px-6">
            <div className="flex items-center justify-between flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-white">Loan Ledger</h1>
                <p className="text-indigo-100">Loan details and EMI schedule</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleDownloadCSV}
                  className="bg-white text-indigo-700 px-4 py-2 rounded-md shadow-sm font-medium hover:bg-indigo-50"
                >
                  Download as CSV
                </button>
                <button
                  onClick={() => navigate('/loan-details')}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-md shadow-sm font-medium hover:bg-indigo-400"
                >
                  Edit Loan Details
                </button>
              </div>
            </div>
          </div>
          
          {/* Loan Summary */}
          <div className="px-6 py-4 border-b">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-lg font-medium">Borrower Details</h3>
                <p className="text-gray-600">Name: {userData.name}</p>
                <p className="text-gray-600">PAN: {userData.pan}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Loan Details</h3>
                <p className="text-gray-600">Principal: ₹{parseFloat(loanData.loanAmount).toLocaleString()}</p>
                <p className="text-gray-600">Interest Rate: {loanData.interestRate}% p.a.</p>
                <p className="text-gray-600">Tenure: {loanData.tenure} months</p>
              </div>
              <div>
                <h3 className="text-lg font-medium">EMI Information</h3>
                <p className="text-gray-600">EMI Amount: ₹{loanData.emiSchedule[0]?.emi.toLocaleString()}</p>
                <div className="mt-2">
                  {nextEMI ? (
                    <div className="bg-yellow-50 p-2 rounded-md border border-yellow-200">
                      <p className="text-sm font-medium text-yellow-800">Next EMI Due:</p>
                      <p className="text-yellow-800 font-bold">{new Date(nextEMI.paymentDate).toLocaleDateString()}</p>
                      <p className="text-sm text-yellow-700">₹{nextEMI.emi.toLocaleString()}</p>
                    </div>
                  ) : (
                    <p className="text-green-600 font-medium">All EMIs completed!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* EMI Schedule Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EMI
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Principal
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loanData.emiSchedule.map((payment) => {
                  const isNextPayment = nextEMI && payment.paymentNumber === nextEMI.paymentNumber;
                  const isPastPayment = new Date(payment.paymentDate) < new Date() && 
                                        (!nextEMI || payment.paymentNumber < nextEMI.paymentNumber);
                  
                  return (
                    <tr 
                      key={payment.paymentNumber}
                      className={`
                        ${isNextPayment ? 'bg-yellow-50' : ''}
                        ${payment.isPaid ? 'bg-green-50' : ''}
                        ${isPastPayment && !payment.isPaid ? 'bg-red-50' : ''}
                      `}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {payment.paymentNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        ₹{payment.emi.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        ₹{payment.principalPayment.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        ₹{payment.interestPayment.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        ₹{payment.remainingPrincipal.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.isPaid 
                            ? 'bg-green-100 text-green-800' 
                            : isNextPayment 
                              ? 'bg-yellow-100 text-yellow-800'
                              : isPastPayment
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.isPaid 
                            ? 'Paid' 
                            : isNextPayment 
                              ? 'Upcoming'
                              : isPastPayment
                                ? 'Overdue'
                                : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LedgerView;