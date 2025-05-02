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
  CameraIcon,
  ArrowPathIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const DoctorsDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorData, setDoctorData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch doctor data and appointments on component mount
  useEffect(() => {
    const storedData = sessionStorage.getItem('doctorData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setDoctorData(data);
      fetchDoctorAppointments(data.doctorId);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch appointments for the doctor
  const fetchDoctorAppointments = async (doctorId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/appointments/doctor/${doctorId}`);
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        throw new Error('Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle appointment status updates (accept/decline)
  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      const response = await fetch(`http://localhost:8080/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action })
      });

      if (response.ok) {
        const updatedAppointment = await response.json();
        setAppointments(prev => prev.map(appt => 
          appt.appointmentId === appointmentId ? updatedAppointment : appt
        ));
        showNotification(`Appointment ${action.toLowerCase()} successfully`, 'success');
      } else {
        throw new Error('Failed to update appointment');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to update appointment', 'error');
    }
  };

  // Show notification message
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('doctorData');
    sessionStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  // Refresh appointments
  const refreshAppointments = () => {
    if (doctorData) {
      fetchDoctorAppointments(doctorData.doctorId);
    }
  };

  // Filter appointments based on search query
  const filteredAppointments = appointments.filter(appt => {
    const patientName = `${appt.patient?.firstname || ''} ${appt.patient?.lastname || ''}`.toLowerCase();
    return (
      patientName.includes(searchQuery.toLowerCase()) ||
      appt.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Loading state
  if (!doctorData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Calculate dashboard stats
  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(a => a.date === today).length;
  const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;
  const uniquePatients = [...new Set(appointments.map(a => a.patient?.patientId))].length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg flex items-center ${
          notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {notification.type === 'error' ? (
            <XMarkIcon className="h-5 w-5 mr-2" />
          ) : (
            <CheckIcon className="h-5 w-5 mr-2" />
          )}
          {notification.message}
        </div>
      )}

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
              <button className="p-1 text-gray-400 hover:text-gray-500 relative">
                <BellIcon className="w-6 h-6" />
                {pendingAppointments > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <div className="flex items-center">
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-700">Dr. {doctorData.firstname} {doctorData.lastname}</div>
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
                  value={todaysAppointments} 
                  icon={CalendarIcon} 
                  color="blue" 
                />
                <StatCard 
                  title="Pending Approvals" 
                  value={pendingAppointments} 
                  icon={BellIcon} 
                  color="orange" 
                />
                <StatCard 
                  title="Total Patients" 
                  value={uniquePatients} 
                  icon={UsersIcon} 
                  color="green" 
                />
              </div>

              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Recent Appointments</h3>
                  <button 
                    onClick={refreshAppointments}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ArrowPathIcon className="w-4 h-4 mr-1" />
                    Refresh
                  </button>
                </div>
                {loading ? (
                  <div className="p-8 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : appointments.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {appointments.slice(0, 5).map((appt) => (
                      <div key={appt.appointmentId} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">
                              {appt.patient?.firstname} {appt.patient?.lastname}
                            </p>
                            <p className="text-sm text-gray-500">
                              {appt.notes || 'No notes provided'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{appt.date} at {appt.time}</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              appt.status === 'Confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : appt.status === 'Declined'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {appt.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No appointments found
                  </div>
                )}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-right">
                  <button 
                    onClick={() => setActiveTab('appointments')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View all appointments →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Appointments</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={refreshAppointments}
                    className="flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <ArrowPathIcon className="w-4 h-4 mr-1" />
                    Refresh
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="p-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredAppointments.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredAppointments.map((appt) => (
                    <div key={appt.appointmentId} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between">
                        <div className="mb-2 sm:mb-0">
                          <p className="font-medium">
                            {appt.patient?.firstname} {appt.patient?.lastname}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appt.notes || 'No notes provided'}
                          </p>
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
                          appt.status === 'Confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : appt.status === 'Declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appt.status}
                        </span>
                        {appt.status === 'Pending' && (
                          <div className="space-x-2">
                            <button 
                              className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                              onClick={() => handleAppointmentAction(appt.appointmentId, 'Confirmed')}
                            >
                              Accept
                            </button>
                            <button 
                              className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
                              onClick={() => handleAppointmentAction(appt.appointmentId, 'Declined')}
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No appointments found {searchQuery ? 'matching your search' : ''}
                </div>
              )}
            </div>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Patients</h3>
              </div>
              <div className="p-6">
                <div className="text-center py-8 text-gray-500">
                  <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Patient management</h3>
                  <p className="mt-1 text-sm text-gray-500">View and manage your patients</p>
                </div>
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Medical records</h3>
                  <p className="mt-1 text-sm text-gray-500">Access patient medical records</p>
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
                    <h2 className="mt-4 text-lg font-medium">Dr. {doctorData.firstname} {doctorData.lastname}</h2>
                    <p className="text-sm text-gray-500">{doctorData.specialization}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={doctorData.email || ''}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Specialization</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={doctorData.specialization || ''}
                        readOnly
                      />
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

// StatCard Component
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