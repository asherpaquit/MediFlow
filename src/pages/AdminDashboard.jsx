import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  LogoutIcon,
  BellIcon,
  SearchIcon,
  CalendarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  DatabaseIcon,
  CashIcon,
  TicketIcon
} from '@heroicons/react/outline';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminData, setAdminData] = useState(null);

  // Sample data
  const [users, setUsers] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Doctor', status: 'Active', lastLogin: '2023-06-15 09:30' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Nurse', status: 'Active', lastLogin: '2023-06-15 10:15' },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', role: 'Patient', status: 'Inactive', lastLogin: '2023-06-10 14:45' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Receptionist', status: 'Active', lastLogin: '2023-06-15 08:20' },
    { id: 5, name: 'Robert Wilson', email: 'robert@example.com', role: 'Admin', status: 'Active', lastLogin: '2023-06-15 11:05' }
  ]);

  const [systemStats] = useState({
    totalUsers: 1245,
    activeUsers: 987,
    storageUsed: '75%',
    revenue: '$124,568',
    appointmentsToday: 42,
    pendingApprovals: 8
  });

  const [notifications] = useState([
    { id: 1, message: 'New registration request from Dr. Lisa Ray', time: '2 hours ago', read: false },
    { id: 2, message: 'System maintenance scheduled for tonight', time: '1 day ago', read: true }
  ]);

  useEffect(() => {
    // Get admin data from session storage
    const storedData = sessionStorage.getItem('adminData');
    if (storedData) {
      setAdminData(JSON.parse(storedData));
    } else {
      // If no admin data found, redirect to login
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminData');
    sessionStorage.removeItem('isAuthenticated');
    navigate('/admin/login');
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateUserStatus = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  if (!adminData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="flex items-center justify-center h-16 px-4 bg-indigo-600 text-white">
            <h1 className="text-xl font-bold">MediFlow Admin</h1>
          </div>
          <div className="flex flex-col flex-grow p-4 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              {[
                { name: 'Dashboard', icon: ChartBarIcon, tab: 'dashboard' },
                { name: 'User Management', icon: UsersIcon, tab: 'users' },
                { name: 'System Analytics', icon: DatabaseIcon, tab: 'analytics' },
                { name: 'Billing', icon: CashIcon, tab: 'billing' },
                { name: 'Appointments', icon: CalendarIcon, tab: 'appointments' },
                { name: 'Reports', icon: DocumentTextIcon, tab: 'reports' },
                { name: 'Security', icon: ShieldCheckIcon, tab: 'security' },
                { name: 'Settings', icon: CogIcon, tab: 'settings' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.tab)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.tab
                      ? 'bg-indigo-50 text-indigo-600'
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
                  placeholder="Search users, reports..."
                  className="block w-full py-2 pl-10 pr-3 text-sm bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-indigo-300 focus:ring-indigo-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-1 text-gray-400 hover:text-gray-500 relative">
                <BellIcon className="w-6 h-6" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <div className="flex items-center">
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-700">{adminData.name}</div>
                  <div className="text-xs text-gray-500">Administrator</div>
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
                <div className="flex items-center justify-center h-16 px-4 bg-indigo-600 text-white">
                  <h1 className="text-xl font-bold">MediFlow Admin</h1>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  <nav className="space-y-2">
                    {[
                      { name: 'Dashboard', icon: ChartBarIcon, tab: 'dashboard' },
                      { name: 'User Management', icon: UsersIcon, tab: 'users' },
                      { name: 'System Analytics', icon: DatabaseIcon, tab: 'analytics' },
                      { name: 'Billing', icon: CashIcon, tab: 'billing' },
                      { name: 'Appointments', icon: CalendarIcon, tab: 'appointments' },
                      { name: 'Reports', icon: DocumentTextIcon, tab: 'reports' },
                      { name: 'Security', icon: ShieldCheckIcon, tab: 'security' },
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
                            ? 'bg-indigo-50 text-indigo-600'
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                  title="Total Users" 
                  value={systemStats.totalUsers} 
                  icon={UsersIcon} 
                  color="indigo" 
                  trend="up" 
                  change="12% from last month"
                />
                <StatCard 
                  title="Active Users" 
                  value={systemStats.activeUsers} 
                  icon={ShieldCheckIcon} 
                  color="green" 
                  trend="up" 
                  change="5% from yesterday"
                />
                <StatCard 
                  title="Revenue" 
                  value={systemStats.revenue} 
                  icon={CashIcon} 
                  color="purple" 
                  trend="up" 
                  change="18% from last month"
                />
                <StatCard 
                  title="Storage Used" 
                  value={systemStats.storageUsed} 
                  icon={DatabaseIcon} 
                  color="blue" 
                  trend="same" 
                  change="No change"
                />
                <StatCard 
                  title="Today's Appointments" 
                  value={systemStats.appointmentsToday} 
                  icon={CalendarIcon} 
                  color="orange" 
                  trend="down" 
                  change="3% from yesterday"
                />
                <StatCard 
                  title="Pending Approvals" 
                  value={systemStats.pendingApprovals} 
                  icon={TicketIcon} 
                  color="red" 
                  trend="up" 
                  change="2 new requests"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {[
                      { id: 1, action: 'New user registration', user: 'Dr. Lisa Ray', time: '2 hours ago' },
                      { id: 2, action: 'Appointment booked', user: 'John Smith', time: '4 hours ago' },
                      { id: 3, action: 'System update applied', user: 'System', time: '1 day ago' },
                      { id: 4, action: 'Payment processed', user: 'Emily Davis', time: '1 day ago' },
                      { id: 5, action: 'Password reset', user: 'Michael Brown', time: '2 days ago' }
                    ].map((activity) => (
                      <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-gray-500">by {activity.user}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-right">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800">
                      View all activity →
                    </button>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                  </div>
                  <div className="p-6 grid grid-cols-2 gap-4">
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
                      <UsersIcon className="h-8 w-8 text-indigo-600" />
                      <span className="mt-2 text-sm font-medium">Add User</span>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
                      <CalendarIcon className="h-8 w-8 text-blue-600" />
                      <span className="mt-2 text-sm font-medium">Schedule</span>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
                      <DocumentTextIcon className="h-8 w-8 text-green-600" />
                      <span className="mt-2 text-sm font-medium">Generate Report</span>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
                      <CogIcon className="h-8 w-8 text-purple-600" />
                      <span className="mt-2 text-sm font-medium">Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                    + Add User
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-100">
                    Export
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <UserCircleIcon className="h-10 w-10 text-gray-400" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'Doctor' ? 'bg-blue-100 text-blue-800' :
                              user.role === 'Nurse' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                              {user.status === 'Active' ? (
                                <button 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => updateUserStatus(user.id, 'Inactive')}
                                >
                                  Deactivate
                                </button>
                              ) : (
                                <button 
                                  className="text-green-600 hover:text-green-900"
                                  onClick={() => updateUserStatus(user.id, 'Active')}
                                >
                                  Activate
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          No users found matching your search
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* System Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900">System Performance</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Server Uptime</h4>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '99.9%' }}></div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">99.9% uptime over last 30 days</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Storage Usage</h4>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: systemStats.storageUsed }}></div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">{systemStats.storageUsed} of storage used</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900">User Activity</h3>
                </div>
                <div className="p-6">
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">User activity chart would be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
              </div>
              <div className="p-6">
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <UserCircleIcon className="h-24 w-24 text-gray-400" />
                      <label className="absolute bottom-0 right-0 bg-indigo-500 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-600">
                        <CameraIcon className="h-4 w-4" />
                        <input type="file" className="hidden" />
                      </label>
                    </div>
                    <h2 className="mt-4 text-lg font-medium">{adminData.name}</h2>
                    <p className="text-sm text-gray-500">Administrator</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={adminData.email}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">System Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value="MediFlow Healthcare System"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Timezone</label>
                      <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                        <option>(UTC-06:00) Central Time (US & Canada)</option>
                        <option>(UTC-07:00) Mountain Time (US & Canada)</option>
                        <option>(UTC-08:00) Pacific Time (US & Canada)</option>
                      </select>
                    </div>

                    <div className="pt-4">
                      <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would be implemented similarly */}
          {activeTab === 'billing' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Billing Information</h3>
              </div>
              <div className="p-6">
                <div className="text-center py-8 text-gray-500">
                  <CashIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Billing dashboard</h3>
                  <p className="mt-1 text-sm text-gray-500">Payment history and subscription details would be displayed here</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Appointment Management</h3>
              </div>
              <div className="p-6">
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Appointment scheduling</h3>
                  <p className="mt-1 text-sm text-gray-500">View and manage all appointments in the system</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Reports</h3>
              </div>
              <div className="p-6">
                <div className="text-center py-8 text-gray-500">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Generate Reports</h3>
                  <p className="mt-1 text-sm text-gray-500">Create custom reports on system usage and activity</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
              </div>
              <div className="p-6">
                <div className="text-center py-8 text-gray-500">
                  <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Security Configuration</h3>
                  <p className="mt-1 text-sm text-gray-500">Configure security policies and access controls</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Enhanced StatCard Component
const StatCard = ({ title, value, icon: Icon, color, trend, change }) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600'
  };

  const trendIcons = {
    up: (
      <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H9v1h2a1 1 0 110 2H9v1h2a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H5a1 1 0 110-2h2v-1H5a1 1 0 110-2h2V8H5a1 1 0 010-2h2V5a1 1 0 112 0v1h2a1 1 0 011 1z" clipRule="evenodd" />
      </svg>
    ),
    down: (
      <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
    same: (
      <svg className="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    )
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
                <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  {trendIcons[trend]}
                  <span className="sr-only">{trend === 'up' ? 'Increased' : trend === 'down' ? 'Decreased' : 'No change'} by</span>
                  <span className="ml-1 text-xs text-gray-500">{change}</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;