import React from 'react';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <img src="/logo.png" alt="Logo" className="w-32 mx-auto mb-6" />
        <input 
          type="text" 
          placeholder="Username" 
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200">
          ▶
        </button>
        <a href="/signup" className="block text-center text-blue-600 hover:text-blue-800 mt-4 text-sm">
          Don't have an account? Sign up
        </a>
      </div>
    </div>
  );
};

export default Login;