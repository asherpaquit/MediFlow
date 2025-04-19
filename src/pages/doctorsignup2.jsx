import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DoctorSignup2 = () => {
    const navigate = useNavigate();

    // Retrieve data from sessionStorage
    const step1Data = JSON.parse(sessionStorage.getItem('doctorSignupStep1')) || {};

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        taskNumber: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Combine data from both steps
        const doctorData = {
            ...step1Data,
            username: formData.username,
            password: formData.password,
            taskNumber: formData.taskNumber
        };

        try {
            const response = await fetch('http://localhost:8080/api/user-doctors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(doctorData),
            });

            if (!response.ok) {
                throw new Error('Failed to register doctor');
            }

            // Clear sessionStorage after successful registration
            sessionStorage.removeItem('doctorSignupStep1');
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-black text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold">MediFlow</Link>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-12 max-w-md">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-bold text-center mb-8">Complete Your Doctor Account</h1>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-700 mb-2">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Minimum 8 characters with at least 1 number and 1 special character
                            </p>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Task Number (if applicable)</label>
                            <input
                                type="text"
                                name="taskNumber"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.taskNumber}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            <Link to="/doctor-signup-1" className="text-blue-600 hover:text-blue-800">
                                ← Back
                            </Link>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition duration-200"
                            >
                                Complete Registration
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoctorSignup2;