import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PencilIcon,
    CheckIcon,
    CameraIcon,
    UserIcon,
    XIcon,
    ArrowLeftIcon,
    CalendarIcon,
    ClockIcon,
    DocumentTextIcon,
    UserCircleIcon,
    HomeIcon
} from '@heroicons/react/outline';

// --- StatCard Component (no changes) ---
const StatCard = ({ label, count, color }) => (
    <div className={`bg-${color}-50 p-4 rounded-lg shadow-sm`}>
        <h3 className={`font-medium text-sm text-${color}-800`}>{label}</h3>
        <p className={`text-3xl font-bold text-${color}-600`}>{count}</p>
    </div>
);

// --- ProfileField Component (no changes) ---
const ProfileField = ({ label, name, value, isEditing, onChange, type = "text" }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {isEditing ? (
            type === "select" ? (
                <select
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                </select>
            ) : type === "textarea" ? (
                <textarea
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    rows="3"
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
            )
        ) : (
            <p className="mt-1 px-3 py-2 bg-gray-50 rounded-lg text-gray-900 min-h-[40px] flex items-center">
                {value || <span className="text-gray-400">Not specified</span>}
            </p>
        )}
    </div>
);

// --- Main PatientDashboard Component ---
const PatientDashboard = () => {
    const navigate = useNavigate();

    // --- Existing State ---
    const storedPatientData = JSON.parse(sessionStorage.getItem('patientData'));
    const [patientData, setPatientData] = useState(storedPatientData || {});
    const [editableData, setEditableData] = useState(storedPatientData || {});
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(() => sessionStorage.getItem('profileImage') || '');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // --- Dummy/Initial Data (Replace with API calls eventually) ---
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [medicalRecords] = useState([
        { id: 1, date: '2025-04-10', doctor: 'Dr. Sarah Johnson', diagnosis: 'Hypertension', prescription: 'Lisinopril 10mg daily' },
        { id: 2, date: '2025-02-22', doctor: 'Dr. Emily Wong', diagnosis: 'Annual Checkup', prescription: 'None' }
    ]);

    // --- NEW State for Appointment Booking ---
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [appointmentReason, setAppointmentReason] = useState('');
    const [bookingStatus, setBookingStatus] = useState({ loading: false, error: null, success: null });
    const [fetchDoctorsStatus, setFetchDoctorsStatus] = useState({ loading: false, error: null });

    // --- Navigation Tabs Configuration ---
    const tabs = [
        { id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
        { id: 'appointments', name: 'My Appointments', icon: CalendarIcon },
        { id: 'records', name: 'Medical Records', icon: DocumentTextIcon },
        { id: 'bookAppointment', name: 'Book Appointment', icon: ClockIcon },
        { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    ];

    // --- Effect to Fetch Doctors ---
    useEffect(() => {
        const fetchDoctors = async () => {
            setFetchDoctorsStatus({ loading: true, error: null });
            try {
                const response = await fetch('http://localhost:8080/api/user-doctors');
                if (response.ok) {
                    const data = await response.json();
                    setDoctors(data);
                    setFetchDoctorsStatus({ loading: false, error: null });
                } else {
                    throw new Error('Failed to fetch doctors list.');
                }
            } catch (err) {
                console.error("Error fetching doctors:", err);
                setFetchDoctorsStatus({ loading: false, error: err.message || 'Could not load doctors.' });
            }
        };

        if (doctors.length === 0) {
            fetchDoctors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Handlers ---
    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancelEdit = () => {
        setEditableData(patientData);
        setIsEditing(false);
    };

    const handleSaveProfile = async () => {
        // ... (Profile update logic - no changes)
    };

    const handleImageUpload = (e) => {
        // ... (Image upload logic - no changes)
    };

    // --- NEW Handler for Booking Appointment ---
    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingStatus({ loading: true, error: null, success: null });

        // Basic Validation
        if (!selectedDoctorId || !appointmentDate || !appointmentTime) {
            setBookingStatus({ loading: false, error: 'Please select a doctor, date, and time.', success: null });
            return;
        }

        // **CRITICAL FIX: Ensure patientId is available and correct**
        if (!patientData || !patientData.patientId) {
            setBookingStatus({ loading: false, error: 'Patient information is missing. Please try logging in again.', success: null });
            return;
        }

        // **CRITICAL FIX: Format date and time if necessary (Backend Dependent!)**
        // Assuming backend expects YYYY-MM-DD for date and HH:mm for time (24-hour)
        const formattedDate = new Date(appointmentDate).toISOString().split('T')[0];
        const formattedTime = appointmentTime; // Assuming time is already in HH:mm format

        const appointmentPayload = {
            patientId: patientData.patientId,
            doctorId: parseInt(selectedDoctorId, 10), // Ensure doctorId is a number
            date: formattedDate, // Use formatted date
            time: formattedTime, // Use formatted time
            notes: appointmentReason || null, // Use "notes" to match backend, send null if empty
            // status: 'Pending',  // Backend should likely set the default status
        };

        try {
            const response = await fetch('http://localhost:8080/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentPayload),
            });

            if (response.ok) {
                const newAppointment = await response.json();
                setBookingStatus({ loading: false, error: null, success: 'Appointment booked successfully!' });
                setUpcomingAppointments(prev => [...prev, { ...newAppointment, doctor: doctors.find(d => d.doctorId === newAppointment.doctorId)?.lastname || 'Unknown Doctor' }]);
                setSelectedDoctorId('');
                setAppointmentDate('');
                setAppointmentTime('');
                setAppointmentReason('');
                setTimeout(() => setBookingStatus(prev => ({ ...prev, success: null })), 5000); // Clear success message
            } else {
                const errorData = await response.json(); // Try to get JSON error
                const errorMessage = errorData?.message || errorData || 'Failed to book appointment.'; // Improved error message extraction
                throw new Error(errorMessage);
            }
        } catch (err) {
            console.error("Error booking appointment:", err);
            setBookingStatus({ loading: false, error: err.message || 'An error occurred during booking.', success: null });
            setTimeout(() => setBookingStatus(prev => ({ ...prev, error: null })), 5000); // Clear error message
        }
    };

    // Helper to get today's date in YYYY-MM-DD format for min attribute
    const getTodayDate = () => {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const year = today.getFullYear();
        return `${year}-${month}-${day}`;
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
            {/* --- Navbar --- */}
            <nav className="bg-white shadow-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Left Side: Logo and Desktop Nav */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center text-xl font-bold text-blue-600">
                                <ArrowLeftIcon className="h-5 w-5 mr-2 cursor-pointer hover:text-blue-800" onClick={() => navigate(-1)} />
                                MediFlow
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50'
                                            } inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium rounded-t-md transition-colors duration-150 ease-in-out`}
                                        aria-current={activeTab === tab.id ? 'page' : undefined}
                                    >
                                        <tab.icon className="h-5 w-5 mr-1.5" />
                                        {tab.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Logout Button (Desktop) */}
                        <div className="hidden sm:flex items-center">
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-md text-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center gap-1 transition-colors duration-150 ease-in-out"
                            >
                                <XIcon className="h-4 w-4" />
                                Logout
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                aria-controls="mobile-menu"
                                aria-expanded={isMobileMenuOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                {!isMobileMenuOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden" id="mobile-menu">
                        <div className="pt-2 pb-3 space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`${activeTab === tab.id
                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                                        } flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
                                    aria-current={activeTab === tab.id ? 'page' : undefined}
                                >
                                     <tab.icon className="h-5 w-5 mr-2" />
                                    {tab.name}
                                </button>
                            ))}
                            <button
                                onClick={() => { handleLogout(); setIsMobileMenuOpen(false);}}
                                className="flex items-center w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                                <XIcon className="h-5 w-5 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* --- Main Content Area --- */}
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {/* --- Dashboard Tab --- */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6 px-4 sm:px-0">
                             <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                                 <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {patientData.firstname || 'Patient'}!</h1>
                                 <p className="text-gray-600">Here's a quick overview of your health dashboard.</p>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                 <StatCard label="Upcoming Appointments" count={upcomingAppointments.length} color="blue" />
                                 <StatCard label="Total Medical Records" count={medicalRecords.length} color="green" />
                                 <StatCard label="Active Prescriptions" count={medicalRecords.filter(record => record.prescription !== 'None').length} color="purple" />
                             </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>
                                 {upcomingAppointments.length > 0 ? (
                                    <div className="bg-white shadow-md rounded-lg overflow-x-auto border border-gray-200">
                                       <table className="min-w-full divide-y divide-gray-200">
                                         <thead className="bg-gray-50">
                                            <tr>
                                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                          </thead>
                                          <tbody className="bg-white divide-y divide-gray-200">
                                            {upcomingAppointments.map((appointment) => (
                                              <tr key={appointment.appointmentId}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.time}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Dr. {appointment.doctor}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.status}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                    </div>
                                 ) : (
                                   <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                     <p className="text-gray-500">No upcoming appointments.</p>
                                   </div>
                                 )}
                            </div>
                        </div>
                    )}

                    {/* --- Appointments Tab --- */}
                    {activeTab === 'appointments' && (
                        <div className="space-y-6 px-4 sm:px-0">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Appointments</h2>
                            {upcomingAppointments.length > 0 ? (
                                 <div className="bg-white shadow-md rounded-lg overflow-x-auto border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                      <thead className="bg-gray-50">
                                        <tr>
                                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white divide-y divide-gray-200">
                                        {upcomingAppointments.map((appointment) => (
                                          <tr key={appointment.appointmentId}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.time}</td>
                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Dr. {appointment.doctor}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.status}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                            ) : (
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <p className="text-gray-500">You have no upcoming appointments.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- Medical Records Tab --- */}
                    {activeTab === 'records' && (
                        <div className="space-y-6 px-4 sm:px-0">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Medical Records</h2>
                            {medicalRecords.length > 0 ? (
                                <div className="bg-white shadow-md rounded-lg overflow-x-auto border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prescription</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {medicalRecords.map((record) => (
                                                <tr key={record.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.doctor}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.diagnosis}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.prescription}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <p className="text-gray-500">No medical records available.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- Book Appointment Tab --- */}
                    {activeTab === 'bookAppointment' && (
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Book a New Appointment</h3>
                                <p className="mt-1 text-sm text-gray-500">Select a doctor and choose a date and time.</p>
                            </div>
                            <form onSubmit={handleBookingSubmit} className="p-6 space-y-6">
                                {fetchDoctorsStatus.loading && <p className="text-center text-gray-500">Loading doctors...</p>}
                                {fetchDoctorsStatus.error && <p className="text-center text-red-600">{fetchDoctorsStatus.error}</p>}

                                {!fetchDoctorsStatus.loading && !fetchDoctorsStatus.error && (
                                    <>
                                        {/* Doctor Selection */}
                                        <div>
                                            <label htmlFor="doctor"className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
                                            <select
                                                id="doctor"
                                                name="doctor"
                                                value={selectedDoctorId}
                                                onChange={(e) => {
                                                    setSelectedDoctorId(e.target.value);
                                                    setBookingStatus({ loading: false, error: null, success: null });
                                                }}
                                                required
                                                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${selectedDoctorId ? 'border-gray-300' : 'border-red-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                                            >
                                                <option value="" disabled>-- Select a Doctor --</option>
                                                {doctors.length > 0 ? (
                                                    doctors.map((doctor) => (
                                                        <option key={doctor.doctorId} value={doctor.doctorId}>
                                                            Dr. {doctor.firstname} {doctor.lastname} ({doctor.specialty || 'General Practice'})
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="" disabled>No doctors available</option>
                                                )}
                                            </select>
                                        </div>

                                        {/* Date and Time Selection */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                                                <input
                                                    type="date"
                                                    id="appointmentDate"
                                                    name="appointmentDate"
                                                    value={appointmentDate}
                                                    onChange={(e) => {
                                                        setAppointmentDate(e.target.value);
                                                        setBookingStatus({ loading: false, error: null, success: null });
                                                    }}
                                                    required
                                                    min={getTodayDate()}
                                                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                                                <input
                                                    type="time"
                                                    id="appointmentTime"
                                                    name="appointmentTime"
                                                    value={appointmentTime}
                                                    onChange={(e) => {
                                                        setAppointmentTime(e.target.value);
                                                        setBookingStatus({ loading: false, error: null, success: null });
                                                    }}
                                                    required
                                                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Reason for Visit */}
                                        <div>
                                            <label htmlFor="appointmentReason" className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit (Optional)</label>
                                            <textarea
                                                id="appointmentReason"
                                                name="appointmentReason"
                                                rows="3"
                                                value={appointmentReason}
                                                onChange={(e) => setAppointmentReason(e.target.value)}
                                                placeholder="Briefly describe the reason for your appointment..."
                                                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            ></textarea>
                                        </div>

                                        {/* Booking Status Messages */}
                                        {bookingStatus.error && (
                                            <p className="text-sm text-red-600 text-center">{bookingStatus.error}</p>
                                        )}
                                        {bookingStatus.success && (
                                            <p className="text-sm text-green-600 text-center">{bookingStatus.success}</p>
                                        )}

                                        {/* Submit Button */}
                                        <div className="pt-4 text-right">
                                            <button
                                                type="submit"
                                                disabled={bookingStatus.loading || doctors.length === 0 || fetchDoctorsStatus.loading}
                                                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out"
                                            >
                                                {bookingStatus.loading ? 'Booking...' : 'Book Appointment'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>
                    )}

                    {/* --- Profile Tab --- */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6 px-4 sm:px-0">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Patient Profile</h2>
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Profile Information
                                        </h3>
                                        {!isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
                                            >
                                                <PencilIcon className="h-5 w-5 mr-2" />
                                                Edit Profile
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleSaveProfile}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150 ease-in-out"
                                                >
                                                    <CheckIcon className="h-5 w-5 mr-2" />
                                                    Save
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
                                                >
                                                    <XIcon className="h-5 w-5 mr-2" />
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-5 border-t border-gray-200 pt-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Profile Image */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                                                <div className="flex items-center">
                                                    {profileImage ? (
                                                        <div className="relative h-20 w-20 rounded-full overflow-hidden border border-gray-300">
                                                            <img
                                                                src={profileImage}
                                                                alt="Profile"
                                                                className="h-full w-full object-cover"
                                                            />
                                                            {isEditing && (
                                                                <label htmlFor="imageUpload" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                                                                    <CameraIcon className="h-6 w-6 text-white" />
                                                                </label>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="relative h-20 w-20 rounded-full border border-dashed border-gray-300 flex items-center justify-center">
                                                            <UserIcon className="h-8 w-8 text-gray-400" />
                                                            {isEditing && (
                                                                <label htmlFor="imageUpload" className="absolute inset-0 flex items-center justify-center cursor-pointer">
                                                                    <CameraIcon className="h-6 w-6 text-gray-400" />
                                                                </label>
                                                            )}
                                                        </div>
                                                    )}
                                                    {isEditing && (
                                                        <input
                                                            type="file"
                                                            id="imageUpload"
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                            className="hidden"
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            {/* First Name */}
                                            <ProfileField label="First Name" name="firstname" value={editableData.firstname} isEditing={isEditing} onChange={handleInputChange} />

                                            {/* Last Name */}
                                            <ProfileField label="Last Name" name="lastname" value={editableData.lastname} isEditing={isEditing} onChange={handleInputChange} />

                                            {/* Date of Birth */}
                                            <ProfileField label="Date of Birth" name="birthdate" value={editableData.birthdate ? editableData.birthdate.split('T')[0] : ''} isEditing={isEditing} onChange={handleInputChange} type="date" />
                                            <ProfileField label="Gender" name="gender" value={editableData.gender} isEditing={isEditing} onChange={handleInputChange} type="select" />

                                            {/* Contact Number */}
                                            <ProfileField label="Contact Number" name="contactNumber" value={editableData.contactNumber} isEditing={isEditing} onChange={handleInputChange} />
                                            {/* Home Address */}
                                            <ProfileField label="Home Address" name="homeAddress" value={editableData.homeAddress} isEditing={isEditing} onChange={handleInputChange} type="textarea" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                     {/* Fallback if no tab is matched (shouldn't happen with default) */}
                     {!tabs.some(tab => tab.id === activeTab) && (
                        <p className="text-center text-gray-500">Please select a section.</p>
                     )}
                </div>
            </main>
        </div>
    );
};

export default PatientDashboard;