import React from 'react';
import Navbar from './navbar';
import Login from '../pages/login';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Login />
    </div>
  );
};

export default LoginPage;