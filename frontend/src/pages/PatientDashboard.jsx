import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PencilIcon, 
  CheckIcon, 
  CameraIcon, 
  UserIcon,
  XIcon,
  ArrowLeftIcon
} from '@heroicons/react/outline';

const PatientDashboard = () => {
  const navigate = useNavigate();

  const storedPatientData = JSON.parse(sessionStorage.getItem('patientData'));
  const [patientData, setPatientData] = useState(storedPatientData || {});
  const [editableData, setEditableData] = useState(storedPatientData || {});
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(() => {
    return sessionStorage.getItem('profileImage') || '';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [upcomingAppointments] = useState([
    { id: 1, date: '2023-06-15', time: '10:30 AM', doctor: 'Dr. Sarah Johnson', specialty: 'Cardiology', status: 'Confirmed' },
    { id: 2, date: '2023-06-20', time: '2:15 PM', doctor: 'Dr. Michael Chen', specialty: 'Dermatology', status: 'Pending' }
  ]);

  const [medicalRecords] = useState([
    { id: 1, date: '2023-05-10', doctor: 'Dr. Sarah Johnson', diagnosis: 'Hypertension', prescription: 'Lisinopril 10mg daily' },
    { id: 2, date: '2023-03-22', doctor: 'Dr. Emily Wong', diagnosis: 'Annual Checkup', prescription: 'None' }
  ]);

  const handleLogout = () => {
    sessionStorage.removeItem('patientData');
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('profileImage');
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

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/user-patients/${patientData.id}`, {
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

  const StatCard = ({ label, count, color }) => (
    <div className={`bg-${color}-50 p-4 rounded-lg`}>
      <h3 className={`font-medium text-${color}-800`}>{label}</h3>
      <p className={`text-3xl font-bold text-${color}-600`}>{count}</p>
    </div>
  );

  const ProfileField = ({ label, name, value, isEditing, onChange, type = "text" }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isEditing ? (
        type === "select" ? (
          <select 
            name={name} 
            value={value || ''} 
            onChange={onChange} 
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center text-xl font-bold text-blue-600">
                <ArrowLeftIcon className="h-5 w-5 mr-2 cursor-pointer" onClick={() => navigate(-1)} />
                MediFlow
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {['dashboard', 'appointments', 'records', 'profile'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${activeTab === tab
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium capitalize`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden sm:flex items-center">
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md text-sm text-white bg-red-600 hover:bg-red-700 flex items-center gap-1"
              >
                <XIcon className="h-4 w-4" />
                Logout
              </button>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {['dashboard', 'appointments', 'records', 'profile'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${activeTab === tab
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium capitalize w-full text-left`}
                >
                  {tab}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="block pl-3 pr-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 w-full text-left"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-800">Welcome, {patientData.firstname || 'Patient'}!</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <StatCard label="Upcoming Appointments" count={upcomingAppointments.length} color="blue" />
                <StatCard label="Medical Records" count={medicalRecords.length} color="green" />
                <StatCard label="Prescriptions" count={medicalRecords.filter(r => r.prescription !== 'None').length} color="purple" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Appointments</h3>
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 2).map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{appointment.doctor}</p>
                        <p className="text-sm text-gray-500">{appointment.specialty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{appointment.date} at {appointment.time}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
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
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Your Appointments</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="mb-2 sm:mb-0">
                      <p className="font-medium text-gray-900">{appointment.doctor}</p>
                      <p className="text-sm text-gray-500">{appointment.specialty}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-900">{appointment.date} at {appointment.time}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
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
          </div>
        )}

        {activeTab === 'records' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Medical Records</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {medicalRecords.map((record) => (
                <div key={record.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{record.doctor}</p>
                      <p className="text-sm text-gray-500">{record.date}</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {record.diagnosis}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm">
                    <span className="font-medium">Prescription:</span> {record.prescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

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
                      onClick={handleSave} 
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
      </div>
    </div>
  );
};

export default PatientDashboard;