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
    HomeIcon,
    RefreshIcon,
    TrashIcon
} from '@heroicons/react/outline';

// --- StatCard Component ---
const StatCard = ({ label, count, color }) => (
    <div className={`bg-${color}-50 p-4 rounded-lg shadow-sm`}>
        <h3 className={`font-medium text-sm text-${color}-800`}>{label}</h3>
        <p className={`text-3xl font-bold text-${color}-600`}>{count}</p>
    </div>
);

// --- ProfileField Component ---
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

    // --- State Management ---
    const storedPatientData = JSON.parse(sessionStorage.getItem('patientData'));
    const [patientData, setPatientData] = useState(storedPatientData || {});
    const [editableData, setEditableData] = useState(storedPatientData || {});
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(() => sessionStorage.getItem('profileImage') || '');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [isLoadingRecords, setIsLoadingRecords] = useState(false);
    const [cancellingAppointment, setCancellingAppointment] = useState(null);

    // --- Appointment Booking State ---
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

    // --- Fetch Appointments from Backend ---
    const fetchAppointments = async () => {
        if (!patientData || !patientData.patientId) return;

        setIsLoadingAppointments(true);
        try {
            const response = await fetch(`https://mediflow-s7af.onrender.com/api/appointments/patient/${patientData.patientId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }
            const data = await response.json();

            console.log('Appointments Response:', data); // Debugging log

            const formattedAppointments = await Promise.all(
                data.map(async (appointment) => {
                    let doctorName = 'Unknown Doctor';
                    if (appointment.doctorId) {
                        try {
                            const doctorResponse = await fetch(`https://mediflow-s7af.onrender.com/api/user-doctors/${appointment.doctorId}`);
                            if (doctorResponse.ok) {
                                const doctor = await doctorResponse.json();
                                doctorName = `Dr. ${doctor.firstname} ${doctor.lastname}`;
                            } else {
                                console.error(`Failed to fetch doctor details for doctorId: ${appointment.doctorId}`);
                            }
                        } catch (err) {
                            console.error('Error fetching doctor details:', err);
                        }
                    } else {
                        console.warn('Missing doctorId for appointment:', appointment);
                    }

                    return {
                        ...appointment,
                        doctor: doctorName,
                        date: new Date(appointment.date).toLocaleDateString(),
                    };
                })
            );

            setUpcomingAppointments(formattedAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setIsLoadingAppointments(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [patientData?.patientId]);

    // --- Fetch Medical Records from Backend ---
    const fetchMedicalRecords = async () => {
        if (!patientData || !patientData.patientId) return;

        setIsLoadingRecords(true);
        try {
            const response = await fetch(`https://mediflow-s7af.onrender.com/api/medical-records/patient/${patientData.patientId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch medical records');
            }
            const data = await response.json();

            console.log('Medical Records Response:', data); // Debugging log

            const formattedRecords = await Promise.all(
                data.map(async (record) => {
                    let doctorName = 'Unknown Doctor';
                    if (record.doctorId) {
                        try {
                            const doctorResponse = await fetch(`https://mediflow-s7af.onrender.com/api/user-doctors/${record.doctorId}`);
                            if (doctorResponse.ok) {
                                const doctor = await doctorResponse.json();
                                doctorName = `Dr. ${doctor.firstname} ${doctor.lastname}`;
                            } else {
                                console.error(`Failed to fetch doctor details for doctorId: ${record.doctorId}`);
                            }
                        } catch (err) {
                            console.error('Error fetching doctor details:', err);
                        }
                    } else {
                        console.warn('Missing doctorId for record:', record);
                    }

                    return {
                        doctor: doctorName,
                        date: new Date(record.date).toLocaleDateString(),
                        medication: record.prescription?.medication || 'N/A',
                        dosage: record.prescription?.dosage || 'N/A',
                        instructions: record.prescription?.instructions || 'N/A',
                    };
                })
            );

            setMedicalRecords(formattedRecords);
        } catch (error) {
            console.error('Error fetching medical records:', error);
        } finally {
            setIsLoadingRecords(false);
        }
    };

    useEffect(() => {
        fetchMedicalRecords();
    }, [patientData?.patientId]);

    // --- Effect to Fetch Doctors ---
    useEffect(() => {
        const fetchDoctors = async () => {
            setFetchDoctorsStatus({ loading: true, error: null });
            try {
                const response = await fetch('https://mediflow-s7af.onrender.com/api/user-doctors');
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
    }, []);

    // --- Cancel Appointment Handler ---
    const handleCancelAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

        setCancellingAppointment(appointmentId);
        try {
            const response = await fetch(`https://mediflow-s7af.onrender.com/api/appointments/${appointmentId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Cancelled' })
            });

            if (!response.ok) throw new Error('Failed to cancel appointment');

            await fetchAppointments();
            alert('Appointment cancelled successfully');
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            alert('Failed to cancel appointment');
        } finally {
            setCancellingAppointment(null);
        }
    };

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
        try {
            const response = await fetch(`https://mediflow-s7af.onrender.com/api/user-patients/${patientData.patientId}`, { 
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editableData),
            });

            if (response.ok) {
                const updated = await response.json();
                setPatientData(updated);
                setEditableData(updated);
                sessionStorage.setItem('patientData', JSON.stringify(updated));
                setIsEditing(false);
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile.');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred.');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                sessionStorage.setItem('profileImage', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Handler for Booking Appointment ---
    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingStatus({ loading: true, error: null, success: null });

        if (!selectedDoctorId || !appointmentDate || !appointmentTime) {
            setBookingStatus({ loading: false, error: 'Please select a doctor, date, and time.', success: null });
            return;
        }

        if (!patientData || !patientData.patientId) {
            setBookingStatus({ loading: false, error: 'Patient information is missing. Please try logging in again.', success: null });
            return;
        }

        const formattedDate = new Date(appointmentDate).toISOString().split('T')[0];
        const formattedTime = appointmentTime;

        const appointmentPayload = {
            patientId: Number(patientData.patientId),
            doctorId: Number(selectedDoctorId),
            date: formattedDate,
            time: formattedTime,
            notes: appointmentReason || null,
        };

        try {
            const response = await fetch('https://mediflow-s7af.onrender.com/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentPayload),
            });

            if (response.ok) {
                const newAppointment = await response.json();
                const doctor = doctors.find((d) => d.doctorId === newAppointment.doctorId);
                const formattedAppointment = {
                    ...newAppointment,
                    doctor: doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor',
                    status: 'Pending',
                    date: new Date(newAppointment.date).toLocaleDateString(),
                };

                const updatedAppointments = [...upcomingAppointments, formattedAppointment];

                setBookingStatus({ loading: false, error: null, success: 'Appointment booked successfully!' });
                setUpcomingAppointments(updatedAppointments);
                localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

                setSelectedDoctorId('');
                setAppointmentDate('');
                setAppointmentTime('');
                setAppointmentReason('');
                setTimeout(() => setBookingStatus((prev) => ({ ...prev, success: null })), 5000);
            } else {
                const contentType = response.headers.get('content-type');
                let errorMessage = 'Failed to book appointment.';

                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData?.message || errorMessage;
                } else {
                    errorMessage = await response.text(); 
                }

                throw new Error(errorMessage);
            }
        } catch (err) {
            console.error('Error booking appointment:', err);
            setBookingStatus({ loading: false, error: err.message || 'An error occurred during booking.', success: null });
            setTimeout(() => setBookingStatus((prev) => ({ ...prev, error: null })), 5000);
        }
    };
    
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
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {patientData.firstname || 'Patient'} {patientData.lastname}!</h1>
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
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {upcomingAppointments.map((appointment) => (
                                                    <tr key={appointment.appointmentId}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.time}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Dr. {appointment.doctor}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                                                                appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                                                                'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                                {appointment.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {appointment.status === 'Pending' && (
                                                                <button
                                                                    onClick={() => handleCancelAppointment(appointment.appointmentId)}
                                                                    disabled={cancellingAppointment === appointment.appointmentId}
                                                                    className="text-red-600 hover:text-red-900 flex items-center"
                                                                >
                                                                    {cancellingAppointment === appointment.appointmentId ? (
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600 mr-1"></div>
                                                                    ) : (
                                                                        <TrashIcon className="h-4 w-4 mr-1" />
                                                                    )}
                                                                    Cancel
                                                                </button>
                                                            )}
                                                        </td>
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
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold text-gray-800">My Appointments</h2>
                                <button 
                                    onClick={fetchAppointments}
                                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 flex items-center"
                                    disabled={isLoadingAppointments}
                                >
                                    {isLoadingAppointments ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Refreshing...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshIcon className="h-4 w-4 mr-1" />
                                            Refresh
                                        </>
                                    )}
                                </button>
                            </div>
                            
                            {isLoadingAppointments ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : upcomingAppointments.length > 0 ? (
                                <div className="bg-white shadow-md rounded-lg overflow-x-auto border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {upcomingAppointments.map((appointment) => (
                                                <tr key={appointment.appointmentId}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.time}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Dr. {appointment.doctor}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                                                            appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {appointment.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {appointment.status === 'Pending' && (
                                                            <button
                                                                onClick={() => handleCancelAppointment(appointment.appointmentId)}
                                                                disabled={cancellingAppointment === appointment.appointmentId}
                                                                className="text-red-600 hover:text-red-900 flex items-center"
                                                            >
                                                                {cancellingAppointment === appointment.appointmentId ? (
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600 mr-1"></div>
                                                                ) : (
                                                                    <TrashIcon className="h-4 w-4 mr-1" />
                                                                )}
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </td>
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
                            {isLoadingRecords ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : medicalRecords.length > 0 ? (
                                <div className="bg-white shadow-md rounded-lg overflow-x-auto border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {medicalRecords.map((record, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.doctor}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.medication}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.dosage}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.instructions}</td>
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
                                                            Dr. {doctor.firstname} {doctor.lastname} ({doctor.specialization || 'General Practice'})
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
                        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                            {/* Profile Header with Gradient */}
                            <div className="bg-gradient-to-r from-blue-500 to-teal-400 px-6 py-8 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-bold">Your Profile</h3>
                                        <p className="text-blue-100">Manage your personal information</p>
                                    </div>
                                    {!isEditing ? (
                                        <button 
                                            onClick={() => setIsEditing(true)} 
                                            className="px-4 py-2 text-sm bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all flex items-center gap-2 shadow-md"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <div className="space-x-2">
                                            <button 
                                                onClick={handleCancelEdit} 
                                                className="px-4 py-2 text-sm border border-white bg-transparent text-white rounded-lg hover:bg-white hover:bg-opacity-20 transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={handleSaveProfile} 
                                                className="px-4 py-2 text-sm bg-white text-teal-600 rounded-lg hover:bg-teal-50 transition-all font-medium flex items-center gap-2"
                                            >
                                                <CheckIcon className="h-4 w-4" />
                                                Save Changes
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Profile Content */}
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Profile Picture Section */}
                                    <div className="md:w-1/3 flex flex-col items-center">
                                        <div className="relative group">
                                            {profileImage ? (
                                                <img 
                                                    src={profileImage} 
                                                    alt="Profile" 
                                                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                                                />
                                            ) : (
                                                <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border-4 border-white shadow-lg">
                                                    <UserIcon className="h-16 w-16" />
                                                </div>
                                            )}
                                            {isEditing && (
                                                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-600 transition-all">
                                                    <CameraIcon className="h-5 w-5" />
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        onChange={handleImageUpload} 
                                                        className="hidden" 
                                                    />
                                                </label>
                                            )}
                                        </div>
                                        
                                        {isEditing && (
                                            <p className="mt-3 text-xs text-gray-500 text-center">
                                                Click on the camera icon to upload a new photo
                                            </p>
                                        )}
                                        
                                        <div className="mt-6 w-full">
                                            <h4 className="font-medium text-gray-700 mb-2">Account Information</h4>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <ProfileField 
                                                    label="Username" 
                                                    name="username" 
                                                    value={editableData.username} 
                                                    isEditing={false} 
                                                />
                                                <ProfileField 
                                                    label="Email Address" 
                                                    name="emailAddress" 
                                                    value={editableData.emailAddress} 
                                                    isEditing={isEditing} 
                                                    onChange={handleInputChange} 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profile Details Section */}
                                    <div className="md:w-2/3">
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <ProfileField 
                                                    label="First Name" 
                                                    name="firstname" 
                                                    value={editableData.firstname} 
                                                    isEditing={isEditing} 
                                                    onChange={handleInputChange} 
                                                />
                                                <ProfileField 
                                                    label="Middle Name" 
                                                    name="middlename" 
                                                    value={editableData.middlename} 
                                                    isEditing={isEditing} 
                                                    onChange={handleInputChange} 
                                                />
                                                <ProfileField 
                                                    label="Last Name" 
                                                    name="lastname" 
                                                    value={editableData.lastname} 
                                                    isEditing={isEditing} 
                                                    onChange={handleInputChange} 
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <ProfileField 
                                                    label="Birthdate" 
                                                    name="birthdate" 
                                                    value={editableData.birthdate} 
                                                    isEditing={isEditing} 
                                                    onChange={handleInputChange} 
                                                    type="date" 
                                                />
                                                <ProfileField 
                                                    label="Gender" 
                                                    name="gender" 
                                                    value={editableData.gender} 
                                                    isEditing={isEditing} 
                                                    onChange={handleInputChange} 
                                                    type="select" 
                                                />
                                            </div>
                                            
                                            <ProfileField 
                                                label="Contact Number" 
                                                name="contactNumber" 
                                                value={editableData.contactNumber} 
                                                isEditing={isEditing} 
                                                onChange={handleInputChange} 
                                            />
                                            
                                            <ProfileField 
                                                label="Home Address" 
                                                name="homeAddress" 
                                                value={editableData.homeAddress} 
                                                isEditing={isEditing} 
                                                onChange={handleInputChange} 
                                                type="textarea" 
                                            />
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