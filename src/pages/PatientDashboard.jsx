import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
  const [patientData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Michael',
    birthDate: '1990-05-15',
    gender: 'Male',
    contactNumber: '+1 (555) 123-4567',
    email: 'john.doe@example.com',
    address: '123 Main St, Apt 4B, New York, NY 10001'
  });

  const [upcomingAppointments] = useState([
    {
      id: 1,
      date: '2023-06-15',
      time: '10:30 AM',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      status: 'Confirmed'
    },
    {
      id: 2,
      date: '2023-06-20',
      time: '2:15 PM',
      doctor: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      status: 'Pending'
    }
  ]);

  const [medicalRecords] = useState([
    {
      id: 1,
      date: '2023-05-10',
      doctor: 'Dr. Sarah Johnson',
      diagnosis: 'Hypertension',
      prescription: 'Lisinopril 10mg daily'
    },
    {
      id: 2,
      date: '2023-03-22',
      doctor: 'Dr. Emily Wong',
      diagnosis: 'Annual Checkup',
      prescription: 'None'
    }
  ]);

  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">MediFlow</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`${activeTab === 'dashboard' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`${activeTab === 'appointments' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Appointments
                </button>
                <button
                  onClick={() => setActiveTab('records')}
                  className={`${activeTab === 'records' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Medical Records
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`${activeTab === 'profile' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Profile
                </button>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {patientData.firstName}!</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800">Upcoming Appointments</h3>
                  <p className="text-3xl font-bold text-blue-600">{upcomingAppointments.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800">Medical Records</h3>
                  <p className="text-3xl font-bold text-green-600">{medicalRecords.length}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-800">Prescriptions</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {medicalRecords.filter(r => r.prescription !== 'None').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Upcoming Appointments</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{appointment.doctor}</p>
                        <p className="text-sm text-gray-500">{appointment.specialty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{appointment.date} at {appointment.time}</p>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.status === 'Confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-gray-50 text-right">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Book New Appointment
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Your Appointments</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {upcomingAppointments.map(appointment => (
                <div key={appointment.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{appointment.doctor}</p>
                      <p className="text-sm text-gray-500">{appointment.specialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{appointment.date} at {appointment.time}</p>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Reschedule
                    </button>
                    <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 text-right">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Book New Appointment
              </button>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Medical Records</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {medicalRecords.map(record => (
                <div key={record.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{record.doctor}</p>
                      <p className="text-sm text-gray-500">{record.date}</p>
                    </div>
                    <div>
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {record.diagnosis}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Prescription:</span> {record.prescription}
                    </p>
                  </div>
                  <div className="mt-3">
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      View Full Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Your Profile</h3>
            </div>
            <div className="px-6 py-4">
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <p className="mt-1 text-sm text-gray-900">{patientData.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <p className="mt-1 text-sm text-gray-900">{patientData.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                    <p className="mt-1 text-sm text-gray-900">{patientData.middleName || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <p className="mt-1 text-sm text-gray-900">{patientData.birthDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <p className="mt-1 text-sm text-gray-900">{patientData.gender}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                    <p className="mt-1 text-sm text-gray-900">{patientData.contactNumber}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <p className="mt-1 text-sm text-gray-900">{patientData.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Home Address</label>
                    <p className="mt-1 text-sm text-gray-900">{patientData.address}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;

