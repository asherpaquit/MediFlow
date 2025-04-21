import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import SignupPage from './components/signuppage';
import PatientSignup1 from './pages/patientsignup1';
import PatientSignup2 from './pages/patientsignup2';
import LandingPage from './pages/landingpage';
import DoctorSignup1 from './pages/doctorsignup1';
import DoctorSignup2 from './pages/doctorsignup2';
import PatientDashboard from './pages/PatientDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLogin from './pages/adminlogin';
import AdminSignup from './pages/adminSignup';
import DoctorsDashboard from './pages/DoctorsDashboard';
import DoctorLogin from './pages/DoctorLogin';
import AdminDashboard from './pages/AdminDashboard';

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
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor-dashboard" element={<DoctorsDashboard />} />
        <Route path="/admin-dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
      </Routes>
    </Router>
  );
}
export default App;