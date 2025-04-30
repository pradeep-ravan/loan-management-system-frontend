import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import LoanDetails from './pages/LoanDetails';
import LedgerView from './pages/LedgerView';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/loan-details" element={<LoanDetails />} />
        <Route path="/ledger" element={<LedgerView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;