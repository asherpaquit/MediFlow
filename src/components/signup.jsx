import React from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80 text-center">
        <img src="/logo.png" alt="Logo" className="w-32 mx-auto mb-6" />
        <p className="text-lg mb-6 font-medium">Signup As Doctor or Patient</p>
        
        <button 
          onClick={() => navigate('/patient-signup-1')} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded mb-3 transition duration-200"
        >
          Patient
        </button>
        
        <button 
          onClick={() => navigate('/doctor-signup-1')} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded mb-4 transition duration-200"
        >
          Doctor
        </button>
        
        <a 
          href="/login" 
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Already have an account? Click here to login!
        </a>
      </div>
    </div>
  );
};

export default Signup;