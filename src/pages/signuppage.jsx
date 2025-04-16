import React from 'react';
import Navbar from '../components/navbar';
import Signup from '../components/signup';

const SignupPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Signup />
    </div>
  );
};

export default SignupPage;