import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PatientSignup2 = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const step1Data = JSON.parse(sessionStorage.getItem('patientSignupStep1'));

      // Properly mapped fields to match backend `UserPatient` entity
      const patientData = {
        lastname: step1Data.lastName,
        firstname: step1Data.firstName,
        middlename: step1Data.middleName,
        birthdate: step1Data.birthDate,
        gender: step1Data.gender,
        contactNumber: step1Data.contactNumber,
        emailAddress: step1Data.email,
        homeAddress: step1Data.address,
        username: formData.username,
        password: formData.password
      };
      

      const response = await fetch('http://localhost:8080/api/user-patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
      
      const responseText = await response.text(); // Always read as text first
      
      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const errorJson = responseText ? JSON.parse(responseText) : {};
          errorMessage = errorJson.message || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage; // Fallback to raw text
        }
        throw new Error(errorMessage);
      }

      sessionStorage.removeItem('patientSignupStep1');
      navigate('/login', {
        state: {
          registrationSuccess: true,
          message: 'Registration successful! Please log in.'
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">MediFlow</Link>
          <div className="space-x-4">
            <Link to="/login" className="hover:text-gray-300">Login</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Create Account</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                name="username"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <Link
                to="/patient-signup-1"
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back
              </Link>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition duration-200 disabled:bg-blue-400"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientSignup2;
