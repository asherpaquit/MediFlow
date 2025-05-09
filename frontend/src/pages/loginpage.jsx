import React from 'react';
import Navbar from '../components/navbar';
import Login from '../components/login';
import logo from '..'

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Login />
    </div>
  );
};

export default LoginPage;