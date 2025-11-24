import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/");
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-white">
            Healthy Gut AI
          </Link>
        </div>
        <div>
          {user ? (
            <div className="flex gap-4 items-center">
              <span className="text-sm text-gray-400">{user.name}</span>
              <Link
                to="/dashboard"
                className="text-sm text-gray-300 hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                to="/settings"
                className="text-sm text-gray-300 hover:text-white"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="text-sm text-gray-300">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-indigo-600 px-3 py-1 rounded"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
