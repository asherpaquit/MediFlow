import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiX, FiCalendar, FiUsers, FiFileText, FiFilePlus, 
  FiSettings, FiLogOut, FiSearch, FiEye, FiCheck,
  FiUser, FiClock, FiHeart, FiDroplet, FiPlus
} from 'react-icons/fi';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [doctorData, setDoctorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = sessionStorage.getItem('doctorData');
    if (storedData) {
      setDoctorData(JSON.parse(storedData));
    } else {
      navigate('/doctor-login');
    }
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('doctorData');
    sessionStorage.removeItem('isDoctorAuthenticated');
    navigate('/doctor-login');
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (isLoading || !doctorData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 flex items-center">
            <FiHeart className="mr-2 text-blue-600" />
            MediFlow
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 flex items-center">
              <FiUser className="mr-1" />
              Dr. {doctorData.firstName} {doctorData.lastName}
              {doctorData.specialization && ` (${doctorData.specialization})`}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
            >
              <FiLogOut className="mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`${activeTab === 'appointments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FiCalendar className="mr-2" />
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`${activeTab === 'patients' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FiUsers className="mr-2" />
              Patients
            </button>
            <button
              onClick={() => setActiveTab('medicalRecords')}
              className={`${activeTab === 'medicalRecords' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FiFileText className="mr-2" />
              Medical Records
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`${activeTab === 'prescriptions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FiFilePlus className="mr-2" />
              Prescriptions
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`${activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FiSettings className="mr-2" />
              Profile Settings
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'appointments' && (
            <AppointmentsTab 
              doctorId={doctorData.doctorId} 
              onStatusChange={() => {
                triggerRefresh();
              }} 
            />
          )}
          {activeTab === 'patients' && (
            <PatientsTab 
              doctorId={doctorData.doctorId} 
              refreshTrigger={refreshTrigger} 
            />
          )}
          {activeTab === 'medicalRecords' && (
            <MedicalRecordsTab doctorId={doctorData.doctorId} />
          )}
          {activeTab === 'prescriptions' && (
            <PrescriptionsTab doctorId={doctorData.doctorId} />
          )}
          {activeTab === 'profile' && (
            <ProfileSettingsTab doctorData={doctorData} />
          )}
        </div>
      </div>
    </div>
  );
};

// Appointments Tab Component
const AppointmentsTab = ({ doctorId, onStatusChange }) => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingAppointments, setUpdatingAppointments] = useState({});
  const [notification, setNotification] = useState(null);

  const fetchAppointments = async () => {
    if (!doctorId) {
      setNotification({
        type: 'error',
        message: 'Doctor ID is missing'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://mediflow-s7af.onrender.com/api/appointments/doctor/${doctorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setNotification({
        type: 'error',
        message: 'Failed to fetch appointments'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    if (newStatus === 'Cancelled') {
        if (!window.confirm('Are you sure you want to cancel and delete this appointment?')) return;

        setUpdatingAppointments((prev) => ({ ...prev, [appointmentId]: true }));
        try {
            // Send DELETE request to remove the appointment
            const response = await fetch(`https://mediflow-s7af.onrender.com/api/appointments/${appointmentId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Failed to delete appointment');

            setNotification({
                type: 'success',
                message: 'Appointment deleted successfully',
            });

            // Remove the appointment from the state
            setAppointments((prev) => prev.filter((appt) => appt.appointmentId !== appointmentId));
            onStatusChange();
        } catch (error) {
            console.error('Error deleting appointment:', error);
            setNotification({
                type: 'error',
                message: 'Failed to delete appointment',
            });
        } finally {
            setUpdatingAppointments((prev) => ({ ...prev, [appointmentId]: false }));
        }
        
    } else {
        // Handle other status updates (e.g., Confirmed)
        if (!window.confirm('Are you sure you want to confirm this appointment?')) return;

        setUpdatingAppointments((prev) => ({ ...prev, [appointmentId]: true }));
        try {
            const response = await fetch(`https://mediflow-s7af.onrender.com/api/appointments/${appointmentId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update appointment status');

            setNotification({
                type: 'success',
                message: 'Appointment confirmed successfully',
            });

            await fetchAppointments();
            onStatusChange();
        } catch (error) {
            console.error('Error updating appointment status:', error);
            setNotification({
                type: 'error',
                message: 'Failed to update appointment status',
            });
        } finally {
            setUpdatingAppointments((prev) => ({ ...prev, [appointmentId]: false }));
        }
    }
};

  useEffect(() => {
    fetchAppointments();
  }, [doctorId]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {notification && (
        <div className={`mb-4 p-4 rounded-md ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notification.message}
          <button 
            onClick={() => setNotification(null)}
            className="float-right font-bold"
          >
            &times;
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-8">
          <FiClock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments scheduled</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new appointment.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.appointmentId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {appointment.patient.firstname} {appointment.patient.lastname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(appointment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.notes || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                      appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.status !== 'Confirmed' && (
                      <button 
                        onClick={() => handleStatusUpdate(appointment.appointmentId, 'Confirmed')}
                        className="text-green-600 hover:text-green-900 mr-3 flex items-center"
                        disabled={updatingAppointments[appointment.appointmentId]}
                      >
                        {updatingAppointments[appointment.appointmentId] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600 mr-1"></div>
                        ) : (
                          <FiCheck className="mr-1" />
                        )}
                        Confirm
                      </button>
                    )}
                    {appointment.status !== 'Cancelled' && (
                      <button 
                        onClick={() => handleStatusUpdate(appointment.appointmentId, 'Cancelled')}
                        className="text-red-600 hover:text-red-900 flex items-center"
                        disabled={updatingAppointments[appointment.appointmentId]}
                      >
                        {updatingAppointments[appointment.appointmentId] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600 mr-1"></div>
                        ) : (
                          <FiX className="mr-1" />
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
      )}
    </div>
  );
};

// Patients Tab Component
const PatientsTab = ({ doctorId, refreshTrigger }) => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
        const appointmentsResponse = await fetch(`https://mediflow-s7af.onrender.com/api/appointments/doctor/${doctorId}/status/Confirmed`);
        if (!appointmentsResponse.ok) throw new Error('Failed to fetch appointments');
        
        const appointmentsData = await appointmentsResponse.json();
        console.log('Confirmed Appointments:', appointmentsData); // Debug log
        setAppointments(appointmentsData);
    } catch (error) {
        console.error('Error fetching appointments:', error);
    } finally {
        setIsLoading(false);
    }
};

  const fetchPatients = async () => {
    if (!doctorId) {
      setError("Doctor ID is missing");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://mediflow-s7af.onrender.com/api/appointments/doctor/${doctorId}/status/Confirmed`
      );
      
      if (!response.ok) throw new Error(`Failed to fetch patients: ${response.status}`);
      
      const appointments = await response.json();
      
      const uniquePatients = Array.from(
        new Set(appointments.map(a => a.patient.id))
      ).map(id => {
          const appt = appointments.find(a => a.patient.id === id);
          const futureAppointments = appointments
            .filter(a => a.patient.id === id && new Date(a.date) > new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          
            const calculateAge = (birthdate) => {
            const today = new Date();
            const birthDate = new Date(birthdate);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
            return age;
            };

            return {
            id: appt.patient.id,
            name: `${appt.patient.firstname} ${appt.patient.lastname}`,
            age: appt.patient.birthdate ? calculateAge(appt.patient.birthdate) : 'N/A',
            gender: appt.patient.gender || 'N/A',
            lastVisit: appt.date,
            nextAppointment: futureAppointments[0]?.date
            };
        });
      
      setPatients(uniquePatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) fetchPatients();
  }, [doctorId, refreshTrigger]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <FiUsers className="mr-2 text-blue-600" />
        My Patients
      </h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : patients.length === 0 ? (
        <div className="text-center py-8">
          <FiUser className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {error ? 'Error loading patients' : 'No patients found'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {error ? 'Please try again later' : 'Patients will appear here after you confirm their appointments'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Appointment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {patient.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(patient.lastVisit).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center">
                      <FiEye className="mr-1" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Medical Records Tab Component
const MedicalRecordsTab = ({ doctorId }) => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://mediflow-s7af.onrender.com/api/doctors/${doctorId}/medical-records`);
        if (!response.ok) {
          throw new Error('Failed to fetch medical records');
        }
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error('Error fetching medical records:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [doctorId]);

  const filteredRecords = records.filter(record =>
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.recordType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <FiFileText className="mr-2 text-blue-600" />
          Medical Records
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search records..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-8">
          <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm ? 'No matching records found' : 'No medical records available'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try a different search term' : 'Medical records will appear here as they are created'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.patientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.recordType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{record.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center">
                      <FiEye className="mr-1" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Prescriptions Tab Component
// Prescriptions Tab Component
const PrescriptionsTab = ({ doctorId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    instructions: '',
    dateIssued: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch prescriptions
        const prescriptionsResponse = await fetch(`http://localhost:8080/api/prescriptions/doctor/${doctorId}`);
        if (!prescriptionsResponse.ok) throw new Error('Failed to fetch prescriptions');
        const prescriptionsData = await prescriptionsResponse.json();
        setPrescriptions(prescriptionsData);

        // Fetch confirmed appointments
        const appointmentsResponse = await fetch(`http://localhost:8080/api/appointments/doctor/${doctorId}/status/Confirmed`);
        if (!appointmentsResponse.ok) throw new Error('Failed to fetch appointments');
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      if (!selectedAppointment) {
        throw new Error('No appointment selected');
      }
  
      // Prepare the payload exactly as the backend expects
      const payload = {
        medication: formData.medication,
        dosage: formData.dosage,
        instructions: formData.instructions,
        dateIssued: formData.dateIssued, // Should be in YYYY-MM-DD format
        doctorId: Number(doctorId), // Convert to number
        patientId: Number(selectedAppointment.patient.patientId), // Convert to number
        appointmentId: selectedAppointment.appointmentId // Keep as string
      };
  
      console.log('Sending payload:', payload); // Debug log
  
      const response = await fetch('https://mediflow-s7af.onrender.com/api/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add if using authentication:
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        // Try to get error details from response
        const errorResponse = await response.json().catch(() => ({}));
        console.error('Server error response:', errorResponse);
        throw new Error(errorResponse.message || 'Failed to create prescription');
      }
  
      const newPrescription = await response.json();
      
      // Enhance the response with patient details for display
      const enhancedPrescription = {
        ...newPrescription,
        patient: {
          firstname: selectedAppointment.patient.firstname,
          lastname: selectedAppointment.patient.lastname
        }
      };
      
      setPrescriptions(prev => [...prev, enhancedPrescription]);
      setShowCreateForm(false);
      setFormData({
        medication: '',
        dosage: '',
        instructions: '',
        dateIssued: new Date().toISOString().split('T')[0],
      });
      
    } catch (error) {
      console.error('Error:', error);
      alert(`Error creating prescription: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCreateForm(true);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <FiFilePlus className="mr-2 text-blue-600" />
          Prescriptions
        </h2>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <FiPlus className="mr-1" />
          {showCreateForm ? 'Cancel' : 'New Prescription'}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium text-gray-900 mb-4">Create New Prescription</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select Patient Appointment</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e) => {
                const appointmentId = e.target.value;
                const appointment = appointments.find(a => a.appointmentId === appointmentId);
                setSelectedAppointment(appointment);
              }}
              value={selectedAppointment?.appointmentId || ''}
            >
              <option value="">Select an appointment</option>
              {appointments.map(appointment => (
                <option key={appointment.appointmentId} value={appointment.appointmentId}>
                  {appointment.patient.firstname} {appointment.patient.lastname} - 
                  {new Date(appointment.date).toLocaleDateString()} - {appointment.time}
                </option>
              ))}
            </select>
          </div>

          {selectedAppointment && (
            <form onSubmit={handleCreatePrescription}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Medication</label>
                  <input
                    type="text"
                    name="medication"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.medication}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Dosage</label>
                  <input
                    type="text"
                    name="dosage"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Instructions</label>
                  <textarea
                    name="instructions"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Date Issued</label>
                  <input
                    type="date"
                    name="dateIssued"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.dateIssued}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FiCheck className="mr-1" />
                      Create Prescription
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-8">
          <FiDroplet className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions issued</h3>
          <p className="mt-1 text-sm text-gray-500">Create a new prescription for your patient.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prescriptions.map((prescription) => (
                <tr key={prescription.prescriptionId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {prescription.patient?.firstname} {prescription.patient?.lastname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(prescription.dateIssued).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prescription.medication}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prescription.dosage}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{prescription.instructions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3 flex items-center"
                      onClick={() => {
                        setSelectedAppointment({
                          appointmentId: prescription.appointment?.appointmentId,
                          patient: prescription.patient
                        });
                        setFormData({
                          medication: prescription.medication,
                          dosage: prescription.dosage,
                          instructions: prescription.instructions,
                          dateIssued: prescription.dateIssued
                        });
                        setShowCreateForm(true);
                      }}
                    >
                      <FiEye className="mr-1" /> View/Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Profile Settings Tab Component
const ProfileSettingsTab = ({ doctorData }) => {
  const [formData, setFormData] = useState({
    firstName: doctorData.firstName || '',
    lastName: doctorData.lastName || '',
    email: doctorData.email || '',
    contactNumber: doctorData.contactNumber || '',
    medicalLicenseNumber: doctorData.medicalLicenseNumber || '',
    specialization: doctorData.specialization || '',
    yearsOfExperience: doctorData.yearsOfExperience || '',
    affiliatedHospitalStatus: doctorData.affiliatedHospitalStatus || '',
    consultationFee: doctorData.consultationFee || '',
    baseSalary: doctorData.baseSalary || ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const response = await fetch(`https://mediflow-s7af.onrender.com/api/user-doctors/${doctorData.doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      sessionStorage.setItem('doctorData', JSON.stringify(updatedData));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
        <FiSettings className="mr-2 text-blue-600" />
        Profile Settings
      </h2>

      <form onSubmit={handleSubmit}>
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DoctorDashboard;