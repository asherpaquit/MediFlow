import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DoctorSignup1 = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    medicalLicenseNumber: '',
    specialization: '',
    yearsOfExperience: '',
    affiliatedHospitalStatus: '',
    consultationFee: '',
    baseSalary: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    // Validate contact number (minimum 10 digits)
    if (formData.contactNumber && !/^\d{10,15}$/.test(formData.contactNumber)) {
      alert('Please enter a valid contact number (10-15 digits)');
      return;
    }
    sessionStorage.setItem('doctorSignupStep1', JSON.stringify(formData));
    navigate('/doctor-signup-2');
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

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Doctor Registration - Basic Information</h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <label className="block text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  pattern="[0-9]{10,15}"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Professional Information */}
              <div>
                <label className="block text-gray-700 mb-2">Medical License Number</label>
                <input
                  type="text"
                  name="medicalLicenseNumber"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.medicalLicenseNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Specialization</label>
                <select
                  name="specialization"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                >
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
                  name="yearsOfExperience"
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Affiliated Hospital Status</label>
                <select
                  name="affiliatedHospitalStatus"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.affiliatedHospitalStatus}
                  onChange={handleChange}
                  required
                >
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
                  name="consultationFee"
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Base Salary (USD)</label>
                <input
                  type="number"
                  name="baseSalary"
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.baseSalary}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Link to="/signup" className="text-blue-600 hover:text-blue-800">
                ← Back to Signup Options
              </Link>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition duration-200"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignup1;