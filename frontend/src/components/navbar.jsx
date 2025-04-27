import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-black text-white">
      <button className="text-2xl">☰</button>
      <div className="flex space-x-6">
        <a href="#" className="hover:underline">About</a>
        <a href="#" className="hover:underline">Contacts</a>
        <a href="#" className="hover:underline">Home</a>
        <a href="#" className="hover:underline">Support</a>
      </div>
    </nav>
  );
};

export default Navbar;