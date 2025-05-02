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
  SearchIcon,
  CameraIcon,
  ChevronDownIcon,
  XIcon,
  CheckIcon,
  BanIcon
} from '@heroicons/react/outline';

const DoctorsDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorData, setDoctorData] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [patientRecords, setPatientRecords] = useState([]);
  const [isLoading, setIsLoading] = useState({
    initial: true,
    appointments: false,
    patients: false
  });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [appointmentNotes, setAppointmentNotes] = useState('');

  // Fetch functions
  const fetchDoctorAppointments = async (doctorId) => {
    try {
      setIsLoading(prev => ({ ...prev, appointments: true }));
      const response = await fetch(`https://mediflow-s7af.onrender.com/api/appointments?doctorId=${doctorId}`);
      
      if (!response.ok) throw new Error('Failed to fetch appointments');
      
      const data = await response.json();
      
      const normalizedAppointments = Array.isArray(data) ? data.map(appt => ({
        id: appt.id || appt._id || '',
        patientName: appt.patientName || 
                   (appt.patient ? `${appt.patient.firstName || ''} ${appt.patient.lastName || ''}`.trim() : 'Unknown Patient'),
        date: appt.date || new Date().toISOString().split('T')[0],
        time: appt.time || '00:00',
        reason: appt.reason || 'No reason provided',
        status: appt.status || 'Pending',
        notes: appt.notes || '',
        patientId: appt.patientId || (appt.patient ? appt.patient.id : null)
      })) : [];
      
      setUpcomingAppointments(normalizedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setUpcomingAppointments([]);
    } finally {
      setIsLoading(prev => ({ ...prev, appointments: false }));
    }
  };

  const fetchPatientsWithAppointments = async (doctorId) => {
    try {
      setIsLoading(prev => ({ ...prev, patients: true }));
      const response = await fetch(`https://mediflow-s7af.onrender.com/api/user-patients?doctorId=${doctorId}`);
      
      if (!response.ok) throw new Error('Failed to fetch patients');
      
      const data = await response.json();
      
      const normalizedPatients = Array.isArray(data) ? data.map(patient => ({
        id: patient.id || patient._id || '',
        name: patient.name || 
             `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 
             'Unknown Patient',
        age: patient.age || 'Unknown',
        gender: patient.gender || 'Unknown',
        lastVisit: patient.lastVisit || '',
        nextAppointment: patient.nextAppointment || '',
        primaryDiagnosis: patient.primaryDiagnosis || 'No diagnosis',
        medications: Array.isArray(patient.medications) ? patient.medications : []
      })) : [];
      
      setPatientRecords(normalizedPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatientRecords([]);
    } finally {
      setIsLoading(prev => ({ ...prev, patients: false }));
    }
  };

  const fetchInitialData = async (doctorId) => {
    try {
      setIsLoading(prev => ({ ...prev, initial: true }));
      await Promise.all([
        fetchDoctorAppointments(doctorId),
        fetchPatientsWithAppointments(doctorId)
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, initial: false }));
    }
  };

  // Handle appointment status change
  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      const appointmentToUpdate = upcomingAppointments.find(a => a.id === appointmentId);
      if (!appointmentToUpdate) throw new Error('Appointment not found');

      // Optimistic UI update
      setUpcomingAppointments(prev =>
        prev.map(appt =>
          appt.id === appointmentId
            ? { ...appt, status: action === 'accept' ? 'Confirmed' : 'Declined' }
            : appt
        )
      );

      const response = await fetch(`https://mediflow-s7af.onrender.com/api/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: action === 'accept' ? 'Confirmed' : 'Declined',
          doctorId: doctorData.id
        }),
      });

      if (!response.ok) throw new Error('Failed to update appointment');

      // Refresh data
      fetchDoctorAppointments(doctorData.id);
    } catch (error) {
      console.error('Error updating appointment:', error);
      // Revert on error
      setUpcomingAppointments(prev =>
        prev.map(appt =>
          appt.id === appointmentId
            ? { ...appt, status: appointmentToUpdate?.status || 'Pending' }
            : appt
        )
      );
    }
  };

  // Update appointment notes
  const updateAppointmentNotes = async (appointmentId, notes) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes,
          doctorId: doctorData.id
        }),
      });

      if (!response.ok) throw new Error('Failed to update notes');

      // Update local state
      setUpcomingAppointments(prev =>
        prev.map(appt =>
          appt.id === appointmentId
            ? { ...appt, notes }
            : appt
        )
      );
    } catch (error) {
      console.error('Error updating appointment notes:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('doctorData');
    sessionStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  // Filter functions
  const filteredAppointments = upcomingAppointments.filter(appt => {
    try {
      return (
        appt &&
        appt.patientName &&
        appt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (appointmentFilter === 'all' || appt.status === appointmentFilter)
      );
    } catch (error) {
      console.error('Error filtering appointments:', error);
      return false;
    }
  });

  const filteredPatients = patientRecords.filter(patient => {
    try {
      return (
        patient &&
        patient.name &&
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } catch (error) {
      console.error('Error filtering patients:', error);
      return false;
    }
  });

  // Initial data loading
  useEffect(() => {
    const storedData = sessionStorage.getItem('doctorData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // Check for either id or _id
        if (parsedData && (parsedData.id || parsedData._id)) {
          // Normalize the data to always use id
          const normalizedData = {
            ...parsedData,
            id: parsedData.id || parsedData._id
          };
          setDoctorData(normalizedData);
          fetchInitialData(normalizedData.id);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error parsing doctor data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

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
              <div className="relative">
                <button 
                  className="p-1 text-gray-400 hover:text-gray-500 relative"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                >
                  <BellIcon className="w-6 h-6" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                    <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                      <button onClick={() => setIsNotificationOpen(false)}>
                        <XIcon className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                    <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`p-3 ${!notification.read ? 'bg-blue-50' : 'bg-white'}`}
                          >
                            <p className="text-sm text-gray-800">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-700">Dr. {doctorData.firstName} {doctorData.lastName}</div>
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
                  value={upcomingAppointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length} 
                  icon={CalendarIcon} 
                  color="blue" 
                />
                <StatCard 
                  title="Active Patients" 
                  value={patientRecords.length} 
                  icon={UsersIcon} 
                  color="green" 
                />
                <StatCard 
                  title="Pending Actions" 
                  value={upcomingAppointments.filter(a => a.status === 'Pending').length} 
                  icon={BellIcon} 
                  color="orange" 
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">Pending Appointments</h3>
                  </div>
                  {isLoading.appointments ? (
                    <div className="p-8 text-center text-gray-500">Loading appointments...</div>
                  ) : upcomingAppointments.filter(a => a.status === 'Pending').length > 0 ? (
                    <>
                      <div className="divide-y divide-gray-200">
                        {upcomingAppointments
                          .filter(a => a.status === 'Pending')
                          .slice(0, 3)
                          .map((appt) => (
                            <div key={appt.id} className="p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-medium">{appt.patientName}</p>
                                  <p className="text-sm text-gray-500">{appt.reason}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm">
                                    {new Date(appt.date).toLocaleDateString()} at {appt.time}
                                  </p>
                                  <div className="mt-1 space-x-2">
                                    <button 
                                      onClick={() => handleAppointmentAction(appt.id, 'accept')}
                                      className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                                    >
                                      Accept
                                    </button>
                                    <button 
                                      onClick={() => handleAppointmentAction(appt.id, 'decline')}
                                      className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
                                    >
                                      Decline
                                    </button>
                                  </div>
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
                    </>
                  ) : (
                    <div className="p-8 text-center text-gray-500">No pending appointments</div>
                  )}
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">Recent Patients</h3>
                  </div>
                  {isLoading.patients ? (
                    <div className="p-8 text-center text-gray-500">Loading patients...</div>
                  ) : patientRecords.length > 0 ? (
                    <>
                      <div className="divide-y divide-gray-200">
                        {patientRecords.slice(0, 3).map((patient) => (
                          <div 
                            key={patient.id} 
                            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedPatient(patient);
                              setActiveTab('patients');
                            }}
                          >
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">{patient.name}</p>
                                <p className="text-sm text-gray-500">{patient.primaryDiagnosis || 'No diagnosis'}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">
                                  Last visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'Never'}
                                </p>
                                {patient.nextAppointment && (
                                  <p className="text-xs text-blue-600">
                                    Next: {new Date(patient.nextAppointment).toLocaleDateString()}
                                  </p>
                                )}
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
                    </>
                  ) : (
                    <div className="p-8 text-center text-gray-500">No patient records</div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-4">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900">Appointments</h3>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <select
                        value={appointmentFilter}
                        onChange={(e) => setAppointmentFilter(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Appointments</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Declined">Declined</option>
                      </select>
                      <ChevronDownIcon className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                      onClick={() => fetchDoctorAppointments(doctorData.id)}
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                {isLoading.appointments ? (
                  <div className="p-8 text-center text-gray-500">Loading appointments...</div>
                ) : filteredAppointments.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredAppointments.map((appt) => (
                      <div 
                        key={appt.id} 
                        className={`p-4 hover:bg-gray-50 transition-colors ${selectedAppointment?.id === appt.id ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedAppointment(appt)}
                      >
                        <div className="flex flex-col sm:flex-row justify-between">
                          <div className="mb-2 sm:mb-0">
                            <p className="font-medium">{appt.patientName}</p>
                            <p className="text-sm text-gray-500">{appt.reason}</p>
                          </div>
                          <div className="flex flex-col sm:items-end">
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              {new Date(appt.date).toLocaleDateString()}
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
                          <div className="space-x-2">
                            {appt.status === 'Pending' && (
                              <>
                                <button 
                                  className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAppointmentAction(appt.id, 'accept');
                                  }}
                                >
                                  Accept
                                </button>
                                <button 
                                  className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAppointmentAction(appt.id, 'decline');
                                  }}
                                >
                                  Decline
                                </button>
                              </>
                            )}
                            <button 
                              className="text-xs text-blue-600 hover:text-blue-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAppointment(appt);
                              }}
                            >
                              View Details
                            </button>
                          </div>
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

              {/* Appointment Detail View */}
              {selectedAppointment && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">Appointment Details</h3>
                    <button onClick={() => setSelectedAppointment(null)}>
                      <XIcon className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Patient</h4>
                        <p className="text-lg font-medium">{selectedAppointment.patientName}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h4>
                        <p className="text-lg font-medium">
                          {new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          selectedAppointment.status === 'Confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : selectedAppointment.status === 'Declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedAppointment.status}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Reason</h4>
                        <p className="text-lg font-medium">{selectedAppointment.reason}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                        Doctor's Notes
                      </label>
                      <textarea
                        id="notes"
                        rows={4}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={selectedAppointment.notes || ''}
                        onChange={(e) => {
                          setSelectedAppointment({
                            ...selectedAppointment,
                            notes: e.target.value
                          });
                        }}
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                          onClick={() => updateAppointmentNotes(selectedAppointment.id, selectedAppointment.notes)}
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>

                    {selectedAppointment.status === 'Pending' && (
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => handleAppointmentAction(selectedAppointment.id, 'decline')}
                        >
                          <BanIcon className="-ml-1 mr-2 h-5 w-5" />
                          Decline Appointment
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          onClick={() => handleAppointmentAction(selectedAppointment.id, 'accept')}
                        >
                          <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
                          Accept Appointment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <div className="space-y-4">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900">Patients</h3>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                    onClick={() => fetchPatientsWithAppointments(doctorData.id)}
                  >
                    Refresh
                  </button>
                </div>
                {isLoading.patients ? (
                  <div className="p-8 text-center text-gray-500">Loading patients...</div>
                ) : filteredPatients.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredPatients.map((patient) => (
                      <div 
                        key={patient.id} 
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${selectedPatient?.id === patient.id ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserCircleIcon className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{patient.name}</p>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {patient.primaryDiagnosis || 'No diagnosis'}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <CalendarIcon className="flex-shrink-0 mr-1 h-4 w-4" />
                              <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end space-x-2">
                          <button 
                            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              // View patient history
                            }}
                          >
                            View History
                          </button>
                          <button 
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Schedule new visit
                            }}
                          >
                            Schedule Visit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No patients found {searchQuery ? 'matching your search' : ''}
                  </div>
                )}
              </div>

              {/* Patient Detail View */}
              {selectedPatient && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">Patient Details</h3>
                    <button onClick={() => setSelectedPatient(null)}>
                      <XIcon className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserCircleIcon className="h-10 w-10 text-gray-500" />
                      </div>
                      <div className="ml-6">
                        <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>{selectedPatient.age} years • {selectedPatient.gender}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Medical Information</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Primary Diagnosis</h4>
                            <p className="mt-1 text-sm text-gray-900">
                              {selectedPatient.primaryDiagnosis || 'Not specified'}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Current Medications</h4>
                            {selectedPatient.medications && selectedPatient.medications.length > 0 ? (
                              <ul className="mt-1 space-y-1">
                                {selectedPatient.medications.map((med, index) => (
                                  <li key={index} className="text-sm text-gray-900">{med}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="mt-1 text-sm text-gray-900">None</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Appointments</h3>
                        {upcomingAppointments.filter(a => a.patientId === selectedPatient.id).length > 0 ? (
                          <div className="space-y-3">
                            {upcomingAppointments
                              .filter(a => a.patientId === selectedPatient.id)
                              .sort((a, b) => new Date(a.date) - new Date(b.date))
                              .slice(0, 3)
                              .map(appt => (
                                <div key={appt.id} className="p-3 border border-gray-200 rounded-lg">
                                  <div className="flex justify-between">
                                    <div>
                                      <p className="text-sm font-medium">{new Date(appt.date).toLocaleDateString()}</p>
                                      <p className="text-xs text-gray-500">{appt.reason}</p>
                                    </div>
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
                              ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No upcoming appointments</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Medical Records Tab */}
          {activeTab === 'records' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Medical Records</h3>
              </div>
              <div className="p-6">
                {selectedPatient ? (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-lg font-medium">Records for {selectedPatient.name}</h4>
                      <button 
                        onClick={() => setSelectedPatient(null)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Back to patients
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Patient medical records would be displayed here</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No patient selected</h3>
                    <p className="mt-1 text-sm text-gray-500">Select a patient to view their medical records</p>
                    <div className="mt-6">
                      <button 
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                        onClick={() => setActiveTab('patients')}
                      >
                        Select Patient
                      </button>
                    </div>
                  </div>
                )}
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
                        value={doctorData.phone || ''}
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
                          // In a real app, you would also update this in the backend
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