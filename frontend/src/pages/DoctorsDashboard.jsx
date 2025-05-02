import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  LogoutIcon,
  BellIcon,
  SearchIcon,
  CameraIcon
} from '@heroicons/react/outline';

const DoctorsDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorData, setDoctorData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedData = sessionStorage.getItem('doctorData');
    if (storedData) {
      const doctor = JSON.parse(storedData);
      setDoctorData(doctor);
      fetchDoctorAppointments(doctor.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const API_BASE = 'https://mediflow-s7af.onrender.com';
  const fetchDoctorAppointments = async (doctorId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/appointments?doctorId=${doctorId}`);
      const data = await response.json();
      
      if (response.ok) {
        setAppointments(data.appointments);
        const uniquePatients = data.appointments.reduce((acc, appointment) => {
          if (!acc.some(p => p.id === appointment.patient.id)) {
            acc.push(appointment.patient);
          }
          return acc;
        }, []);
        setPatients(uniquePatients);
      } else {
        console.error('Failed to fetch appointments:', data.message);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('doctorData');
    sessionStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      const response = await fetch(`${API_BASE}/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      });

      if (response.ok) {
        setAppointments(prevAppointments =>
          prevAppointments.map(appt =>
            appt.id === appointmentId ? { ...appt, status: action } : appt
          )
        );
      } else {
        console.error('Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const filteredAppointments = appointments.filter(appt => 
    appt.patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!doctorData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading appointments...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="flex items-center justify-center h-16 px-4 bg-blue-600 text-white">
            <h1 className="text-xl font-bold">MediFlow MD</h1>
          </div>
          <div className="flex flex-col flex-grow p-4 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              {[
                { name: 'Dashboard', icon: ChartBarIcon, tab: 'dashboard' },
                { name: 'Appointments', icon: CalendarIcon, tab: 'appointments' },
                { name: 'Patients', icon: UsersIcon, tab: 'patients' },
                { name: 'Medical Records', icon: DocumentTextIcon, tab: 'records' },
                { name: 'Settings', icon: CogIcon, tab: 'settings' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.tab)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.tab
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <LogoutIcon className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SearchIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search patients, appointments..."
                  className="block w-full py-2 pl-10 pr-3 text-sm bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-blue-300 focus:ring-blue-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-700">Dr. {doctorData.username}</div>
                  <div className="text-xs text-gray-500">{doctorData.specialization}</div>
                </div>
                <UserCircleIcon className="w-8 h-8 ml-2 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="fixed inset-0 z-20">
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
              <div className="relative flex flex-col w-full max-w-xs bg-white">
                <div className="flex items-center justify-center h-16 px-4 bg-blue-600 text-white">
                  <h1 className="text-xl font-bold">MediFlow MD</h1>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  <nav className="space-y-2">
                    {[
                      { name: 'Dashboard', icon: ChartBarIcon, tab: 'dashboard' },
                      { name: 'Appointments', icon: CalendarIcon, tab: 'appointments' },
                      { name: 'Patients', icon: UsersIcon, tab: 'patients' },
                      { name: 'Medical Records', icon: DocumentTextIcon, tab: 'records' },
                      { name: 'Settings', icon: CogIcon, tab: 'settings' }
                    ].map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          setActiveTab(item.tab);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg ${
                          activeTab === item.tab
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </button>
                    ))}
                  </nav>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <LogoutIcon className="w-5 h-5 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  title="Today's Appointments" 
                  value={appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length} 
                  icon={CalendarIcon} 
                  color="blue" 
                />
                <StatCard 
                  title="Active Patients" 
                  value={patients.length} 
                  icon={UsersIcon} 
                  color="green" 
                />
                <StatCard 
                  title="Pending Appointments" 
                  value={appointments.filter(a => a.status === 'pending').length} 
                  icon={BellIcon} 
                  color="orange" 
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">Upcoming Appointments</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {appointments
                      .filter(a => new Date(a.date) >= new Date())
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .slice(0, 3)
                      .map((appt) => (
                        <div key={appt.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">{appt.patient.name}</p>
                              <p className="text-sm text-gray-500">{appt.type}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">{appt.time}</p>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                appt.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : appt.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {appt.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-right">
                    <button 
                      onClick={() => setActiveTab('appointments')}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View all appointments →
                    </button>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">Recent Patients</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {patients.slice(0, 3).map((patient) => (
                      <div key={patient.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-gray-500">{patient.condition || 'No condition specified'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">Last visit: {patient.lastVisit || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-right">
                    <button 
                      onClick={() => setActiveTab('patients')}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View all patients →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Appointments</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((appt) => (
                      <div key={appt.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col sm:flex-row justify-between">
                          <div className="mb-2 sm:mb-0">
                            <p className="font-medium">{appt.patient.name}</p>
                            <p className="text-sm text-gray-500">{appt.type}</p>
                          </div>
                          <div className="flex flex-col sm:items-end">
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              {appt.date}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              {appt.time}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            appt.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : appt.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {appt.status}
                          </span>
                          {appt.status === 'pending' && (
                            <div className="space-x-2">
                              <button 
                                onClick={() => handleAppointmentAction(appt.id, 'confirmed')}
                                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                              >
                                Accept
                              </button>
                              <button 
                                onClick={() => handleAppointmentAction(appt.id, 'declined')}
                                className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No appointments found
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Patients</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <div key={patient.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserCircleIcon className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{patient.name}</p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {patient.condition || 'No condition'}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <CalendarIcon className="flex-shrink-0 mr-1 h-4 w-4" />
                            <span>Last visit: {patient.lastVisit || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end space-x-2">
                        <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                          View History
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No patients found
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Medical Records Tab */}
          {activeTab === 'records' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Medical Records</h3>
              </div>
              <div className="p-6">
                <div className="text-center py-8 text-gray-500">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No records selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a patient to view their medical records</p>
                  <div className="mt-6">
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                      Search Patient Records
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
              </div>
              <div className="p-6">
                <div className="max-w-lg mx-auto space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <UserCircleIcon className="h-24 w-24 text-gray-400" />
                      <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
                        <CameraIcon className="h-4 w-4" />
                        <input type="file" className="hidden" />
                      </label>
                    </div>
                    <h2 className="mt-4 text-lg font-medium">Dr. {doctorData.firstName} {doctorData.lastName}</h2>
                    <p className="text-sm text-gray-500">{doctorData.specialization}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={doctorData.email}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={doctorData.phone}
                        onChange={(e) => setDoctorData({...doctorData, phone: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Specialization</label>
                      <select 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={doctorData.specialization}
                        onChange={(e) => setDoctorData({...doctorData, specialization: e.target.value})}
                      >
                        <option>Cardiology</option>
                        <option>Neurology</option>
                        <option>Pediatrics</option>
                        <option>General Practice</option>
                      </select>
                    </div>

                    <div className="pt-4">
                      <button 
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                        onClick={() => {
                          sessionStorage.setItem('doctorData', JSON.stringify(doctorData));
                        }}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-full p-3 ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsDashboard;