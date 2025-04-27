import React from 'react';
import Navbar from './navbar';
import Signup from '../pages/signup';

const SignupPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Signup />
    </div>
  );
};

export default SignupPage;