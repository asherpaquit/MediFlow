import React from 'react';
import { Link } from 'react-router-dom';

const PatientSignup1 = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">MEDIFLOW</div>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-blue-300">About</a>
            <a href="#" className="hover:text-blue-300">Contacts</a>
            <a href="#" className="hover:text-blue-300">Home</a>
            <a href="#" className="hover:text-blue-300">Support</a>
          </div>
          <button className="md:hidden text-2xl">☰</button>
        </div>
      </nav>

      {/* Form Container */}
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Patient Registration</h1>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Last Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">First Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Middle Initial</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength="1"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Birthdate</label>
                <input 
                  type="date" 
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="dd/mm/yyyy"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Gender</label>
                <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Contact Number</label>
                <input 
                  type="tel" 
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Home Address</label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              ></textarea>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                ← Back to Log in
              </Link>
              <Link 
                to="/patient-signup-2" 
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

export default PatientSignup1;