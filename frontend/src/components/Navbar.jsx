import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Also remove user data
    window.location.href = '/login'; // ✅ FIXED: lowercase 'l' and .href
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center text-white">
      <h1 className="font-bold text-xl cursor-pointer" onClick={() => navigate("/")}>
        StudyPal
      </h1>
      <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;