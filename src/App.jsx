import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import SignupPage from './pages/signuppage';
import PatientSignup1 from './pages/patientsignup1';
import PatientSignup2 from './pages/patientsignup2';
import LandingPage from './pages/landingpage';
import DoctorSignup1 from './pages/doctorsignup1';
import DoctorSignup2 from './pages/doctorsignup2';
import PatientDashboard from './pages/PatientDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/patient-signup-1" element={<PatientSignup1 />} />
        <Route path="/patient-signup-2" element={<PatientSignup2 />} />
        <Route path="/doctor-signup-1" element={<DoctorSignup1 />} />
        <Route path="/doctor-signup-2" element={<DoctorSignup2 />} /> 
        <Route path="/patient-dashboard" element={<ProtectedRoute><PatientDashboard /> </ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
export default App;