import React from 'react';
import { Link } from 'react-router-dom';

const DoctorSignup1 = () => {
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
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Doctor Registration - Professional Information</h1>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Medical License Number</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Specialization</label>
                <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Specialization</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="orthopedics">Orthopedics</option>
                  <option value="general">General Practice</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Years of Experience</label>
                <input 
                  type="number" 
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Affiliated Hospital Status</label>
                <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Status</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="visiting">Visiting</option>
                  <option value="consultant">Consultant</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Consultation Fee (USD)</label>
                <input 
                  type="number" 
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Base Salary (USD)</label>
                <input 
                  type="number" 
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Link to="/signup" className="text-blue-600 hover:text-blue-800">
                ← Back to Signup Options
              </Link>
              <Link 
                to="/doctor-signup-2" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition duration-200"
              >
                Next
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignup1;