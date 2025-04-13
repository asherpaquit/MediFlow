import React from 'react';
import { Link } from 'react-router-dom';

const DoctorSignup2 = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">MEDI FLOW</div>
          <div className="hidden md:flex space-x-6">
            <Link to="/about" className="hover:text-blue-300">About</Link>
            <Link to="/contracts" className="hover:text-blue-300">Contracts</Link>
            <Link to="/" className="hover:text-blue-300">Home</Link>
            <Link to="/support" className="hover:text-blue-300">Support</Link>
          </div>
          <button className="md:hidden text-2xl">☰</button>
        </div>
      </nav>

      {/* Form Container */}
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Complete Your Doctor Account</h1>
          
          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Username</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters with at least 1 number and 1 special character</p>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <input 
                type="password" 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Task Number (if applicable)</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <Link 
                to="/doctor-signup-1" 
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back
              </Link>
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition duration-200"
              >
                Complete Registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignup2;